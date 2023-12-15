import request from '@/utils/request';

export async function getCaptchaImg() {
  return request<API.CaptchaResult>({
    url: '/captchaImage', 
    method: 'get',
    headers: {
      isToken: false,
    },
  });
}

/** 登录接口 POST /login/account */
export async function login(body: API.LoginParams) {
  return request<API.LoginResult>({
    url: '/login', 
    method: 'POST',
    headers: {
      isToken: false,
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/** 获取当前的用户 GET /getUserInfo */
export async function getUserInfo() {
  return request<API.UserInfoResult>({
    url: '/getInfo',
    method: 'GET',
  });
}