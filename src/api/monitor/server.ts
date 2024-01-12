import request from '@/utils/request';

// 获取服务器信息
export async function getServerInfo() {
  return request({
    url: '/monitor/server', 
    method: 'get',
  });
}
