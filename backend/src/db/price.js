const db = require("./database");

const resolutionToTable = ["1", "5", "15", "30", "60", "1D", "1W"];
const timeInterval = [
  60 * 1000,
  5 * 60 * 1000,
  15 * 60 * 1000,
  30 * 60 * 1000,
  60 * 60 * 1000,
  24 * 60 * 60 * 1000,
  7 * 24 * 60 * 60 * 1000,
];

class PriceVolume {
  constructor(tableName, startTime) {
    // this.tableName = "BTC_PRICE_VOLUME_";
    this.tableName = tableName;
    this.lastUpdateTime = [];
    for (let i in resolutionToTable) {
      this.lastUpdateTime.push(startTime);
    }
  }

  createTable() {
    db.serialize(() => {
      resolutionToTable.forEach((t, idx) => {
        db.run(
          `CREATE TABLE IF NOT EXISTS ${this.tableName}${t} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                time INTEGER NOT NULL,
                open REAL NOT NULL,
                high REAL NOT NULL,
                low REAL NOT NULL,
                close REAL NOT NULL,
                volume REAL NOT NULL
            );`
        );

        db.run(
          `CREATE INDEX IF NOT EXISTS idx_${this.tableName}${t}_time ON ${this.tableName}${t}(time)`
        );

        const query = `SELECT COUNT(*) AS count FROM ${this.tableName}${t}`;
        db.get(query, (err, row) => {
          if (row.count == 0) {
            db.run(
              `INSERT INTO ${this.tableName}${t}
                    (time, open, high, low, close, volume)
                    VALUES (?, ?, ?, ?, ?, ?)`,
              [0, 0.0, 0.0, 0.0, 0.0, 0.0]
            );
          }
        });

        db.get(
          `SELECT * FROM ${this.tableName}${t} WHERE id = (SELECT MAX(id) FROM ${this.tableName}${t}{t})`,
          (err, row) => {
            if (row) {
              this.lastUpdateTime[idx] = Math.max(
                row.time,
                this.lastUpdateTime[idx]
              );
            }
          }
        );
      });
    });
  }

  initialize() {
    db.serialize(() => {
      resolutionToTable.forEach((t, idx) => {
        db.get(
          `SELECT * FROM ${this.tableName}${t} WHERE id = (SELECT MAX(id) FROM ${this.tableName}${t}{t})`,
          (err, row) => {
            if (row) {
              this.lastUpdateTime[idx] = Math.max(
                row.time,
                this.lastUpdateTime[idx]
              );
            }
          }
        );
      });
    });
  }

  updatePrice(price, timestamp, volume) {
    this.lastUpdateTime.forEach((t, idx) => {
      t += timeInterval[idx];

      db.serialize(() => {
        db.run("BEGIN EXCLUSIVE TRANSACTION");
        if (t <= timestamp) {
          db.get(
            `SELECT * FROM ${this.tableName}${resolutionToTable[idx]} WHERE id = (SELECT MAX(id) FROM ${this.tableName}${resolutionToTable[idx]})`,
            (err, row) => {
              while (t + timeInterval[idx] <= timestamp) {
                db.run(
                  `INSERT INTO ${this.tableName}${resolutionToTable[idx]} (time, open, high, low, close, volume) VALUES (?, ?, ?, ?, ?, ?)`,
                  [t, row.close, row.close, row.close, row.close, 0.0]
                );
                t += timeInterval[idx];
              }
              db.run(
                `INSERT INTO ${this.tableName}${resolutionToTable[idx]} (time, open, high, low, close, volume) VALUES (?, ?, ?, ?, ?, ?)`,
                [t, row.close, price, price, price, volume]
              );
              this.lastUpdateTime[idx] = t;
            }
          );
        } else {
          db.run(
            `UPDATE ${this.tableName}${resolutionToTable[idx]} SET high = CASE WHEN high > ? THEN high ELSE ? END, low = CASE WHEN low < ? THEN low ELSE ? END, close = ?, volume = volume + ? WHERE id = (SELECT MAX(id) FROM ${this.tableName}${resolutionToTable[idx]});`,
            [price, price, price, price, price, volume]
          );
        }
        db.run("COMMIT");
      });
    });
  }
}

module.exports = PriceVolume;
