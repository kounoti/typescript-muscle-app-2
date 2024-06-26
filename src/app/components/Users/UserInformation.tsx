"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import UserModal from "./UserModal"; // UserModalを追加
import { supabase } from "../../../utils/supabaseClient";

export type userInformationProps = {
  account: string;
};

const UserInformation: React.FC<userInformationProps> = ({ account }) => {
  // 編集モーダルの表示状態を管理するstateを追加
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  console.log("UserInformation内");

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from("userInformation")
          .select("*")
          .eq("user_account", account);

        if (error) {
          throw error;
        }
        console.log("UserPage内にのfetchUserDataに入れています");
        console.log(data[0].user_avatar); // データ取得後にログを出力

        setUser(data[0]);
      } catch (error: any) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, [account]);

  // userがnullの場合、データの取得がまだ行われていないことを示す
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-900"></div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center mt-8">
      <div className="max-w-md w-full bg-white shadow-md border-gray-100 rounded-md p-6">
        <div className="flex items-center">
          <Image
            width="500"
            height="500"
            src={user.user_avatar}
            alt="User Avatar"
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h2 className="text-2xl font-bold">{user.user_name}</h2>
            <p className="text-gray-500">{user.user_age}歳</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-600">
            身長: {user.user_height} cm, 体重: {user.user_weight} kg
          </p>
        </div>
        <div className="flex justify-center items-center mt-8">
          {/* 編集ボタンを追加 */}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={() => setIsModalOpen(true)}
          >
            プロフィールを編集
          </button>
          {/* 編集モーダルを追加 */}
          <UserModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            user={user}
            account={account}
          />
        </div>
      </div>
    </div>
  );
};

export default UserInformation;
