// Node.js + Express + (仮想)AI分析 API サンプル
// DBはPostgreSQL想定（pgパッケージ利用）、AI分析はGemini

const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const router = express.Router();
//const fetch = require('node-fetch'); // npm install node-fetch

async function getAdvice() {
  const fetch = (await import('node-fetch')).default; // ← ここがポイント
  const res = await fetch('https://api.adviceslip.com/advice');
  const data = await res.json();
  return data.slip.advice;
}

module.exports = getAdvice;

require('dotenv').config();


const app = express();
app.use(bodyParser.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY;


// PostgreSQL DB接続設定
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// 定型文（クリック前用）
const defaultAdvice = {
    morning: "おはようございます！今日も一日がんばりましょう！",
    afternoon: "お昼ご飯は食べましたか？しっかり栄養を取って午後からも頑張りましょう！。",
    night: "今日も一日お疲れさまでした。夜はスマホを控えて、早めの就寝準備を心掛けましょう。",
};

// Gemini APIでアドバイス生成
async function getGeminiAdvice(records) {
    // ユーザーデータをAIにわかりやすく渡す
    let prompt = "以下はユーザーの睡眠・運動・夜更かし記録です。\n";
    prompt += "記録を参照して次の形式に沿って回答を作成してください"
    prompt += "眠たくなる時間：（眠たくなった時間を元に毎日いつぐらいに眠たくなるのかを端的に教えてください）生活習慣改善のために：（運動量と夜更かしの内容を元に生活習慣改善のためのパーソナルアドバイスを日本語で一文程で書いてください）\n\n";
    prompt += "記録:\n";
    records.forEach((r, idx) => {
        prompt += `No.${idx + 1}:眠たくなった時間：${r.recorded_at}, 寝た時間:${r.sleep_time}、起きた時間:${r.get_up_time}、運動量:${r.exercise_amount}、夜更かし内容:${r.late_night_activity}\n`;
    });

    // Gemini APIリクエスト
    const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });
    const data = await response.json();
    console.log(data)
    // Geminiのレスポンス構造に応じて
    return (data.candidates && data.candidates[0]?.content?.parts[0]?.text) || 'アドバイスを取得できませんでした。';
}

    

// アドバイス取得API：クリック前は定型文、クリック後はパーソナライズ
router.post('/', async (req, res) => {
    const userId = req.query.user_id;
    const phase = req.query.phase; // "morning" | "afternoon" | "night"
    const clicked = req.query.clicked === "true"; // trueならアドバイスをAI分析

    if (!clicked) {
        // クリック前は定型文
        res.json({ advice: defaultAdvice[phase] || "時刻に応じたアドバイスを表示します。" });
        return;
    }

    // クリック後: ユーザーの記録をDBから取得
     try {
    const result = await pool.query(
        `SELECT recorded_at, sleep_time, get_up_time, exercise_amount, late_night_activity, recorded_at, start
        FROM sleep_records
        WHERE recorded_at >= NOW() - INTERVAL '7 days'
        ORDER BY recorded_at DESC`
    );
    const records = result.rows;
    if (records.length < 7) {
      res.json({ advice: "記録が不足しています。まずは記録を増やしましょう。" });
      return;
    }
    const advice = await getGeminiAdvice(records);
    res.json({ advice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'アドバイス取得に失敗しました' });
  }
});


module.exports = router;