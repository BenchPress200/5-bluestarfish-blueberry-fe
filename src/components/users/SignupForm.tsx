import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  validateEmail,
  validateUserPassword,
  validateNickname,
  validatePasswordMatch,
} from "../../utils/validation"; // 입력값을 검증하는 함수 가져오기
import axiosInstance from "../../utils/axiosInstance";
import Lottie from "react-lottie-player";
import loadingAnimation from "../../animations/email-loading.json";

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [authCode, setAuthCode] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [helperText, setHelperText] = useState<string>(""); // 헬퍼 텍스트 상태
  const [helperTextColor, setHelperTextColor] =
    useState<string>("text-red-500"); // 핼퍼 텍스트 색상 상태
  const [emailHelperText, setEmailHelperText] = useState<string>(""); // 헬퍼 텍스트 상태
  const [emailHelperTextColor, setEmailHelperTextColor] =
    useState<string>("text-red-500"); // 핼퍼 텍스트 색상 상태
  const [isPossibleRequestEmail, setIsPossibleRequestEmail] =
    useState<boolean>(false);
  const [authCodeHelperText, setAuthCodeHelperText] = useState<string>(""); // 헬퍼 텍스트 상태
  const [authCodeHelperTextColor, setAuthCodeHelperTextColor] =
    useState<string>("text-red-500"); // 핼퍼 텍스트 색상 상태
  const [nicknameHelperText, setNicknameHelperText] = useState<string>(""); // 헬퍼 텍스트 상태
  const [nicknameHelperTextColor, setNicknameHelperTextColor] =
    useState<string>("text-red-500"); // 핼퍼 텍스트 색상 상태
  const [passwordHelperText, setPasswordHelperText] = useState<string>(""); // 헬퍼 텍스트 상태
  const [passwordHelperTextColor, setPasswordHelperTextColor] =
    useState<string>("text-red-500"); // 핼퍼 텍스트 색상 상태
  const [confirmPasswordhelperText, setConfirmPasswordHelperText] =
    useState<string>(""); // 헬퍼 텍스트 상태
  const [confirmPasswordHelperTextColor, setConfirmPasswordHelperTextColor] =
    useState<string>("text-red-500"); // 핼퍼 텍스트 색상 상태
  const [isValid, setIsValid] = useState<boolean>(false); // 입력값의 유효성 상태
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const [isValidPassword, setIsValidPassword] = useState<boolean>(false);
  const [isValidRequestEmail, setIsValidRequestEmail] = useState<number>(0);
  const [isValidNickname, setIsValidNickname] = useState<boolean>(false); // 입력값의 유효성 상태
  const [isValidConfirmPassword, setIsValidConfirmPassword] =
    useState<boolean>(false); // 입력값의 유효성 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    checkEmail();
  }, [email]);

  useEffect(() => {
    checkPassword();
  }, [password]);

  useEffect(() => {
    checkNickname();
  }, [nickname]);

  useEffect(() => {
    checkConfirmPassword();
  }, [confirmPassword, password]);

  useEffect(() => {
    console.log(
      isValidEmail,
      isValidPassword,
      isValidNickname,
      isValidConfirmPassword
    );
    if (
      isValidEmail &&
      isValidPassword &&
      isValidNickname &&
      isValidConfirmPassword
    )
      setIsValid(true);
    else setIsValid(false);
  }, [isValidEmail, isValidPassword, isValidNickname, isValidConfirmPassword]);

  // 입력값 유효성 검사 함수
  const checkEmail = () => {
    const trimmedEmail = email.trim(); // 이메일 양끝 공백 제거
    const validationMessage = validateEmail(trimmedEmail); // 유효성 검사

    // 유효성 검사 결과에 따라 상태 업데이트
    if (validationMessage === "") {
      setIsValidEmail(true); // 유효한 입력일 때
      setEmailHelperText("*"); // 헬퍼 텍스트를 기본값으로 설정
      setEmailHelperTextColor("[#EBEEFF]"); // 색상을 변경 (비활성화 색상)
      setIsPossibleRequestEmail(true);
    } else {
      setIsValidEmail(false); // 유효하지 않은 입력일 때
      setEmailHelperText(`* ${validationMessage}`); // 유효성 검사 메시지 표시
      setEmailHelperTextColor("red-500"); // 색상을 빨간색으로 설정
      setIsPossibleRequestEmail(false);
    }
  };

  const checkPassword = () => {
    const trimmedPassword = password.trim(); // 이메일 양끝 공백 제거
    const validationMessage = validateUserPassword(trimmedPassword); // 유효성 검사

    // 유효성 검사 결과에 따라 상태 업데이트
    if (validationMessage === "") {
      setIsValidPassword(true); // 유효한 입력일 때
      setPasswordHelperText("*"); // 헬퍼 텍스트를 기본값으로 설정
      setPasswordHelperTextColor("[#EBEEFF]"); // 색상을 변경 (비활성화 색상)
    } else {
      setIsValidPassword(false); // 유효하지 않은 입력일 때
      setPasswordHelperText(`* ${validationMessage}`); // 유효성 검사 메시지 표시
      setPasswordHelperTextColor("red-500"); // 색상을 빨간색으로 설정
    }
  };

  const sendEmailVerificationCode = async (email: string) => {
    setIsValidRequestEmail(3);
    setIsPossibleRequestEmail(false);
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/api/v1/auth/mail`,
        {
          email: email,
          type: "join",
        }
      );

      if (response.status === 201) {
        setIsValidRequestEmail(1);
      }
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.message);
        setIsValidRequestEmail(2);
        setIsPossibleRequestEmail(true);
      }
    }
  };

  const sendAuthCode = async (trimmedEmail: string, trimmedCode: string) => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/api/v1/auth/mail?email=${trimmedEmail}&code=${trimmedCode}`
      );

      if (response.status === 200) {
        alert("인증에 성공하였습니다!");
      }
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.message);
        alert("인증 실패");
      }
    }
  };

  const sendNickname = async (trimmedNickname: string) => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/api/v1/users/nickname/nickname=${trimmedNickname}`
      );

      if (response.status === 200) {
        alert("닉네임 중복 검사 통과");
      }
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.message);
      }
    }
  };

  const handleEmailVerificationButtonClick = async () => {
    const trimmedEmail = email.trim();
    sendEmailVerificationCode(trimmedEmail);
  };

  const handleAuthCodeButtonClick = async () => {
    const trimmedEmail = email.trim();
    const trimmedCode = authCode.trim();
    sendAuthCode(trimmedEmail, trimmedCode);
  };

  const handleIsNicknameAvailableButtonClick = async () => {
    const trimmedNickname = nickname.trim();
    sendNickname(trimmedNickname);
  };

  // 닉네임 유효성 검사 함수
  const checkNickname = () => {
    const trimmedNickname = nickname.trim();
    const validationMessage = validateNickname(trimmedNickname); // 유효성 검사

    // 유효성 검사 결과에 따라 상태 업데이트
    if (validationMessage === "사용 가능한 닉네임입니다.") {
      setIsValidNickname(true); // 유효한 입력일 때
      setNicknameHelperText("*"); // 헬퍼 텍스트를 기본값으로 설정
      setNicknameHelperTextColor("[#EBEEFF]"); // 색상을 변경 (비활성화 색상)
    } else {
      setIsValidNickname(false); // 유효하지 않은 입력일 때
      setNicknameHelperText(`* ${validationMessage}`); // 유효성 검사 메시지 표시
      setNicknameHelperTextColor("red-500"); // 색상을 빨간색으로 설정
    }
  };

  // 닉네임 유효성 검사 함수
  const checkConfirmPassword = () => {
    const validationMessage = validatePasswordMatch(password, confirmPassword); // 유효성 검사

    // 유효성 검사 결과에 따라 상태 업데이트
    if (validationMessage === "") {
      setIsValidConfirmPassword(true); // 유효한 입력일 때
      setConfirmPasswordHelperText("*"); // 헬퍼 텍스트를 기본값으로 설정
      setConfirmPasswordHelperTextColor("[#EBEEFF]"); // 색상을 변경 (비활성화 색상)
    } else {
      setIsValidConfirmPassword(false); // 유효하지 않은 입력일 때
      setConfirmPasswordHelperText(`* ${validationMessage}`); // 유효성 검사 메시지 표시
      setConfirmPasswordHelperTextColor("red-500"); // 색상을 빨간색으로 설정
    }
  };

  //유효하지 않은 닉네임입니다.

  // 회원가입 후 게시물 목록 페이지로 리다이렉트하는 함수
  const redirectToPostListPage = (): void => {
    window.location.href = "/"; // 루트 페이지로 리다이렉트
  };

  // 임시 회원가입 함수
  const signupUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 폼 제출 기본 동작 방지
    if (isLoading) return;

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedNickname = nickname.trim();

    try {
      setIsLoading(true);
      console.log(`${process.env.REACT_APP_API_URL}/api/v1/users`);
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/api/v1/users`,
        {
          email: trimmedEmail,
          nickname: trimmedNickname,
          password: trimmedPassword,
        }
      );

      if (response.status === 201) {
        console.log("201: Create, 회원가입 성공!");
        redirectToPostListPage();
      }
    } catch (error) {
      console.log(error);
      alert("회원가입 실패!");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const renderImage = () => {
    if (isValidRequestEmail === 0) {
      return <div className="h-[14px]"></div>;
    } else if (isValidRequestEmail === 1) {
      return (
        <img
          src={`${process.env.PUBLIC_URL}/assets/images/email-request-success.png`}
          alt="request-success"
          className="ml-[10px] mt-[8px] h-[12px] w-[12px]"
        />
      );
    } else if (isValidRequestEmail === 2) {
      return (
        <img
          src={`${process.env.PUBLIC_URL}/assets/images/email-request-fail.png`}
          alt="request-fail"
          className="ml-[10px] mt-[8px] h-[12px] w-[14px] mb-[2px]"
        />
      );
    } else if (isValidRequestEmail === 3) {
      return (
        <div className="w-[50px] h-[30px] overflow-hidden flex justify-center items-center">
          <Lottie
            loop
            animationData={loadingAnimation}
            play
            className="w-20 h-20"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 bg-[#EEEEFF] rounded-[15px] flex flex-col justify-center items-center">
      <h2 className="text-[25px] font-bold text-gray-800 mb-6 text-center">
        회원가입
      </h2>
      <form className="w-[300px] h-[600px] mb-20" onSubmit={signupUser}>
        <div className="relative mb-4 mt-10">
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            } // 이메일 상태 업데이트
            className="peer w-full h-12 p-3 text-gray-700 border-b border-gray-300 rounded-lg focus:outline-none focus:border-[#4558A9] placeholder-transparent hover:border-[#4558A9]"
            placeholder="email"
          />
          {/* 이메일 입력 값이 없을 때 표시되는 라벨 */}
          {email === "" && (
            <label
              htmlFor="email"
              className="absolute left-3 top-3 text-gray-500 transition-all duration-300 transform origin-left pointer-events-none
                        peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
                        peer-focus:-translate-y-9 peer-hover:-translate-y-9
                        peer-focus:text-[#4558A9] peer-hover:text-[#4558A9]"
            >
              이메일
            </label>
          )}
          <p className={`text-${emailHelperTextColor} text-xs italic`}>
            {emailHelperText}
          </p>
        </div>
        <button
          className={`w-full h-[40px] border-2 border-[#4659AA] rounded-[15px] text-[#4659AA] text-[16px] font-bold  ${
            isPossibleRequestEmail === true
              ? "bg-[#4659AA] text-white hover:bg-[#1A349D] cursor-pointer"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
          type="button"
          onClick={handleEmailVerificationButtonClick}
          disabled={isPossibleRequestEmail !== true}
        >
          이메일 인증하기
        </button>

        <div>{renderImage()}</div>
        {/* 인증코드 입력 필드 */}
        <div className="relative mb-6 mt-6 flex items-center gap-1">
          <input
            type="text"
            id="code"
            value={authCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAuthCode(e.target.value)
            } // 인증코드 상태 업데이트
            className="peer w-[85%] h-12 p-3 text-gray-700 border-b border-gray-300 rounded-lg focus:outline-none focus:border-[#4558A9] placeholder-transparent hover:border-[#4558A9]"
          />
          <button
            className={`w-[13%] h-[40px] border-2 border-[#4659AA] rounded-[15px] text-[14px] font-bold "bg-[#4659AA] text-[#4659AA] hover:bg-[#1A349D] hover:text-white cursor-pointer"
            }`}
            type="button"
            onClick={handleAuthCodeButtonClick}
          >
            확인
          </button>
          {/* 인증코드 입력 값이 없을 때 표시되는 라벨 */}
          {authCode === "" && (
            <label
              htmlFor="authCode"
              className="absolute left-3 top-3 text-gray-500 transition-all duration-300 transform origin-left pointer-events-none
                        peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
                        peer-focus:-translate-y-9 peer-hover:-translate-y-9
                        peer-focus:text-[#4558A9] peer-hover:text-[#4558A9]"
            >
              인증코드
            </label>
          )}
          {/* 헬퍼 텍스트 표시 */}
          <p className={`text-${authCodeHelperTextColor} text-xs italic`}>
            {authCodeHelperText}
          </p>
        </div>
        {/* 닉네임 입력 필드 */}
        <div className="relative mb-6 mt-6">
          <div className="flex items-center gap-2">
            <input
              type="nickname"
              id="nickname"
              value={nickname}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNickname(e.target.value)
              } // 닉네임 상태 업데이트
              className="peer w-[80%] h-12 p-3 text-gray-700 border-b border-gray-300 rounded-lg focus:outline-none focus:border-[#4558A9] placeholder-transparent hover:border-[#4558A9]"
              placeholder="10자 이하, 영어, 한글, 숫자만 가능합니다."
            />
            <button
              className={`w-[18%] h-[40px] border-2 border-[#4659AA] rounded-[15px] text-[12px] font-bold "bg-[#4659AA] text-[#4659AA] hover:bg-[#1A349D] hover:text-white cursor-pointer"
            }`}
              type="button"
              onClick={handleIsNicknameAvailableButtonClick}
            >
              중복확인
            </button>
          </div>
          {/* 닉네임 입력 값이 없을 때 표시되는 라벨 */}
          {nickname === "" && (
            <label
              htmlFor="password"
              className="absolute left-3 top-3 text-gray-500 transition-all duration-300 transform origin-left pointer-events-none
                        peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
                        peer-focus:-translate-y-9 peer-hover:-translate-y-9
                        peer-focus:text-[#4558A9] peer-hover:text-[#4558A9]"
            >
              닉네임
            </label>
          )}
          {/* 헬퍼 텍스트 표시 */}
          <p className={`text-${nicknameHelperTextColor} text-xs italic`}>
            {nicknameHelperText}
          </p>
        </div>
        {/* 비밀번호 입력 필드 */}
        <div className="relative mb-6 mt-6">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            } // 비밀번호 상태 업데이트
            className="peer w-full h-12 p-3 text-gray-700 border-b border-gray-300 rounded-lg focus:outline-none focus:border-[#4558A9] placeholder-transparent hover:border-[#4558A9]"
            placeholder="password"
          />
          {/* 비밀번호 입력 값이 없을 때 표시되는 라벨 */}
          {password === "" && (
            <label
              htmlFor="password"
              className="absolute left-3 top-3 text-gray-500 transition-all duration-300 transform origin-left pointer-events-none
                        peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
                        peer-focus:-translate-y-9 peer-hover:-translate-y-9
                        peer-focus:text-[#4558A9] peer-hover:text-[#4558A9]"
            >
              비밀번호
            </label>
          )}
          {/* 헬퍼 텍스트 표시 */}
          <p className={`text-${passwordHelperTextColor} text-xs italic`}>
            {passwordHelperText}
          </p>
        </div>
        {/* 비밀번호 확인 입력 필드 */}
        <div className="relative mb-6 mt-6">
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            } // 비밀번호 상태 업데이트
            className="peer w-full h-12 p-3 text-gray-700 border-b border-gray-300 rounded-lg focus:outline-none focus:border-[#4558A9] placeholder-transparent hover:border-[#4558A9]"
            placeholder="confirmPassword"
          />
          {/* 비밀번호 입력 값이 없을 때 표시되는 라벨 */}
          {confirmPassword === "" && (
            <label
              htmlFor="confirmPassword"
              className="absolute left-3 top-3 text-gray-500 transition-all duration-300 transform origin-left pointer-events-none
                        peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
                        peer-focus:-translate-y-9 peer-hover:-translate-y-9
                        peer-focus:text-[#4558A9] peer-hover:text-[#4558A9]"
            >
              비밀번호 확인
            </label>
          )}
          {/* 헬퍼 텍스트 표시 */}
          <p
            className={`text-${confirmPasswordHelperTextColor} text-xs italic`}
          >
            {confirmPasswordhelperText}
          </p>
        </div>
        {/* 회원가입 버튼 */}
        <div className="flex justify-center">
          <button
            className={`relative h-[40px] ${
              isValid
                ? "bg-[#4659AA] hover:bg-[#1A349D]"
                : "bg-gray-400 cursor-not-allowed"
            } text-white font-bold py-3 px-6 rounded-full w-[70%] flex items-center justify-center text-center mb-3`}
            disabled={!isValid}
          >
            <span className="absolute transform transition-transform duration-300">
              가입하기
            </span>
          </button>
        </div>
      </form>

      {/* 구분선 */}
      <hr className="my-6 border-gray-300 w-[60%]" />

      {/* 카카오 버튼 */}
      <button
        className="bg-[#FFEB3B] hover:bg-[#FFE500] text-gray-800 py-2 px-4 focus:outline-none focus:shadow-outline w-[70%] rounded-full"
        type="button"
      >
        <div className="flex items-center space-x-4">
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/kakao-talk.png`}
            alt="Logo"
            className="h-5 w-5"
          />
          <span>Kakao</span>
        </div>
      </button>

      {/* 비밀번호 재설정 링크 */}
      <div className="text-center mt-4">
        <small>비밀번호를 잃어버리셨나요?</small>
        <br />
        <a
          href="#"
          className="text-[#4558A9] hover:text-[#334281] font-semibold"
        >
          비밀번호 재설정
        </a>
      </div>
    </div>
  );
};

export default SignupForm;