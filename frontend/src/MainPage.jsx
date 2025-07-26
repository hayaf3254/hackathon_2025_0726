import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// バックエンドができるまでの、擬似的なデータベース
const mockSleepData = {
  "2025/07/23": { bedTime: "23:15" },
  "2025/07/22": { bedTime: "22:30" },
  "2025/07/21": { bedTime: "22:45" },
};

export default function MainPage() {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const [recordId, setRecordId] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [bgClass, setBgClass] = useState("");
  const [message, setMessage] = useState("");
  const [isLoadingSleepy, setIsLoadingSleepy] = useState(false);
  const [isLoadingSleep, setIsLoadingSleep] = useState(false);
  const [isSleepMode, setIsSleepMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
      // スタートページから渡されたIDを受け取る
      if (location.state?.recordId) {
        const id = location.state.recordId;
        setRecordId(id);
        console.log("メインページで受け取ったID:", id); // IDが取れているか
      } else {
        alert("IDがうまく読み込めなかったよ。スタートページに戻ります。");
        navigate("/");
      }
    }, [location, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 4 && hour < 12) {
      setBgClass("bg-morning");
      setMessage(`おはよう！
        今日も一日がんばろ！`);
    } else if (hour >= 12 && hour < 18) {
      setBgClass("bg-afternoon");
      setMessage(`午後もファイト！
        あと少しだよ！`);
    } else {
      setBgClass("bg-night");
      setMessage(`おつかれさまでした！
        今日はよくねれそうかな？`);
    }

    const updateClock = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const simulateApi = () => new Promise((resolve) => setTimeout(resolve, 1500));

  const handleSleepyClick = async () => {
    setIsLoadingSleepy(true);
    setMessage("処理中だよ！");
    await simulateApi();
    setIsLoadingSleepy(false);
    setMessage(`記録したよ。
      早く寝ちゃおう！`);
  };

  const handleSleepClick = async () => {
    setIsLoadingSleep(true);
    setMessage("処理中だよ！");
    await simulateApi();
    setIsLoadingSleep(false);
    setIsSleepMode(!isSleepMode);
    setMessage(
      isSleepMode
        ? `おはよう！記録したよ。
      今日もがんばってこう！`
        : `記録したよ。
      おやすみ！`
    );
  };

  const onSubmit = async (data) => {
    setMessage("処理中だよ！");
    await simulateApi();
    setMessage(
      `カロリー:${data.calories}kcal, 
      理由:${data.reason || "なし"} 記録したよ！`
    );
    reset();
  };

  const handleDateSelect = (date) => {
    const record = mockSleepData[date];
    if (record) {
      setSelectedRecord(`${record.bedTime}にねたよ！`);
    } else {
      setSelectedRecord("その日の記録はないよ。");
    }
  };

  return (
    <div
      className={`min-h-screen ${bgClass} text-white flex items-center justify-center p-4 md:p-8`}
    >
      <main className="w-full max-w-screen-xl grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 items-start">
        {/* === 左カラム === */}
        <div className="flex flex-col items-center gap-6 w-full">
          <header className="text-center">
            <h1 className="text-5xl text-yellow-300 [text-shadow:2px_2px_0_#fff,-2px_2px_0_#fff,2px_-2px_0_#fff,-2px_-2px_0_#fff] drop-shadow-lg">
              おやすみ宣言
            </h1>
            <p className="text-xl mt-2">今日はきのうより早く寝るサイト</p>
            <div className="text-7xl  mt-4">{currentTime}</div>
          </header>

          <div className="flex gap-4">
            <Button
              className="bg-blue-400 hover:bg-blue-500 text-black px-8 py-3 text-lg rounded-lg"
              disabled={isLoadingSleepy}
              onClick={handleSleepyClick}
            >
              {isLoadingSleepy ? "処理中..." : "眠たいかも"}
            </Button>
            <Button
              className={`${
                isSleepMode
                  ? "bg-green-400 hover:bg-green-500"
                  : "bg-pink-400 hover:bg-pink-500"
              } text-black px-8 py-3 text-lg rounded-lg`}
              disabled={isLoadingSleep}
              onClick={handleSleepClick}
            >
              {isLoadingSleep
                ? "処理中..."
                : isSleepMode
                ? "起きたよ！"
                : "もう寝る！"}
            </Button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-gray-800/50 p-6 rounded-2xl w-full text-white shadow-lg"
          >
            <label className="block text-md mb-2">今日の運動量 (kcal)</label>
            <Input
              type="number"
              placeholder="消費カロリー"
              {...register("calories", {
                min: { value: 0, message: "0以上で入力してね！" },
              })}
              className="mb-1 bg-gray-900/70 border-gray-600 placeholder:text-gray-400 rounded-lg"
            />
            {errors.calories && (
              <p className="text-red-400 text-sm mb-3">
                {errors.calories.message}
              </p>
            )}

            <label className="block text-md mb-2 mt-4">
              なにが眠れなくする？
            </label>
            <Input
              type="text"
              placeholder="理由"
              {...register("reason")}
              className="mb-4 bg-gray-900/70 border-gray-600 placeholder:text-gray-400 rounded-lg"
            />

            <Button
              type="submit"
              className="bg-orange-400 hover:bg-orange-500 text-black w-full py-3 text-lg rounded-lg"
            >
              記録する
            </Button>
          </form>
        </div>

        {/* === 右カラム === */}
        <div className="flex flex-col items-center w-full h-full">
          <div className="flex flex-col items-center">
            {/* 吹き出しとクマを横並びにする */}
            <div className="flex items-center justify-center gap-4">
              {/* 吹き出し */}
              <div className="relative w-80 h-52">
                {" "}
                <img
                  src="/speech.png"
                  alt="吹き出し"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
                <p className="absolute top-11 left-[135px] -translate-x-1/2 -translate-y-1/2 w-4/5 text-center text-black text-lg  whitespace-pre-wrap">
                  {message}
                </p>
              </div>
              {/* クマ */}
              <img src="/bear.png" alt="くま" className="w-40" />{" "}
            </div>
            <Button className="mt-4 bg-yellow-300 hover:bg-yellow-400 text-black rounded-lg px-6">
              アドバイスを聞く
            </Button>
          </div>

          <div className="w-full max-w-sm flex flex-col items-center py-6 gap-[115px]">
            <div className="flex items-center gap-2 w-full">
              <Select onValueChange={handleDateSelect}>
                <SelectTrigger className="flex-1 bg-gray-400/50 border-gray-600 rounded-lg h-12">
                  <SelectValue placeholder="過去の記録を見る" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025/07/23">2025/07/23</SelectItem>
                  <SelectItem value="2025/07/22">2025/07/22</SelectItem>
                  <SelectItem value="2025/07/21">2025/07/21</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex-1 bg-white/90 text-center p-3 rounded-lg h-12 flex items-center justify-center">
                {selectedRecord !== null ? (
                  <p className="text-black font-semibold">{selectedRecord}</p>
                ) : (
                  <p className="text-gray-500">直近の記録を見れるよ！</p>
                )}
              </div>
            </div>

            <Button className="bg-purple-500 hover:bg-purple-600 text-black w-full py-3 text-lg rounded-lg">
              記録をまとめて見る
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}