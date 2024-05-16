"use client";
import React, { useEffect, useState } from "react";
import TrainingMemory, { MemoryType } from "./TrainingMemory";

import { supabase } from "../../../utils/supabaseClient";
import { supabase_google } from "../Authentication/SupabaseGoogle";
import Link from "next/link";
import MuscleCalendar from "../Calendar/MuscleCalendar";

// import MemoryGraph from "./MemoryGraph";

// import BodyWeightChart from "./BodyWeightChart";

export default function Page() {
  const [account, setAccount] = useState<string | null>(null);
  const [showTrainingMemory, setShowTrainingMemory] = useState<boolean>(true);

  //ログインしたユーザーのメールアドレスをuserAccountに格納する
  const getUserAccount = async () => {
    // ログインのセッションを取得する処理
    const { data } = await supabase_google.auth.getSession();
    // セッションがあるときだけ現在ログインしているユーザーを取得する
    if (data.session !== null) {
      // supabaseに用意されている現在ログインしているユーザーを取得する関数
      const {
        data: { user },
      } = await supabase_google.auth.getUser();
      // currentUserにユーザーのメールアドレスを格納
      setAccount(user?.email ?? "");
    }
    console.log("getUserAccount内");
  };

  //ページリダイレクト時にユーザーのメールアドレスをuserAccountに格納する
  useEffect(() => {
    getUserAccount();
  }, []);

  const [memories, setMemories] = useState<MemoryType[]>([]);

  //  sueEffect内で非同期処理を行うことでuse clientとasyncの衝突を防ぐ
  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("account", account)
          .order("date", { ascending: false });
        // エラー以外の時にmemoriesにdataオブジェクトを格納する。
        if (error) {
          console.error("Error fetching memories:", error.message);
          return;
        }
        setMemories(data);
      } catch (error: any) {
        console.error("Error fetching memories:", error.message);
      }
    }
    fetchData();
  }, [memories, account]);

  // userNameがnullの場合、データの取得がまだ行われていないことを示す
  if (!account) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-900"></div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  const toggleDisplay = () => {
    setShowTrainingMemory((prev) => !prev);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center mt-8 text-gray-800">
        My Muscle Memory
      </h1>
      {/* 表示切り替えボタン */}
      <div className="flex justify-center">
        <button
          onClick={toggleDisplay}
          className="font-bold text-blue-700 focus:outline-none my-2"
        >
          {showTrainingMemory
            ? "カレンダー表示に切り替え"
            : "テーブル表示に切り替え"}
        </button>
      </div>

      {showTrainingMemory ? (
        <MuscleCalendar account={account} />
      ) : (
        <TrainingMemory memories={memories} />
      )}

      <div className="flex justify-center">
        <Link href="/components/TopPage" className="font-bold text-blue-700">
          TOPへ戻る
        </Link>
      </div>
    </>
  );
}
