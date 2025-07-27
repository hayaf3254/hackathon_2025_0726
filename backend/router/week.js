const express = require('express');
const router = express.Router();
const db = require('../db'); // db.jsをインポート

router.get('/', async (req, res) => {
  // server.jsで設定したパスに合わせてログメッセージを修正
  console.log('Received request for /router/week/');

  try {
    // 最新の7件のデータをidの昇順で取得するためのSQLクエリ
    const queryText = `
      SELECT
        sleep_time,
        exercise_amount
      FROM (
        SELECT
          sleep_time,
          exercise_amount,
          id
        FROM
          sleep_records
        ORDER BY
          id DESC
        LIMIT 7
      ) AS recent_records
      ORDER BY
        id ASC;
    `;

    // ★★★ 修正点 ★★★
    // 'pool.query' ではなく 'db.query' を使用します
    const result = await db.query(queryText);

    // クエリ結果を処理しやすいように、2つの別々の配列に整形します
    const sleep_times = [];
    const exercise_amounts = [];

    result.rows.forEach(row => {
      // sleep_time (TIME型) を配列に追加します
      sleep_times.push(row.sleep_time);
      // exercise_amount (DECIMAL型) を数値に変換して配列に追加します
      exercise_amounts.push(parseFloat(row.exercise_amount));
    });

    // 整形したデータをJSON形式でクライアントに返します
    res.status(200).json({
      sleep_times: sleep_times,
      exercise_amounts: exercise_amounts,
    });

  } catch (error) {
    // エラーが発生した場合は、コンソールにエラーを出力し、
    // 500 Internal Server Error ステータスとエラーメッセージを返します
    console.error('Error executing query', error.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;