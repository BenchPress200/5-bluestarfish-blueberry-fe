import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import StudyroomContainer from "../components/Container/StudyroomContainer";
import Sidebar from "../components/rooms/Sidebar";

interface StudyRoom {
  id: number;
  title: string;
  cam_enabled: boolean;
  maxUsers: number;
  thumbnail: string;
  users: { id: number; name: string }[];
}

const StudyroomPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [studyRoom, setStudyRoom] = useState<StudyRoom>();
  const { roomId } = useParams<{ roomId: string }>(); // URL에서 roomId를 가져옴
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const myUserId = 1;

  useEffect(() => {
    fetchStudyRoom();
  }, []);

  const fetchStudyRoom = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/v1/rooms/${roomId}`);
      if (response.status === 200) {
        setStudyRoom(response.data);
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404) {
          console.error(
            "404 오류: ",
            error.response.data.message || "스터디룸을 찾을 수 없습니다."
          );
        } else {
          console.error(
            `오류 발생 (${error.response.status}):`,
            error.response.data.message || "서버 오류가 발생했습니다."
          );
        }
      } else {
        console.error("스터디룸 정보를 가져오는 중 오류 발생:", error.message);
      }
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-black min-h-screen">
      <div
        className={`flex-grow transition-all duration-300 ${
          isSidebarOpen ? "mr-[400px]" : "mr-0"
        }`}
      >
        <div className="grid grid-cols-3 items-center p-[15px]">
          <div className="justify-self-start rounded-[20px] w-[172px] h-[51px] bg-[#6d81d5] text-white text-[20px] font-bold flex items-center justify-center">
            방제
          </div>
          <div className="justify-self-center flex flex-row items-center gap-2">
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/timer.png`}
              alt="Timer"
              className="w-[40px] cursor-pointer"
            />
            <div className="flex flex-col items-center">
              <p className="text-[#999999] text-[13px] font-bold">
                공부 시간 / 목표 시간
              </p>
              <p className="text-white text-[20px] font-bold">
                15:32:45 / 18:00:00
              </p>
            </div>
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/connected.png`}
              alt="Connected"
              className="w-[26px] h-[26px] cursor-pointer"
            />
          </div>
          {!isSidebarOpen && (
            <button className="justify-self-end" onClick={toggleSidebar}>
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/side.png`}
                alt="Sidebar"
                className="w-[25px] cursor-pointer"
              />
            </button>
          )}
        </div>
        <StudyroomContainer />
      </div>
      {isSidebarOpen && <Sidebar toggleSidebar={toggleSidebar}></Sidebar>}
    </div>
  );
};

export default StudyroomPage;