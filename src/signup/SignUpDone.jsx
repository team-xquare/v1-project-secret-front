import React from "react";

export const SignUpDone = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <img
        className="w-[280px] h-[300px] max-w-72 my-4"
        src="https://github.com/rlaisqls/rlaisqls/assets/81006587/416ba6e7-193d-43a2-89ec-284a86e72e86"
        alt="Thankyou"
      />
      <p className="text-[1em] text-center leading-loose">
        감사합니다! DAS 회원가입이 완료되었습니다 :)
        <br />
        곧 공개될 학교 프로젝트들을 기대해주세요!
        <br />
        심심한 1학년이라면 아래 링크를 한 번 눌러보세용
      </p>

      <a href="https://scratched-aries-15e.notion.site/DSM-1-d314aa7ba06642cd999c6b01c7a35cc8?pvs=4">
        <button
          className="w-[100%] px-4 py-2 mt-6 text-white bg-[#1ABCE3] rounded-md hover:bg-[#0877BE] focus:outline-none focus:shadow-outline"
          type="button">
          선배들이 준비한 신입생 로드맵
        </button>
      </a>
    </div>
  );
};
