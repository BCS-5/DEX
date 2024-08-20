const { Web3 } = require("web3");
require("dotenv").config();
const {contracts} = require("./contracts/addresses.js")   

const web3 = new Web3("wss://ethereum-sepolia-rpc.publicnode.com");

const accountBalanceContract = new web3.eth.Contract(contracts.accountBalance.abi,contracts.accountBalance.address);
const clearingHouseContract = new web3.eth.Contract(contracts.clearingHouse.abi,contracts.clearingHouse.address);
const poolContract = new web3.eth.Contract(contracts.uniswapV2Pair.abi, "0x51AC7a5363751fa19F1186f850f15a1E1Dd8F8db");

const account = web3.eth.accounts.privateKeyToAccount('0x' + process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account)

const calculateDxDy = (x, y, k) => {
  const dx = x - Math.sqrt((x * y) / k);
  const dy = k * (x - dx) - y;

  return { dx, dy };
}

const getIndexPrice = async () => {
  fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=USD").then((response) => response.json().then(setIndexPrice))
}

const setIndexPrice = async (res) => {
    const indexPrice = BigInt(res.RAW.BTC.USD.PRICE * 10 ** 18)
    // accountBalanceContract.methods.setIndexPrice("0x1BCe644E5AEe9cEb88b13fa4894f7a583e7E350b", indexPrice).send({
    //   from: account.address,
    //   gas: 300000
    // });
    const reserves = await poolContract.methods.getReserves().call()
    const [amount0, amount1] = [reserves[0], reserves[1]];

    const markPrice = amount1 * 10n ** 20n /amount0;
    const percent = markPrice/100n;
    const diff = (markPrice - indexPrice) / 10n ** 12n;

    const {dx, dy} = calculateDxDy(Number(amount0), Number(amount1), Number(indexPrice) / 100);
    
    

     
}

setInterval(() => {

}, 5 * 60 * 1000)

setTimeout(() => {
  getIndexPrice();
}, 100)


// nohup node trading.js > trading.out 2>&1 &