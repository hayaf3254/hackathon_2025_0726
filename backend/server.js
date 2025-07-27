require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const db = require('./db'); 
const startRouter = require('./router/start');
const updateRouter = require('./router/update');
const adviceRouter = require('./advice');
app.use('/api/advice', adviceRouter);

const weekRouter = require('./router/week');

const sleepingRouter = require('./router/sleeping');

// CORSを正しく適用（"app.use(cors(...))" で設定を反映）
app.use(cors({
  origin: '*', // どこからのアクセスでも許可（開発用）
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // 必要なヘッダーだけ指定
}));

// JSONの受け取りもOKにする（よく忘れられる）
app.use(express.json());

// ルートにアクセスがあったときのレスポンス
app.get('/', (req, res) => {
  res.send('Hello from Node.js!');
});


// 新しいAPIエンドポイント: sleep_records の全データを取得
app.get('/sleep_records', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM sleep_records ORDER BY recorded_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching sleep records:', err.stack);
        res.status(500).json({ error: 'Failed to fetch sleep records' });
    }
});

app.use('/router/start', startRouter);
app.use('/router/update', updateRouter);
app.use('/advice', adviceRouter);
app.use('/router/week', weekRouter);
app.use('/router/sleeping', sleepingRouter);


// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
