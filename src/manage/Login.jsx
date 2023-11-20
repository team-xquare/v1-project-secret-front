import React, { useState } from 'react';
import { setSecretCookie } from '../util/cookie';

export const Login = () => {
  
    const [secret, setSecret] = useState('');
    
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
          <label className="block mb-2 text-sm text-gray-700 w-[300px] ">
            비밀키
            <input
                className={`w-full px-3 py-2 mt-1 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
                type="text"
                value={secret}
                onChange={(event) => setSecret(event.target.value)}
            />
          </label>
  
          <a href='/admin/list' onClick={setSecretCookie(secret)}>
            <button
                className="w-full px-4 py-2 mt-6 text-white bg-blue-500 w-[300px] rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                type="submit"
            >
                로그인
            </button>
          </a>
      </div>
    );
  }
  
  export default Login;
  