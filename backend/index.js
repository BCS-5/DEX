const express = require("express");
const cors = require('cors');
const sqlite3 = require("sqlite3").verbose();
const { Web3 } = require("web3");
const V2PairABI = require("./abis/UniswapV2Pair.json");
const ERC20ABI = require("./abis/ERC20.json");
require("dotenv").config();

// const web3 = new Web3("wss://ethereum-sepolia-rpc.publicnode.com");
// const web3 = new Web3("wss://ethereum-rpc.publicnode.com");
const web3 = new Web3(
  `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_API_KEY}`
);
const app = express();
const port = 8090;

const resolutionToTable = ["1", "5", "15", "30", "60", "1D", "1W"];
const lastUpdateTime = [
  1722470400000, 1722470400000, 1722470400000, 1722470400000, 1722470400000,
  1722470400000, 1722470400000,
];

// JSON 형식의 요청 본문을 파싱하기 위한 미들웨어 설정
app.use(express.json());
app.use(cors());

// SQLite 데이터베이스 연결 및 테이블 생성
const db = new sqlite3.Database("mydatabase.db");

db.serialize(() => {
  resolutionToTable.forEach((t) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS BTC_DATA_${t} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          time INTEGER NOT NULL,
          open REAL NOT NULL,
          high REAL NOT NULL,
          low REAL NOT NULL,
          close REAL NOT NULL,
          volume REAL NOT NULL
      );`
    );
    const query = `SELECT COUNT(*) AS count FROM BTC_DATA_${t}`;
    db.get(query, (err, row) => {
      if (err) {
        console.error(
          `Error retrieving data from "BTC_DATA_${t}":`,
          err.message
        );
      } else {
        if (row.count == 0) {
          db.run(
            `INSERT INTO BTC_DATA_${t} 
                    (time, open, high, low, close, volume)
                    VALUES (?, ?, ?, ?, ?, ?)`,
            [0, 0.0, 0.0, 0.0, 0.0, 0.0],
            function (err) {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }
            }
          );
        }
      }
    });
  });
});

db.serialize(() => {
  resolutionToTable.forEach((t,idx) => {
    db.get(`SELECT * FROM BTC_DATA_${t} WHERE id = (SELECT MAX(id) FROM BTC_DATA_${t})`, (err, row) => {
      if (row) {
        lastUpdateTime[idx] = Math.max(row.time, lastUpdateTime[idx]);
      }
    })
  });
})

// 차트 정보 요청
app.get("/api/history", (req, res) => {
  const { symbol, resolution, from, to } = req.query;
  db.all(`SELECT * FROM ${symbol}_DATA_${resolution} WHERE time BETWEEN ? AND ?`, [from*1000, to*1000], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get("/api/latest", (req, res) => {
  const { symbol, resolution } = req.query;
  db.all(`SELECT * FROM ${symbol}_DATA_${resolution} WHERE id = (SELECT MAX(id) FROM ${symbol}_DATA_${resolution}) `, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row[0]);
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const timeInterval = [
  60 * 1000,
  5 * 60 * 1000,
  15 * 60 * 1000,
  30 * 60 * 1000,
  60 * 60 * 1000,
  24 * 60 * 60 * 1000,
  7 * 24 * 60 * 60 * 1000,
];

function updatePrice(price, timestamp) {
  lastUpdateTime.forEach((t, idx) => {
    t += timeInterval[idx];
    if (t <= timestamp) {
      db.get(
        `SELECT * FROM BTC_DATA_${resolutionToTable[idx]} WHERE id = (SELECT MAX(id) FROM BTC_DATA_${resolutionToTable[idx]})`,
        (err, row) => {
          if (err) {
            console.error(err.message);
            return;
          }
          db.serialize(() => {
            db.run("BEGIN TRANSACTION");
            while (t + timeInterval[idx] <= timestamp) {
              db.run(
                `INSERT INTO BTC_DATA_${resolutionToTable[idx]} (time, open, high, low, close, volume) VALUES (?, ?, ?, ?, ?, ?)`,
                [t, row.close, row.close, row.close, row.close, 0.0]
              );
              t += timeInterval[idx];
            }
            db.run(
              `INSERT INTO BTC_DATA_${resolutionToTable[idx]} (time, open, high, low, close, volume) VALUES (?, ?, ?, ?, ?, ?)`,
              [t, row.close, price, price, price, 0.0]
            );
            db.run("COMMIT");
            lastUpdateTime[idx] = t;
          });
        }
      );
    } else {
      db.run(
        `UPDATE BTC_DATA_${resolutionToTable[idx]} SET high = CASE WHEN high > ? THEN high ELSE ? END, low = CASE WHEN low < ? THEN low ELSE ? END, close = ? WHERE id = (SELECT MAX(id) FROM BTC_DATA_${resolutionToTable[idx]});
    `,
        [price, price, price, price, price]
      );
    }
  });

  db.all(`SELECT * FROM BTC_DATA_1`, (err, row) => {
    console.log("Latest data:", row[row.length - 2], row[row.length - 1]);
  });
}

const baseAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

async function getDecimals(address) {
  const tokenContract = new web3.eth.Contract(ERC20ABI, address);
  const decimals = await tokenContract.methods.decimals().call();
  return decimals;
}

async function main() {
  const V2PairContract = new web3.eth.Contract(
    V2PairABI,
    "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852"
  );
  const token0 = await V2PairContract.methods.token0().call();
  const token1 = await V2PairContract.methods.token1().call();

  const isBase = token0.toUpperCase() === baseAddress.toUpperCase();

  const token0Decimals = await getDecimals(token0);
  const token1Decimals = await getDecimals(token1);
  const decimalsDiff = Math.abs(Number(token0Decimals - token1Decimals));

  const subscription = await web3.eth.subscribe("newHeads");
  subscription.on("data", (newBlock) => {
    if (Number(newBlock.number) % 300 == 0) {
      console.log(newBlock.number)  
    }
    
    V2PairContract.methods
      .getReserves()
      .call()
      .then((data) => {
        if (!isBase) {
          [data._reserve1, data._reserve0] = [data._reserve0, data._reserve1];
        }
        
        updatePrice(
          (Number(data._reserve1) * 10 ** decimalsDiff) /
            Number(data._reserve0),
          Number(newBlock.timestamp) * 1000
        );
      });
  });
}

main();

// nohup node index.js > index.out 2>&1 &
