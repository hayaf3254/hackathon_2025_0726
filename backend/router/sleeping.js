const express = require('express');
const router = express.Router();
const db = require('../db'); // `db.js`を正しくインポート

/**
 * @route   POST /api/sleeping
 * @desc    リクエストボディで受け取ったIDの睡眠時間を計算して返す
 * @access  Public
 */
router.post('/', async (req, res) => {
  // POSTリクエストのボディからIDを取得
  const { id } = req.body;

  // IDがボディに含まれていない場合はエラーを返す
  if (!id) {
    return res.status(400).json({ error: 'Record ID is required in the request body' });
  }

  try {
    // データベースからIDに該当するレコードの就寝時間と起床時間を取得
    const { rows } = await db.query(
      'SELECT sleep_time, get_up_time FROM sleep_records WHERE id = $1',
      [id]
    );

    // レコードが見つからない場合は404エラーを返す
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const record = rows[0];
    const sleepTimeStr = record.sleep_time;
    const getUpTimeStr = record.get_up_time;

    // --- 睡眠時間の計算ロジック（ここはGET版と同じ） ---

    const sleepDate = new Date(`1970-01-01T${sleepTimeStr}Z`);
    const getUpDate = new Date(`1970-01-01T${getUpTimeStr}Z`);

    if (getUpDate < sleepDate) {
      getUpDate.setDate(getUpDate.getDate() + 1);
    }

    const diffMs = getUpDate.getTime() - sleepDate.getTime();
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const sleeping = {
      hours: hours,
      minutes: minutes,
    };

    res.json({ sleeping });

  } catch (err) {
    console.error('Error calculating sleeping time:', err.stack);
    res.status(500).json({ error: 'Failed to calculate sleeping time' });
  }
});

module.exports = router;