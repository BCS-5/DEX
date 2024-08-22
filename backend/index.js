const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const { Web3 } = require("web3");
const V2PairABI = require("./abis/UniswapV2Pair.json");
const ERC20ABI = require("./abis/ERC20.json");
require("dotenv").config();

// const web3 = new Web3("wss://ethereum-sepolia-rpc.publicnode.com");
// const web3 = new Web3("wss://ethereum-rpc.publicnode.com");
const web3 = new Web3(
  `wss://sepolia.infura.io/ws/v3/${process.env.INFURA_API_KEY}`
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
  resolutionToTable.forEach((t, idx) => {
    db.get(
      `SELECT * FROM BTC_DATA_${t} WHERE id = (SELECT MAX(id) FROM BTC_DATA_${t})`,
      (err, row) => {
        if (row) {
          lastUpdateTime[idx] = Math.max(row.time, lastUpdateTime[idx]);
        }
      }
    );
  });
});

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp INTEGER, volume TEXT)"
  );
});

// 차트 정보 요청
app.get("/api/history", (req, res) => {
  const { symbol, resolution, from, to } = req.query;
  db.all(
    `SELECT * FROM ${symbol}_DATA_${resolution} WHERE time BETWEEN ? AND ?`,
    [from * 1000, to * 1000],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// 차트 최신 정보 요청
app.get("/api/latest", (req, res) => {
  const { symbol, resolution } = req.query;
  db.all(
    `SELECT * FROM ${symbol}_DATA_${resolution} WHERE id = (SELECT MAX(id) FROM ${symbol}_DATA_${resolution}) `,
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(row[0]);
    }
  );
});

// 24시간 거래량, 총 미결제 약정, 24시간 발생 수수료
app.get("/api/getMarket", (req, res) => {});

// 유동성 가치, 24시간 거래량, 24시간 수수료, APR 반환
app.get("/api/getLiquidityPool", (req, res) => {});

// 24H 거래량, 1h Funding (Long), 1h Funding(Short)
app.get("/api/getPerpetualPool", (req, res) => {});

// Volume, TVL, Fees 일별 정보
app.get("/api/getChart", (req, res) => {});

// 풀 이름    포지션크기     가격  현재 풀 가격  수익률    청산 가격    롱숏 여부
app.get("/api/getPositions", (req, res) => {});

// 풀 이름    포지션크기    진입 가격  현재 풀 가격  수익률    청산 가격    롱숏 여부
app.get("/api/getOrders", (req, res) => {});

// 풀 이름     LP토큰 개수    예치된 토큰 가치   파밍된 수수료    청구되지 않은 수수료
app.get("/api/getLiquidityPositions", (req, res) => {});

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

const baseAddress = "0x1BCe644E5AEe9cEb88b13fa4894f7a583e7E350b";

async function getDecimals(address) {
  const tokenContract = new web3.eth.Contract(ERC20ABI, address);
  const decimals = await tokenContract.methods.decimals().call();
  return decimals;
}

async function main() {
  const V2PairContract = new web3.eth.Contract(
    V2PairABI,
    "0x51AC7a5363751fa19F1186f850f15a1E1Dd8F8db"
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
      console.log(newBlock.number);
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

/*
테이블1: 24시간 거래량, 수수료


테이블2: 1시간 단위 cumulativeLongFundingRates, cumulativeShortFundingRates

테이블3,4: Volume, TVL 일별 정보

테이블5: 포지션 크기
테이블6: 예약주문 목록
테이블7: 사용자별 유동성 목록

*/