const { Web3, WebSocketProvider } = require("web3");
require("dotenv").config();

const websocketUrl = `wss://sepolia.infura.io/ws/v3/${process.env.INFURA_API_KEY}`;

// WebSocketProvider를 사용하여 Web3 인스턴스 생성
function createWeb3Instance() {
  const provider = new WebSocketProvider(
    websocketUrl,
    {},
    {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 999999999,
      onTimeout: true,
    }
  );
  const web3 = new Web3(provider);

  provider.on("connect", () => {
    console.log("WebSocket connected");
  });

  provider.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  provider.on("reconnect", (attempt) => {
    console.log(`Reconnecting... Attempt: ${attempt} ${Date.now()}`);
  });

  provider.on("close", (code, reason) => {
    console.log(`WebSocket closed. Code: ${code}, Reason: ${reason}`);
  });

  return web3;
}

const web3 = createWeb3Instance();
module.exports = web3;
