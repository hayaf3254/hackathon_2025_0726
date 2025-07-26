import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// バックエンド担当者が作ってくれたAPIのエンドポイントを定数にしておく
const API_START_URL = "http://localhost:3000/router/start";

export default function StartPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // エラーメッセージを表示するためのstate
  const navigate = useNavigate();

  const handleStart = async () => {
    setIsLoading(true);
    setError(""); // 前のエラーメッセージを消す

    try {
      const response = await fetch(API_START_URL, {
        method: "POST", 
        headers: {
          // これから送るデータはJSON形式です
          "Content-Type": "application/json",
        },
        // 今回は空のオブジェクトを渡す
        body: JSON.stringify({}),
      });

      // 通信が成功したか（ステータスコードが200番台か）をチェック
      if (!response.ok) {
        // もし失敗したら、エラーを発生させてcatchブロックに処理を移す
        throw new Error(
          `サーバーとの通信に失敗しました (Status: ${response.status})`
        );
      }

      // レスポンスのJSONをJavaScriptのオブジェクトに変換
      const data = await response.json();
      const { id } = data; // dataオブジェクトからidを取り出す

      console.log("バックエンドから受け取った本物のID:", id);

      // 取得した本物のIDを持ってメインページに移動
      navigate("/main", { state: { recordId: id } });
    } catch (err) {
      console.error("記録の開始に失敗しました:", err);
      // ユーザー画面にエラーメッセージを表示する
      setError(
        "開始ができません。サーバーが起動しているか確認してください。"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-night text-white flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <h1 className="text-6xl text-yellow-300 [text-shadow:2px_2px_0_#fff,-2px_2px_0_#fff,2px_-2px_0_#fff,-2px_-2px_0_#fff] drop-shadow-lg">
          おやすみ宣言
        </h1>
        <p className="text-2xl mt-4">今日はきのうより早く寝るサイト</p>
      </header>

      <div className="flex flex-col items-center">
        <img src="/bear.png" alt="くま" className="w-48 mb-8" />
        <Button
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-12 py-8 text-3xl rounded-full shadow-lg"
          disabled={isLoading}
          onClick={handleStart}
        >
          {isLoading ? "準備中..." : "記録を始める！"}
        </Button>
        {/* エラーが発生した場合にメッセージを表示する */}
        {error && (
          <p className="text-red-400 mt-4 bg-black/50 p-2 rounded">{error}</p>
        )}
      </div>
    </div>
  );
}
