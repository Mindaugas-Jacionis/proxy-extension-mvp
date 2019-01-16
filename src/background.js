const credentials = {
  username: "new_user",
  password: "new_password",
  host: "127.0.0.1"
};
const portName = "MVP-EXTENSION";
let sendPort = null;
let state = { connected: false };

const sendState = () => {
  window.localStorage.setItem("state", JSON.stringify(state));
  sendPort.postMessage({
    type: "STATE_TYPE",
    payload: state
  });
};

const connect = () => {
  const singleProxy = {
    host: credentials.host,
    port: 3128,
    scheme: "http"
  };

  const config = {
    mode: "fixed_servers",
    rules: {
      singleProxy,
      bypassList: [
        "10.0.0.0/8",
        "127.0.0.0/8",
        "172.16.0.0/12",
        "192.168.0.0/16",
        "::1/128",
        "localhost",
        "*.local"
      ]
    }
  };

  chrome.proxy.settings.set({ value: config, scope: "regular" }, event => {
    state = { ...state, connected: true };
    sendState();
  });
};

const disconnect = () => {
  chrome.proxy.settings.clear({ scope: "regular" }, () => {
    state = { ...state, connected: false };
    sendState();
  });
};

const initializeState = () => {
  state = JSON.parse(window.localStorage.getItem("state")) || {};

  chrome.runtime.onMessage.addListener(({ type, port }) => {
    if (port !== portName) {
      return;
    }

    if (type === "DISPATCH_CONNECT") {
      connect();
    }

    if (type === "DISPATCH_DISCONNECT") {
      disconnect();
    }
  });

  chrome.runtime.onConnect.addListener(port => {
    if (port.name !== portName) {
      return;
    }

    sendPort = port;
    sendState();
  });
};

const authenticate = () => {
  chrome.webRequest.onAuthRequired.addListener(
    details => {
      const { username, password, host } = credentials;
      const { isProxy, challenger } = details;

      if (isProxy && challenger.host === host) {
        return {
          authCredentials: {
            username,
            password
          }
        };
      }
      return {};
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
  );
};

authenticate();
initializeState();
