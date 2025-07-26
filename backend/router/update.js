// router/update.js
//眠気を記録するためのAPIエンドポイント

const express = require('express');
const router = express.Router();
const db = require('../db'); // db.jsをインポート

/**
 * PUT /api/update_recorded_at
 * 指定されたIDのレコードのrecorded_atカラムを更新します。
 * リクエストボディ: { "id": <number>, "recorded_at": "<timestamp_string>" }
 */
router.put('/recorded', async (req, res) => {
    try {
        // --- 1. リクエストボディからデータの取得 ---
        // フロントエンドから送られてくるidとrecorded_atを取得
        const { id, recorded_at } = req.body;

        // --- 2. 入力値のバリデーション (簡易版) ---
        // id と recorded_at が存在するか確認
        if (id === undefined || recorded_at === undefined) {
            return res.status(400).json({
                message: 'Bad Request: "id" and "recorded_at" are required.'
            });
        }

        // --- 3. SQLクエリの準備 ---
        // UPDATE文を使って、指定されたidのレコードのrecorded_atカラムを更新します。
        const text = `
            UPDATE sleep_records
            SET recorded_at = $1
            WHERE id = $2
            RETURNING id; -- 更新されたレコードのidを返す (オプション)
        `;
        //RETURNING id は「実際に更新されたIDを返す」→これにより「本当にレコードが存在してたか」も確認できる。



        // $1 に recorded_at の値、$2 に id の値を代入
        const values = [recorded_at, id];

        // --- 4. データベース操作の実行 ---
        const result = await db.query(text, values);

        // 更新された行があるか確認
        if (result.rowCount === 0) {
            // 指定されたIDのレコードが見つからなかった場合
            return res.status(404).json({
                message: `Record with ID ${id} not found.`
            });
        }

        // --- 5. 成功時のレスポンス ---
        res.status(200).json({
            message: `Recorded_at for ID ${id} updated successfully.`
        });

    } catch (err) {
        // --- 6. エラーハンドリング ---
        console.error('Error updating recorded_at:', err);
        res.status(500).json({
            message: 'Failed to update recorded_at.',
            error: err.message
        });
    }
});


router.put('/sleep', async (req, res) => {
    try {
        // --- 1. リクエストボディからデータの取得 ---
        // フロントエンドから送られてくるidとsleep_timeを取得
        const { id, sleep_time } = req.body;

        // --- 2. 入力値のバリデーション (簡易版) ---
        // id と sleep_time が存在するか確認
        if (id === undefined || sleep_time === undefined) {
            return res.status(400).json({
                message: 'Bad Request: "id" and "sleep_time" are required.'
            });
        }

        // --- 3. SQLクエリの準備 ---
        // UPDATE文を使って、指定されたidのレコードのsleep_timeカラムを更新します。
        const text = `
            UPDATE sleep_records
            SET sleep_time = $1
            WHERE id = $2
            RETURNING id; -- 更新されたレコードのidを返す (オプション)
        `;
        //RETURNING id は「実際に更新されたIDを返す」→これにより「本当にレコードが存在してたか」も確認できる。



        // $1 に sleep_time の値、$2 に id の値を代入
        const values = [sleep_time, id];

        // --- 4. データベース操作の実行 ---
        const result = await db.query(text, values);

        // 更新された行があるか確認
        if (result.rowCount === 0) {
            // 指定されたIDのレコードが見つからなかった場合
            return res.status(404).json({
                message: `Record with ID ${id} not found.`
            });
        }

        // --- 5. 成功時のレスポンス ---
        res.status(200).json({
            message: `sleep_time for ID ${id} updated successfully.`
        });

    } catch (err) {
        // --- 6. エラーハンドリング ---
        console.error('Error updating sleep_time:', err);
        res.status(500).json({
            message: 'Failed to update sleep_time.',
            error: err.message
        });
    }
});


router.put('/getUp', async (req, res) => {
    try {
        // --- 1. リクエストボディからデータの取得 ---
        // フロントエンドから送られてくるidとget_upを取得
        const { id, get_up_time } = req.body;

        // --- 2. 入力値のバリデーション (簡易版) ---
        // id と get_up_time が存在するか確認
        if (id === undefined || get_up_time === undefined) {
            return res.status(400).json({
                message: 'Bad Request: "id" and "get_up_time" are required.'
            });
        }

        // --- 3. SQLクエリの準備 ---
        // UPDATE文を使って、指定されたidのレコードのget_up_timeカラムを更新します。
        const text = `
            UPDATE sleep_records
            SET get_up_time = $1
            WHERE id = $2
            RETURNING id; -- 更新されたレコードのidを返す (オプション)
        `;
        //RETURNING id は「実際に更新されたIDを返す」→これにより「本当にレコードが存在してたか」も確認できる。



        // $1 に get_up_time の値、$2 に id の値を代入
        const values = [get_up_time, id];

        // --- 4. データベース操作の実行 ---
        const result = await db.query(text, values);

        // 更新された行があるか確認
        if (result.rowCount === 0) {
            // 指定されたIDのレコードが見つからなかった場合
            return res.status(404).json({
                message: `Record with ID ${id} not found.`
            });
        }

        // --- 5. 成功時のレスポンス ---
        res.status(200).json({
            message: `get_up_time for ID ${id} updated successfully.`
        });

    } catch (err) {
        // --- 6. エラーハンドリング ---
        console.error('Error updating get_up_time:', err);
        res.status(500).json({
            message: 'Failed to update get_up_time.',
            error: err.message
        });
    }
});

router.put('/exercise', async (req, res) => {
    try {
        // --- 1. リクエストボディからデータの取得 ---
        // フロントエンドから送られてくるidとexercise_amountを取得
        const { id, exercise_amount } = req.body;

        // --- 2. 入力値のバリデーション (簡易版) ---
        // id と exercise_amount が存在するか確認
        if (id === undefined || exercise_amount === undefined) {
            return res.status(400).json({
                message: 'Bad Request: "id" and "exercise_amount" are required.'
            });
        }

        // --- 3. SQLクエリの準備 ---
        // UPDATE文を使って、指定されたidのレコードのexercise_amountカラムを更新します。
        const text = `
            UPDATE sleep_records
            SET exercise_amount = $1
            WHERE id = $2
            RETURNING id; -- 更新されたレコードのidを返す (オプション)
        `;
        //RETURNING id は「実際に更新されたIDを返す」→これにより「本当にレコードが存在してたか」も確認できる。



        // $1 に exercise_amount の値、$2 に id の値を代入
        const values = [exercise_amount, id];

        // --- 4. データベース操作の実行 ---
        const result = await db.query(text, values);

        // 更新された行があるか確認
        if (result.rowCount === 0) {
            // 指定されたIDのレコードが見つからなかった場合
            return res.status(404).json({
                message: `Record with ID ${id} not found.`
            });
        }

        // --- 5. 成功時のレスポンス ---
        res.status(200).json({
            message: `exercise_amount for ID ${id} updated successfully.`
        });

    } catch (err) {
        // --- 6. エラーハンドリング ---
        console.error('Error updating exercise_amount:', err);
        res.status(500).json({
            message: 'Failed to update exercise_amount.',
            error: err.message
        });
    }
});


router.put('/late_night_activity', async (req, res) => {
    try {
        // --- 1. リクエストボディからデータの取得 ---
        // フロントエンドから送られてくるidとlate_night_activityを取得
        const { id, late_night_activity } = req.body;

        // --- 2. 入力値のバリデーション (簡易版) ---
        // id と late_night_activity が存在するか確認
        if (id === undefined || late_night_activity === undefined) {
            return res.status(400).json({
                message: 'Bad Request: "id" and "late_night_activity" are required.'
            });
        }

        // --- 3. SQLクエリの準備 ---
        // UPDATE文を使って、指定されたidのレコードのlate_night_activityカラムを更新します。
        const text = `
            UPDATE sleep_records
            SET late_night_activity = $1
            WHERE id = $2
            RETURNING id; -- 更新されたレコードのidを返す (オプション)
        `;
        //RETURNING id は「実際に更新されたIDを返す」→これにより「本当にレコードが存在してたか」も確認できる。



        // $1 に late_night_activity の値、$2 に id の値を代入
        const values = [late_night_activity, id];

        // --- 4. データベース操作の実行 ---
        const result = await db.query(text, values);

        // 更新された行があるか確認
        if (result.rowCount === 0) {
            // 指定されたIDのレコードが見つからなかった場合
            return res.status(404).json({
                message: `Record with ID ${id} not found.`
            });
        }

        // --- 5. 成功時のレスポンス ---
        res.status(200).json({
            message: `late_night_activity for ID ${id} updated successfully.`
        });

    } catch (err) {
        // --- 6. エラーハンドリング ---
        console.error('Error updating late_night_activity:', err);
        res.status(500).json({
            message: 'Failed to update late_night_activity.',
            error: err.message
        });
    }
});

module.exports = router;