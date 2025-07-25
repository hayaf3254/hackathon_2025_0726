// dotenv を読み込み、.env ファイルから環境変数をロード
require('dotenv').config();

// pg モジュールから Client クラスをインポート
const { Client } = require('pg');

// .env ファイルから接続情報を取得
const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};

// 新しいクライアントインスタンスを作成
const client = new Client(dbConfig);

async function connectAndQuery() {
    try {
        // データベースに接続
        await client.connect();
        console.log('PostgreSQLに接続しました！');

        // 例: sleep_records テーブルからデータを取得して表示
        const res = await client.query('SELECT * FROM sleep_records');
        console.log('sleep_records のデータ:');
        console.table(res.rows); // テーブル形式で表示

    } catch (err) {
        console.error('データベース接続またはクエリ実行エラー:', err.stack);
    } finally {
        // 接続を閉じる
        await client.end();
        console.log('PostgreSQLから切断しました。');
    }
}

// 関数を実行
connectAndQuery();