"use client";

import React, { useState } from "react";
import { MemoryType } from "../Memory/TrainingMemory";
import { SlSpeech } from "react-icons/sl";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { UUID } from "crypto";
import { supabase } from "../../../utils/supabaseClient";
import { useRouter } from "next/navigation";
import TimeLineModal from "../TimeLine/TimeLineModal";

type CalendarModalProps = {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  trainings: MemoryType[];
};

const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  date,
  trainings,
}) => {
  const [TimeLineMemory, setTimeLineMemory] = useState<MemoryType | null>(null);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [isTimeLineModalOpen, setIsTimeLineModalOpen] = useState(false);

  // 削除ボタンを押した時の処理
  const DeleteMemory = async (id: UUID) => {
    const { data, error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      console.error("Error deleting memory:", error.message);
      return;
    }
    router.push("/components/Memory");
    router.refresh();
  };

  // 投稿ボタンを押した時の処理
  const addTimeLine = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    training: MemoryType
  ) => {
    e.preventDefault();
    setIsModalOpen(false);

    setTimeLineMemory({ ...training });

    setIsTimeLineModalOpen(true);
  };

  return (
    <div>
      <div
        className={
          'fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 ${isModalOpen ? "" : "hidden"}'
        }
      >
        <div className="bg-white rounded-lg p-8 w-full max-w-lg max-h-[80vh] overflow-y-auto">
          {/* モーダルコンテナに最大高さを80vh（画面の80%）に設定 */}
          <h2 className="text-xl font-bold mb-4">トレーニング情報 - {date}</h2>
          <div className="max-h-[60vh] overflow-y-auto">
            {/* テーブルコンテナに最大高さとスクロール設定を追加 */}
            <table className="w-full bg-white border border-collapse border-gray-300 shadow-md rounded-md">
              <thead className="bg-teal-400 text-white">
                <tr>
                  <th className="p-2 text-center border">
                    トレーニングメニュー
                  </th>
                  <th className="p-2 text-center border">重量</th>
                  <th className="p-2 text-center border">回数</th>
                  <th className="text-center border" style={{ width: "1%" }}>
                    {/* 削除ボタンの列の幅を調整 */}
                  </th>
                </tr>
              </thead>
              <tbody>
                {trainings.map((training) => (
                  <tr key={training.id}>
                    <td className="p-2 text-center border">
                      {training.trainingMenu}
                    </td>
                    <td className="p-2 text-center border">
                      {training.weight}kg
                    </td>
                    <td className="p-2 text-center border">
                      {training.count}回
                    </td>
                    <td className="text-center border">
                      {/* 投稿ボタン */}
                      <button
                        className="text-white bg-blue-400 hover:bg-blue-500 rounded-md p-1 flex items-center mb-1"
                        onClick={(e) => addTimeLine(e, training)} // 投稿ボタンがクリックされたときにトレーニング情報を渡す
                        style={{ width: "fit-content" }}
                      >
                        <SlSpeech className="mr-1 hidden sm:table-cell" />
                        <span style={{ whiteSpace: "nowrap" }}>投稿</span>
                      </button>
                      {/* 削除ボタン */}
                      <button
                        className="text-white bg-red-300 hover:bg-red-400 rounded-md p-1 flex items-center"
                        onClick={() => DeleteMemory(training.id)}
                        style={{ width: "fit-content" }}
                      >
                        <RiDeleteBin6Fill className="mr-1 hidden sm:table-cell" />
                        <span style={{ whiteSpace: "nowrap" }}>削除</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={onClose}
          >
            閉じる
          </button>
        </div>
      </div>

      {isTimeLineModalOpen && (
        <TimeLineModal
          isOpen={isTimeLineModalOpen}
          onClose={() => setIsTimeLineModalOpen(false)}
          musclePart={TimeLineMemory?.musclePart}
          trainingMenu={TimeLineMemory?.trainingMenu}
          weight={TimeLineMemory?.weight}
          count={TimeLineMemory?.count}
          date={TimeLineMemory?.date}
          account={TimeLineMemory?.account}
          bodyWeight={TimeLineMemory?.bodyWeight}
          timelineflag={TimeLineMemory?.timelineflag}
        />
      )}
    </div>
  );
};

export default CalendarModal;
