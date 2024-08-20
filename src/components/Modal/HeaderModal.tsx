type HeaderModalProps = {
  closeModal: () => void;
};

const HeaderModal: React.FC<HeaderModalProps> = ({ closeModal }) => {
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 모달 안쪽 클릭 시 이벤트 전파 막기
  };

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={closeModal} // 모달 밖 클릭 시 닫기
    >
      <div
        className="absolute flex flex-col items-center justify-center right-1 mt-[85px] w-[150px] h-[135px] bg-white text-black rounded-[15px] shadow-lg"
        onClick={handleModalClick}
      >
        <button className="w-[140px] h-[42px] border-2 rounded-[10px] hover:text-[#eb4c64] hover:bg-[#ebeeff]">
          마이페이지
        </button>
        <button className="w-[140px] h-[42px] border-2 rounded-[10px] hover:text-[#eb4c64] hover:bg-[#ebeeff]">
          친구 관리
        </button>
        <button className="w-[140px] h-[42px] border-2 rounded-[10px] hover:text-[#eb4c64] hover:bg-[#ebeeff]">
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default HeaderModal;