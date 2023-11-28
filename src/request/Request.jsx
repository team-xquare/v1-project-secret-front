import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InputField({ label, type, value, onChange, error }) {
  return (
    <label className="block mb-2 text-sm text-gray-700">
      {label}
      <input
        className={`w-full px-3 py-2 mt-1 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''}`}
        type={type}
        value={value}
        onChange={onChange}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </label>
  );
}

function CheckboxField({ label, checked, onChange }) {
  return (
    <label className="block mb-2 text-sm text-gray-700">
      {label}
      <br/>
      <input
        className="ml-[5px] transform scale-150"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
    </label>
  );
}

function useInput(initialValue, validation) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  function handleChange(event) {
    const inputValue = event.target.value;
    setValue(inputValue);
    setError(inputValue === '' ? '필수 항목입니다.' : validation(inputValue));
  }
  return { value, setValue, onChange: handleChange, error, setError };
}

export const Request = () => {
  const emailInput = useInput('', (value) => (/^\S+@\S+\.\S+$/.test(value) ? '' : '올바른 이메일 형식이어야 합니다.'));
  const projectNameKrInput = useInput('', (value) => (value.trim() ? '' : '필수 항목입니다.'));
  const projectNameEnInput = useInput('', (value) => (/^[a-z-]+$/.test(value) ? '' : '영어 소문자와 -(대시)만 사용할 수 있습니다.'));
  const teamNameEnInput = useInput('', (value) => (/^[a-z-]+$/.test(value) ? '' : '영어 소문자와 -(대시)만 사용할 수 있습니다.'));
  const githubLinkInput = useInput('', (value) => (/^https:\/\/github\.com\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/.test(value) ? '' : '올바른 깃허브 URL이어야 합니다.'));
  const githubOrganizationInput = useInput('', (value) => (/^[a-zA-Z0-9-\s]+$/.test(value) ? '' : '영어 대소문자, 숫자와 -(대시)만 사용할 수 있습니다.'));
  const typeInput = useInput('', (value) => value === 'fe' || value === 'be' ? '' : 'ㅇㅅㅇ');

  const [useRedis, setUseRedis] = useState(false);
  const [useMySQL, setUseMySQL] = useState(false);
  const [duplicateCheck, setDuplicateCheck] = useState(false);

  useEffect(() => {
    setDuplicateCheck(false)
  }, [projectNameEnInput.value]);

  async function checkProjectNameEnAvailability(value) {
    try {
      await axios.post(`http://localhost:8080/project-secret-manager/project/duplicate?secret=xquare-helloworld&project-name=${value}`)
        .then((res) => {
          if (res.data.duplicate) {
            projectNameEnInput.setError('이미 존재하는 프로젝트명입니다.')
          } else {
            setDuplicateCheck(true)
            projectNameEnInput.setError('')
          }
        })
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    var check = true
    if (!duplicateCheck) { projectNameEnInput.setError('중복체크를 완료해주세요.'); check = false; }
    if (!emailInput.value) { emailInput.setError('필수 항목입니다.'); check = false; }
    if (!projectNameKrInput.value) { projectNameKrInput.setError('필수 항목입니다.'); check = false; }
    if (!projectNameEnInput.value) { projectNameEnInput.setError('필수 항목입니다.'); check = false; }
    if (!teamNameEnInput.value) { teamNameEnInput.setError('필수 항목입니다.'); check = false; }
    if (!githubLinkInput.value) { githubLinkInput.setError('필수 항목입니다.'); check = false; }
    if (!githubOrganizationInput.value) { githubOrganizationInput.setError('필수 항목입니다.'); check = false; }
    if (!typeInput.value) { typeInput.setError('필수 항목입니다.'); check = false; }

    // 모든 입력 필드의 유효성 검사 확인
    if (
      check &&
      !emailInput.error &&
      !projectNameKrInput.error &&
      !projectNameEnInput.error &&
      !teamNameEnInput.error &&
      !githubLinkInput.error &&
      !githubOrganizationInput.error &&
      !typeInput.error
    ) {
      const dataToSubmit = {
        email: emailInput.value,
        nameKo: projectNameKrInput.value,
        nameEn: projectNameEnInput.value,
        team: teamNameEnInput.value,
        organization: githubOrganizationInput.value,
        repository: githubLinkInput.value.replace("https://github.com/", ""),
        type: typeInput.value,
        useRedis: useRedis,
        useMySQL: useMySQL
      };

      // Axios 요청 보내기
      axios.post('http://localhost:8080/project-secret-manager/project', dataToSubmit)
        .then((res) => {console.log(res); window.location.href = '/done?projectname=' + projectNameKrInput.value;})
        .catch((err) => console.error(err));
    }
  }
  
  return (
    <div className="my-[100px] flex flex-col items-center justify-center h-screen bg-gray-200">

      <form className="p-6 mt-[200px] flex flex-col gap-[15px] bg-white rounded shadow-md w-[500px]" onSubmit={handleSubmit}>
        <p>프로젝트 배포를 신청하기 위한 폼입니다.</p>
        <p>배포 Action 사용을 위한 엑세스 키 및 DB 계정 정보는 데브옵스 팀 검토 후 이메일을 통해 24시간 내에 전송됩니다.</p>
        <p>궁금한 사항은 담당자(김은빈, rlaisqls@gmail.com)에게 문의주세요!</p>
        <InputField
          label="이메일"
          type="text"
          {...emailInput}
          required
        />
        <InputField
          label="프로젝트명 (한글)"
          type="text"
          {...projectNameKrInput}
          required
        />
        <div className="flex flex-row gap-[10px]">
          <InputField
            label="프로젝트명 (영어)"
            type="text"
            {...projectNameEnInput}
            required
          /> 
          {!duplicateCheck ? (
            <div className="px-4 py-2 mt-[27.5px] w-fit h-fit outline outline-2 outline-slate-900 rounded-md hover:outline-slate-600 hover:text-slate-600" onClick={async () => checkProjectNameEnAvailability(projectNameEnInput.value)}>중복체크</div>
          ):(
            <div className="px-4 py-2 mt-[27.5px] w-fit h-fit outline outline-2 outline-slate-500 text-slate-500 rounded-md bg-slate-200">사용가능</div>
          )}
        </div>
        <InputField
          label="팀명 (영어)"
          type="text"
          {...teamNameEnInput}
          required
        />
        <InputField
          label="배포할 깃허브 레포지토리 링크"
          type="text"
          {...githubLinkInput}
          required
        />
        <InputField
          label="깃허브 Organization (대시보드 접근 권한 부여를 위해 필요)"
          type="text"
          {...githubOrganizationInput}
        />
        <div>
          배포 타입<br/>
          <div className="mt-[-15px] flex flex-row gap-[10px]">
            {typeInput.value !== 'be' ? 
              (
                <div className="px-4 py-2 mt-6 w-fit outline outline-2 outline-slate-900 rounded-md hover:outline-slate-600 hover:text-slate-600" onClick={() => {typeInput.setValue('be'); typeInput.setError('')} }>Backend</div>
              ):
              (
                <div className="px-4 py-2 mt-6 w-fit outline outline-2 outline-blue-500 text-blue-500 rounded-md">Backend</div>
              )
            }
            {typeInput.value !== 'fe' ? 
              (
                <div className="px-4 py-2 mt-6 w-fit outline outline-2 outline-slate-900 rounded-md hover:outline-slate-600 hover:text-slate-600" onClick={() => {typeInput.setValue('fe'); typeInput.setError('')}} >Frontend</div>
              ):
              (
                <div className="px-4 py-2 mt-6 w-fit outline outline-2 outline-blue-500 text-blue-500 rounded-md">Frontend</div>
              )
            }
          </div>
          {typeInput.error && <p className="text-red-500 text-sm mt-1">{typeInput.error}</p>}
        </div>
        <CheckboxField
          label="Redis 사용 여부"
          checked={useRedis}
          onChange={() => setUseRedis(!useRedis)}
        />
        <CheckboxField
          label="MySQL 사용 여부"
          checked={useMySQL}
          onChange={() => setUseMySQL(!useMySQL)}
        />

        <button
          className="w-full px-4 py-2 mt-6 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          type="submit"
        >
          제출하기
        </button>
      </form>
    </div>
  );
}

export default Request;
