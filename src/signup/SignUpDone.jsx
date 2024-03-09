import React, { useEffect, useState } from 'react';

export const SignUpDone = () => {
  
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    const currentURL = new URL(window.location.href);
    const searchParams = currentURL.searchParams;
    setProjectName(searchParams.get('projectname'))
  }, []);

  return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
          <img className="my-0 mx-auto h-16"
               src="https://github.com/rlaisqls/TIL/assets/81006587/4492b702-5cb6-40af-821d-e264cd82549b"/>

          <img className="h-[300px] my-4"
               src="https://github.com/rlaisqls/rlaisqls/assets/81006587/416ba6e7-193d-43a2-89ec-284a86e72e86"
               alt="Thankyou"/>
          <p className="text-[20px] text-center leading-loose">
              감사합니다! Xquare 회원가입이 완료되었습니다 :)<br/>
              곧 공개될 학교 프로젝트들을 기대해주세요!<br/>
              심심한 1학년이라면 아래 링크를 한 번 눌러보세용
          </p>

          <a href="https://scratched-aries-15e.notion.site/DSM-1-d314aa7ba06642cd999c6b01c7a35cc8?pvs=4">
              <button
                  className="w-[230px] px-4 py-2 mt-6 text-white bg-[#9650FA] rounded-md hover:bg-[#8640FA] focus:outline-none focus:shadow-outline"
                  type="button"
              >
                  선배들이 준비한 신입생 로드맵
              </button>
          </a>
      </div>
  );
}
