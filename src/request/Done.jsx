import React, { useEffect, useState } from 'react';

export const Done = () => {
  
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    const currentURL = new URL(window.location.href);
    const searchParams = currentURL.searchParams;
    setProjectName(searchParams.get('projectname'))
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <img className="h-[300px] my-4" src="https://github.com/rlaisqls/rlaisqls/assets/81006587/416ba6e7-193d-43a2-89ec-284a86e72e86" alt="Thankyou"/>
      <p className="text-[20px] text-center leading-loose">
        {projectName} 프로젝트에 대한 배포 신청이 완료되었습니다!<br/>
        배포 Action 사용을 위한 엑세스 키 및 DB 계정 정보는 관리자 검토 후 이메일을 통해 24시간 내에 전송됩니다.<br/>
        Github Actions 사용 방법은 <a href="https://github.com/team-xquare/xquare-deployment-action" rel="noopener noreferrer" target="_blank" >여기</a>서 확인하실 수 있습니다.
      </p>

      <a href="/request">
        <button
            className="w-[120px] px-4 py-2 mt-6 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            type="button" 
        >
            돌아가기
        </button>
      </a>
    </div>
  );
}
