import React from "react";
import { Link } from "react-router-dom"; // メインページに戻るリンクのために追加

export default function RecordsPage() {
  return (
    // 仮のレイアウト
    <div style={{ padding: "2rem", color: "white", background: "#222" }}>
      <h1>記録一覧ページ</h1>
      <p>ここにグラフやカレンダーが表示される予定です。</p>
      <br />
      <Link to="/main" style={{ color: "#61dafb" }}>
        メインページに戻る
      </Link>
    </div>
  );
}
