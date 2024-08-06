const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { Web3 } = require("web3");
require('dotenv').config();
const app = express();
const port = 8090;

// JSON 형식의 요청 본문을 파싱하기 위한 미들웨어 설정
app.use(express.json());

// SQLite 데이터베이스 연결 및 테이블 생성
const db = new sqlite3.Database('mydatabase.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
});

// 모든 아이템 조회
app.get('/items', (req, res) => {
  db.all("SELECT * FROM items", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 특정 아이템 조회
app.get('/items/:id', (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM items WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).send({ error: 'Item not found' });
      return;
    }
    res.json(row);
  });
});

// 새로운 아이템 추가
app.post('/items', (req, res) => {
  const name = req.body.name;
  db.run("INSERT INTO items (name) VALUES (?)", [name], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, name: name });
  });
});

// 특정 아이템 수정
app.put('/items/:id', (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  db.run("UPDATE items SET name = ? WHERE id = ?", [name, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).send('Item not found');
      return;
    }
    res.json({ id: id, name: name });
  });
});

// 특정 아이템 삭제
app.delete('/items/:id', (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM items WHERE id = ?", [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).send('Item not found');
      return;
    }
    res.json({ id: id });
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const web3 = new Web3(`wss://sepolia.infura.io/ws/v3/${process.env.INFURA_API_KEY}`);