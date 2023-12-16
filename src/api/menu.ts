import request from '@/utils/request';

// 获取路由
export const getRouters = (): Promise<any> => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}