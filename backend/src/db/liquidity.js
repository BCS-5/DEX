const db = require("./database");

class LiquidityPositions {
  constructor(tableName) {
    // this.tableName = "LIQUIDITY_POSITIONS";
    this.tableName = tableName;
  }

  createTable() {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS ${this.tableName} (
            trader TEXT,         -- 트레이더 주소 (Ethereum address 형식)
            poolName TEXT,       -- 풀 이름
            earnedFees TEXT,     -- uint256 형식으로 저장할 earnedFees (TEXT로 저장)
            PRIMARY KEY (trader, poolName) -- trader와 poolName을 복합 PRIMARY KEY로 설정
        );`
      );
    });
  }

  updateFees(trader, poolName, earnedFees) {
    // 먼저 해당 trader와 poolName이 존재하는지 확인
    const selectQuery = `
        SELECT COUNT(*) AS count FROM ${this.tableName} WHERE trader = ? AND poolName = ?;
    `;

    db.get(selectQuery, [trader, poolName], (err, row) => {
      if (row.count > 0) {
        const updateQuery = `
                UPDATE ${this.tableName}
                SET earnedFees = earnedFees + ?
                WHERE trader = ? AND poolName = ?;
            `;

        db.run(updateQuery, [earnedFees, trader, poolName]);
      } else {
        const insertQuery = `
                INSERT INTO ${this.tableName} (trader, poolName, earnedFees)
                VALUES (?, ?, ?);
            `;

        db.run(insertQuery, [trader, poolName, earnedFees]);
      }
    });
  }
}

module.exports = LiquidityPositions;
