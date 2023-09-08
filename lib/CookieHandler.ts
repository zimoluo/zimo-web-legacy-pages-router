import Cookies from 'js-cookie';

export const getCookie = (key: string) => Cookies.get(key);

export const setCookie = (key: string, value: any) => {
  Cookies.set(key, value, { expires: 90 }); 
};

export const removeCookie = (key: string) => {
  Cookies.remove(key);
};
