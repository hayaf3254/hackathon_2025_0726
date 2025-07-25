// db.js - Expressサーバー用のデータベースモジュール
require('dotenv').config();
const { Pool } = require('pg');

const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};

// Pool を使用（複数リクエストに対応）
const pool = new Pool(dbConfig);

// エラーハンドリング
pool.on('error', (err, client) => {
    console.error('--- PG POOL ERROR ---', err.message);
});

pool.on('connect', () => {
    console.log('--- DB CLIENT CONNECTED ---');
});

// Expressで使用するためのAPIをエクスポート
module.exports = {
    query: (text, params) => {
        console.log('--- EXECUTING QUERY ---', text, params);
        return pool.query(text, params);
    },
    pool: pool
};