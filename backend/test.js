const web3 = require("./src/web3/web3Provider");
// console.log(web3);
web3.eth.getBlockNumber().then(console.log);
