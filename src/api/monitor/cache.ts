import request from '@/utils/request';

// 获取服务器信息
export async function getCacheInfo() {
  return request<API.Monitor.CacheInfoResult>({
    url: '/monitor/cache', 
    method: 'get',
  });
}
