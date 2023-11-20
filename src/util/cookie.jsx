import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const name = "secret"

export const setSecretCookie = (value: string, options?: any) => {
    console.log(value)
 	return cookies.set(name, value, {...options}); 
}

export const getSecretCookie = () => {
  console.log("cookie : " + cookies.get(name))
  return cookies.get(name); 
}

export const resetSecretCookie = () => {
    console.log("reset")
    cookies.remove(name, {path : '/'},1000)
    window.location.href = '/admin';	
};