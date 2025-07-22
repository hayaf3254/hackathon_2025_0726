const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

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

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
