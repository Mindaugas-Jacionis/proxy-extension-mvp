const app = document.getElementById("app");
const portName = "MVP-EXTENSION";
let isReady = false;
let state = {};

const port = chrome.runtime.connect({ name: portName });

const toggleConnection = () => {
  chrome.runtime.sendMessage({
    port: port.name,
    type: state.connected ? "DISPATCH_DISCONNECT" : "DISPATCH_CONNECT"
  });
};

const render = () => {
  if (isReady) {
    const id = "Connection-button";
    const connectionButton =
      document.getElementById(id) || document.createElement("button");

    connectionButton.id = id;
    connectionButton.textContent = state.connected ? "Disconnect" : "Connect";
    connectionButton.className = state.connected ? "" : "green";
    connectionButton.addEventListener("click", toggleConnection);
    app.appendChild(connectionButton);
  }
};

port.onMessage.addListener(message => {
  console.log("I got message", message);
  if (message.type === "STATE_TYPE") {
    state = message.payload || {};

    if (!isReady) {
      isReady = true;
    }

    render();
  }
});

document.addEventListener("DOMContentLoaded", render);
