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

export const SignUp = () => {
  const nameInput = useInput('', (value) => (/^[가-힣]+$/.test(value) ? '' : '올바른 이름을 입력해주세요.'));
  const studentNumberInput = useInput('', (value) => (1100 < value && value < 1500 ? '' : '올바른 학번을 입력해주세요.'))
  const birthdayInput = useInput('', (value) => (/^\d{4}-\d{2}-\d{2}$/.test(value) ? '' : '올바른 형식으로 입력해주세요.'));
  const accountIdInput = useInput('', (value) => (/^[a-zA-Z0-9\s]+$/.test(value) ? '' : '영어 대소문자, 숫자만 사용할 수 있습니다.'));
  const passwordInput = useInput('', (value) => (/(?=.*[a-z])(?=.*[0-9])(?=.*[!#$%&'()*+,./:;<=>?@＼^_`{|}~])[a-zA-Z0-9!#$%&'()*+,./:;<=>?@＼^_`{|}~]{8,30}$/.test(value) ? '' : '비밀번호는 영어, 숫자, 특수문자가 포함된 8~30자여야 합니다.'));
  const passwordCheckInput = useInput('', (value) => (value === passwordInput.value ? '' : '비밀번호가 일치하지 않습니다.'))

  const [studentNumberDuplicateCheck, setStudentNumberDuplicateCheck] = useState(false);
  const [accountIdDuplicateCheck, setAccountIdDuplicateCheck] = useState(false);

  useEffect(() => {
    setStudentNumberDuplicateCheck(false)
  }, [studentNumberInput.value]);

  const baseurl = 'https://prod-server.xquare.app/dsm-login'
  async function checkStudentNumberAvailability(value) {
    try {
      if (!studentNumberInput.error || studentNumberInput.error === '중복체크를 완료해주세요.') {
        await axios.get(baseurl + '/user/class-number-check/' + value)
          .then((res) => {
            if (res.data.duplicated) {
              studentNumberInput.setError('이미 존재하는 학번입니다.')
            } else {
              setStudentNumberDuplicateCheck(true)
              studentNumberInput.setError('')
            }
          })
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setAccountIdDuplicateCheck(false)
  }, [accountIdInput.value]);

  async function checkAccountIdAvailability(value) {
    try {
      if (!accountIdInput.error || accountIdInput.error === '중복체크를 완료해주세요.') {
        await axios.get(baseurl + '/user/account-id-check/' + value)
            .then((res) => {
              if (res.data.duplicated) {
                accountIdInput.setError('이미 존재하는 아이디입니다.')
              } else {
                setAccountIdDuplicateCheck(true)
                accountIdInput.setError('')
              }
            })
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let check = true;
    if (!studentNumberDuplicateCheck) { studentNumberInput.setError('중복체크를 완료해주세요.'); check = false; }
    if (!accountIdDuplicateCheck) { accountIdInput.setError('중복체크를 완료해주세요.'); check = false; }

    if (!nameInput.value) { nameInput.setError('필수 항목입니다.'); check = false; }
    if (!birthdayInput.value) { birthdayInput.setError('필수 항목입니다.'); check = false; }
    if (!studentNumberInput.value) { studentNumberInput.setError('필수 항목입니다.'); check = false; }
    if (!accountIdInput.value) { accountIdInput.setError('필수 항목입니다.'); check = false; }
    if (!passwordInput.value) { passwordInput.setError('필수 항목입니다.'); check = false; }
    if (!passwordCheckInput.value) { passwordCheckInput.setError('비밀번호를 다시 한 번 입력해주세요.'); check = false; }

    // 모든 입력 필드의 유효성 검사 확인
    if (
      check &&
      !nameInput.error &&
      !birthdayInput.error &&
      !studentNumberInput.error &&
      !accountIdInput.error &&
      !passwordInput.error &&
      !passwordCheckInput.error
    ) {
      const dataToSubmit = {
        name: nameInput.value,
        birthday: birthdayInput.value,
        birth_day: birthdayInput.value,
        class_number: studentNumberInput.value,
        account_id: accountIdInput.value,
        password: passwordInput.value,
        password_check: passwordInput.value
      };
      // Axios 요청 보내기
      axios.post(baseurl + '/user/signup', dataToSubmit)
        .then((res) => {console.log(res); window.location.href = '/signup/done'})
        .catch((err) => console.error(err));
    }
  }
  
  return (
    <div className="my-[2%] flex flex-col items-center justify-center h-screen bg-gray-200">
      <form className="p-6 flex text-[0.9em] flex-col gap-[15px] bg-white rounded w-[100%]" onSubmit={handleSubmit}>
        <img alt="logo" className="my-0 mx-auto h-16" src="https://github.com/rlaisqls/TIL/assets/81006587/4492b702-5cb6-40af-821d-e264cd82549b"/>
        <p>안녕하세요. Xquare 회원가입 페이지입니다 :)<br/>자신의 정보를 입력하여 회원가입 해주세요!</p>
        <InputField
            label="이름"
            type="text"
            {...nameInput}
            required
        />
        <InputField
            label="생일 (ex. 2006-12-14)"
            type="text"
            {...birthdayInput}
            required
        />
        <div className="flex flex-row gap-[10px]">
          <InputField
              label="학번"
              type="number"
              {...studentNumberInput}
              required
          />
          {!studentNumberDuplicateCheck ? (
              <div
                  className="px-4 py-2 mt-[27.5px] w-fit h-fit outline outline-2 outline-slate-900 rounded-md hover:outline-slate-600 hover:text-slate-600"
                  onClick={async () => checkStudentNumberAvailability(studentNumberInput.value)}>중복체크</div>
          ) : (
              <div
                  className="px-4 py-2 mt-[27.5px] w-fit h-fit outline outline-2 outline-slate-500 text-slate-500 rounded-md bg-slate-200">사용가능</div>
          )}
        </div>
        <div className="flex flex-row gap-[10px]">
          <InputField
              label="아이디"
              type="text"
              {...accountIdInput}
              required
          />
          {!accountIdDuplicateCheck ? (
              <div
                  className="px-4 py-2 mt-[27.5px] w-fit h-fit outline outline-2 outline-slate-900 rounded-md hover:outline-slate-600 hover:text-slate-600"
                  onClick={async () => checkAccountIdAvailability(accountIdInput.value)}>중복체크</div>
          ) : (
              <div
                  className="px-4 py-2 mt-[27.5px] w-fit h-fit outline outline-2 outline-slate-500 text-slate-500 rounded-md bg-slate-200">사용가능</div>
          )}
        </div>
        <InputField
            label="비밀번호"
            type="password"
            {...passwordInput}
        />
        <InputField
            label="비밀번호 확인"
            type="password"
            {...passwordCheckInput}
        />

        <button
            className="w-full px-4 py-2 mt-6 text-white bg-[#9650FA] rounded-md hover:bg-[#8640FA] focus:outline-none focus:shadow-outline"
            type="submit"
        >
          제출하기
        </button>
      </form>
    </div>
  );
}

export default SignUp;
