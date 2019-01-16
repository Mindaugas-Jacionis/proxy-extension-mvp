## Prerequisites:

- [Unix-like][unix-like-wiki] operating system that has properly working
  [shell][unix-shell-wiki] or `z-shell`. We recommend MacOS as this is the environment we tested the setup on. Without proper `shell` support there might be issues with setup scripts.

- Terminal;  
  We recommend: [iTerm2][iterm2] on MacOS,
  or [Hyper][hyper-terminal] for other platforms.

- [Node][node-js-download] and `npm` which is shipped together with `node`.
  To check if you have them: 1. Open terminal and write `node -v && npm -v`
  it should print two [semver][semver-docs] numbers into terminal, first one is
  your `node` version that we recommend to keep above 8.x.x and second one is
  `npm` version. If there is only one number or no numbers, or an error
  printed - go to [Node website][node-js-download] and
  download latest version for your OS;

- [`VirtualBox`](https://www.virtualbox.org/wiki/Downloads) - needed for virtual server box
  on your machine. We've had some issues on Mac OS with `6.0.2` version & recommend
  using [`5.2.6`](https://www.virtualbox.org/wiki/Download_Old_Builds_5_2) as this definitely works on our machine;

- [`Vagrant`](https://www.vagrantup.com/downloads.html) - needed for setting up
  proxy server locally. Just simply download and install based on your operating system;

## Setup:

- Open your `terminal` app in root directory of this extension.
  Root directory is the top most directory that holds all files including
  `package.json` file, which is the file that defines script needed to setup the environment

- In your terminal write `npm run setup` - this will manage all necessary
  steps to create local proxy server on your machine(using `vagrant` & `virtual box`),
  on port `3128`, so make sure the port is free.

- Once `setup` is finished you'll be able to see one server machine running on `virtual box`.
  It is now working as auth protected proxy with credentials: `new_user` && `new_password`.
  Those are hardcoded in the source of extension and you shouldn't need to enter them by hand.

- In your `Chrome` browser open: `chrome://extensions`, then click on `Developer Mode` switch
  if it is not `ON`. Then click `Load Unpacked` button and navigate to this directory, select
  `src` subdirectory(this is where the extension source code is) and then click `open`/`select`;

- You will see new extension named `Proxy Extension for Privacy` - this is the extension for
  debugging the auth prompt issue.

## Reproducing the Bug:

- Once setup is done, open up extension popup and click on `Connect` button.
  This will connect to the local proxy server that we launched in setup;

- If you try to browse - all will be good. Extension will catch auth requests from
  the proxy server and will send back the hardcoded credentials;

- Issue happens when you "Hard Quit" the browser while being connected to the proxy.
  This can be done via holding `command + Q` shortcut;

- Once you launch the browser after "Hard Quit" - auth prompt appears. Though,
  if you decide to ignore it and try to browse - all good, proxy is still working,
  internet is not blocked as well;

## Extra Info

We've identified that this happens because `proxy settings` are still in place
after the "Hard Quit", but not lake in older versions - chrome doesn't respect
the extension and starts sending network requests while extension is not yet
initialized by the browser itself.
This seems to be a `regression` as tested on older versions of chrome showed no
such behaviour, as well testing with extensions that had no such issue in the past
on current version of `Chrome` proves that this affects any proxy extension that
has authentication step.

[unix-shell-wiki]: https://en.wikipedia.org/wiki/Unix_shell
[unix-like-wiki]: https://en.wikipedia.org/wiki/Unix-like
[iterm2]: https://www.iterm2.com/downloads.htm
[hyper-terminal]: https://hyper.is/#installation
[node-js-download]: https://nodejs.org/en/download/
[semver-docs]: https://semver.org/
