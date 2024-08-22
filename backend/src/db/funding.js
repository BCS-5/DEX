const db = require("./database");

class FundingRate {
  constructor(tableName) {
    // this.tableName = "BTC_FUNDING_RATE";
    this.tableName = tableName;
  }

  createTable() {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS ${this.tableName} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            time INTEGER,
            long REAL,
            short REAL
        );`
      );

      db.run(
        `CREATE INDEX IF NOT EXISTS idx_time ON ${this.tableName} (time);`
      );
    });
  }

  insertFundingRate(longValue, shortValue) {
    db.run(
      `
        INSERT INTO ${this.tableName} (time, long, short)
        VALUES (?, ?, ?);
    `,
      [Date.now(), longValue, shortValue]
    );
  }

  selectRecentFundingRate(callback) {
    db.serialize(() => {
      let recentData = null;
      let nearHourData = null;

      db.get(
        `
        SELECT * FROM ${this.tableName}
        WHERE id = (SELECT MAX(id) FROM ${this.tableName});
    `,
        (err, row) => {
          recentData = row;
        }
      );

      db.get(
        `
            SELECT * FROM ${this.tableName} 
            WHERE time >= ${Date.now() - 60 * 60 * 1000}
            ORDER BY time ASC
            LIMIT 1;
        `,
        (err, row) => {
          nearHourData = row;
          callback(recentData, nearHourData);
        }
      );
    });
  }
}

module.exports = FundingRate;
