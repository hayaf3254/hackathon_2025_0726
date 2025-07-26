const express = require('express');
const router = express.Router();
const db = require('../db'); // db.jsをインポート

router.post('/', async (req, res) => {
    try {

       // --- SQLクエリの準備 ---
        // sleep_records テーブルにレコードを挿入します。
        // テーブル定義でデフォルト値が設定されていなければ NULL が入ります。
        // start カラムのみに値を明示的に挿入します。
        // RETURNING id; で自動生成されたidを取得します。
        const text = `
            INSERT INTO sleep_records(start) 
            VALUES($1)
            RETURNING id;
        `;
        //SQL文は上から順番に
        //sleep_records というテーブルの start というカラムに、新しいデータを追加します
        //あとで値を受け取るためのプレースホルダ（仮の箱）
        //挿入されたデータの id を返してくれる命令

        // $1 に startValue ("1") を代入
        const values = ["1"];

        // --- 3. データベース操作の実行 ---
        const result = await db.query(text, values);
        const newRecordId = result.rows[0].id; // 挿入されたidを取得

        // --- 4. 成功時のレスポンス ---
        // ステータス201 (Created) で、生成されたidのみを返します。
        res.status(201).json({
            id: newRecordId // 自動生成されたidのみを返す
        });

    } catch (err) {
        // --- 5. エラーハンドリング ---
        console.error('Error inserting into sleep_records:', err);
        res.status(500).json({
            message: 'Failed to create record.',
            error: err.message
        });
    }
});

module.exports = router;