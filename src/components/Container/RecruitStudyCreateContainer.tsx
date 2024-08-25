import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../global.css";
import StudyroomTN from "../rooms/StudyroomTN";
import RecruitStudyForm from "../posts/RecruitStudyForm";
import { validateStudyFormInputs } from "../../utils/validation";
import TabBar from "../posts/TabBar";
import ToastNotification from "../common/ToastNotification";
import SubmitButton from "../common/SubmitButton";
import axiosInstance from "../../utils/axiosInstance";
import DefaultThumbnail from "../../images/study-thumbnail-3.png"

// 스터디룸 객체의 타입을 정의
interface StudyRoom {
  id: number;
  title: string;
  maxUsers: number;
  password: string;
  thumbnail: string | null;
  description: string;
  memberNumber: number;
  createdAt: string;
  deletedAt: string | null;
  camEnabled: boolean;
}

const RecruitStudyCreateContainer: React.FC = () => {
  // 스터디룸 상태 추가
  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>([]);

  // 탭 0 관련 상태
  const [tab0SelectedCategory, setTab0SelectedCategory] = useState<string>("");
  const [tab0Title, setTab0Title] = useState("");
  const [tab0Content, setTab0Content] = useState("");
  const [tab0SelectedStudy, setTab0SelectedStudy] = useState<number | null>(
    null
  );

  // 탭 1 관련 상태
  const [tab1SelectedCategory, setTab1SelectedCategory] = useState<string>("");
  const [tab1Title, setTab1Title] = useState("");
  const [tab1Content, setTab1Content] = useState("");

  // 공통 상태
  const [categoryHelperText, setCategoryHelperText] =
    useState<string>("* 헬퍼텍스트");
  const [titleHelperText, setTitleHelperText] =
    useState<string>("* 헬퍼텍스트");
  const [contentHelperText, setContentHelperText] =
    useState<string>("* 헬퍼텍스트");
  const [studyHelperText, setStudyHelperText] =
    useState<string>("* 헬퍼텍스트");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0); // 현재 활성화된 탭의 인덱스 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  const categories = [
    { name: "캠켜공", icon: "cam-on-icon.png" },
    { name: "캠끄공", icon: "cam-off-icon.png" },
  ];

  // 스터디룸 데이터를 가져오는 useEffect 추가
  useEffect(() => {
    const fetchStudyRooms = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/v1/rooms`);
        setStudyRooms(response.data.data.content);
      } catch (error) {
        console.error("스터디룸 데이터를 불러오는데 실패했습니다:", error);
      }
    };

    fetchStudyRooms();
  }, []);

  useEffect(() => {
    // 유효성 검사 함수 호출
    const {
      categoryHelperText,
      titleHelperText,
      contentHelperText,
      studyHelperText,
    } = validateStudyFormInputs(
      activeTab === 0 ? tab0SelectedCategory : tab1SelectedCategory,
      activeTab === 0 ? tab0Title : tab1Title,
      activeTab === 0 ? tab0Content : tab1Content,
      activeTab === 0 ? tab0SelectedStudy : null
    );

    setCategoryHelperText(categoryHelperText);
    setTitleHelperText(titleHelperText);
    setContentHelperText(contentHelperText);
    setStudyHelperText(studyHelperText);

    setIsFormValid(
      categoryHelperText === "* 통과" &&
        titleHelperText === "* 통과" &&
        contentHelperText === "* 통과" &&
        (activeTab === 0 ? studyHelperText === "* 통과" : true)
    );
  }, [
    tab0SelectedCategory,
    tab0Title,
    tab0Content,
    tab0SelectedStudy,
    tab1SelectedCategory,
    tab1Title,
    tab1Content,
    activeTab,
  ]);

  const handleSubmit = async () => {
    if (isFormValid) {
      let requestBody: any = {
        userId: 1,  // 고정된 userId, 실제로는 로그인한 사용자의 ID를 사용
        title: activeTab === 0 ? tab0Title : tab1Title,
        content: activeTab === 0 ? tab0Content : tab1Content,
        type: activeTab === 0 ? "FINDING_MEMBERS" : "FINDING_ROOMS",
        isRecruited: true,
      };
  
      // activeTab이 0인 경우에만 roomId를 추가
      if (activeTab === 0 && tab0SelectedStudy !== null) {
        requestBody.roomId = tab0SelectedStudy;
      }
        
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_API_URL}/api/v1/posts`,
          requestBody
        );

        if (response.status === 201) {
          console.log("게시글 작성 성공:", response.data);
          handleShowToast();
        }
      } catch (error) {
        console.error("게시글 작성 실패:", error);
        alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } else {
      alert("모든 필드를 채워주세요.");
    }
  };

  const handleShowToast = () => {
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
    navigate("/recruit/list"); // 토스트가 닫힐 때 페이지 이동
  };

  const handleCategorySelect = (category: string) => {
    if (activeTab === 0) {
      setTab0SelectedCategory(
        tab0SelectedCategory === category ? "" : category
      );
    } else {
      setTab1SelectedCategory(
        tab1SelectedCategory === category ? "" : category
      );
    }
  };

  const handleStudySelect = (studyId: number) => {
    setTab0SelectedStudy(tab0SelectedStudy === studyId ? null : studyId);
  };

  return (
    <div className="container mx-auto flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold mb-8 text-black">✍🏻 게시글 작성 ✍🏻</h1>
      <div className="w-full max-w-3xl">
        {/* 상단 탭 바 컴포넌트 */}
        <TabBar activeIndex={activeTab} setActiveIndex={setActiveTab} />

        {activeTab === 0 ? (
          <>
            <RecruitStudyForm
              selectedCategory={tab0SelectedCategory}
              title={tab0Title}
              content={tab0Content}
              categoryHelperText={categoryHelperText}
              titleHelperText={titleHelperText}
              contentHelperText={contentHelperText}
              categories={categories}
              handleCategorySelect={handleCategorySelect}
              handleTitleChange={(e) => setTab0Title(e.target.value)}
              handleContentChange={(e) => setTab0Content(e.target.value)}
            />

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                나의 스터디
              </label>
              <div className="flex space-x-4 pb-4 overflow-x-auto">
                {studyRooms.map((room) => (
                  <div
                    key={room.id}
                    className="cursor-pointer"
                    onClick={() => handleStudySelect(room.id)}
                  >
                    <StudyroomTN
                      id={room.id}
                      title={room.title}
                      camEnabled={room.camEnabled}
                      currentUsers={room.memberNumber}
                      maxUsers={room.maxUsers}
                      thumbnail={room.thumbnail || DefaultThumbnail}
                      isSelected={tab0SelectedStudy === room.id}
                    />
                  </div>
                ))}
              </div>
              <p
                className={`text-${
                  tab0SelectedStudy !== null ? "blue" : "red"
                }-500 text-xs italic mt-3`}
              >
                {studyHelperText}
              </p>
            </div>
          </>
        ) : (
          <RecruitStudyForm
            selectedCategory={tab1SelectedCategory}
            title={tab1Title}
            content={tab1Content}
            categoryHelperText={categoryHelperText}
            titleHelperText={titleHelperText}
            contentHelperText={contentHelperText}
            categories={categories}
            handleCategorySelect={handleCategorySelect}
            handleTitleChange={(e) => setTab1Title(e.target.value)}
            handleContentChange={(e) => setTab1Content(e.target.value)}
          />
        )}

        <SubmitButton
          isFormValid={isFormValid}
          handleClick={handleSubmit}
          text="게시글 등록" 
        />
        {showToast && (
          <ToastNotification message="등록 완료!" onClose={handleCloseToast} />
        )}
      </div>
    </div>
  );
};

export default RecruitStudyCreateContainer;
