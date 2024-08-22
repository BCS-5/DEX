const db = require("./database");

class Positions {
  constructor(tableName) {
    // this.tableName = "BTC_POSITIONS";
    this.tableName = tableName;
  }

  createTable() {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS ${this.tableName} (
            positionHash TEXT PRIMARY KEY,  
            time INTEGER,
            trader TEXT,                     
            baseToken TEXT,                  
            margin TEXT,                     
            positionSize TEXT,               
            openNotional TEXT,
            isLong INTEGER NOT NULL     
        );`
      );

      db.run(
        `CREATE INDEX IF NOT EXISTS idx_trader ON ${this.tableName} (trader);`
      );
    });
  }

  updatePosition(
    trader,
    baseToken,
    positionHash,
    margin,
    positionSize,
    openNotional,
    isLong
  ) {
    db.get(
      `SELECT COUNT(*) AS count FROM ${this.tableName} WHERE positionHash = ?;`,
      [positionHash],
      (err, row) => {
        if (row.count > 0) {
          // 존재하면 UPDATE
          const updateQuery = `
                UPDATE ${this.tableName}
                SET margin = ?, positionSize = ?, openNotional = ?
                WHERE positionHash = ?;
            `;

          db.run(updateQuery, [
            margin,
            positionSize,
            openNotional,
            positionHash,
          ]);
        } else {
          // 존재하지 않으면 INSERT
          const insertQuery = `
                INSERT INTO ${this.tableName} (time, trader, baseToken, positionHash, margin, positionSize, openNotional, isLong)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `;

          db.run(insertQuery, [
            Date.now(),
            trader,
            baseToken,
            positionHash,
            margin,
            positionSize,
            openNotional,
            isLong ? 1 : 0,
          ]);
        }
      }
    );
  }

  closePosition(positionHash) {
    const deleteQuery = `
        DELETE FROM ${this.tableName} WHERE positionHash = ?;
    `;

    db.run(deleteQuery, [positionHash]);
  }

  selectAllPosition(trader, callback) {
    const selectQuery = `
        SELECT * FROM ${this.tableName} WHERE trader = ?;
    `;

    db.all(selectQuery, [trader], (err, rows) => {
      callback(rows); // 성공 시 콜백으로 조회된 rows 전달
    });
  }
}

module.exports = Positions;
