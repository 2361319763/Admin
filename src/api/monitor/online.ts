import request from '@/utils/request';

// 查询在线用户列表
export async function getOnlineUserList(
  params?: API.Monitor.OnlineUserListParams,
) {
  return request<API.Monitor.OnlineUserPageResult>({
    url: '/monitor/online/list', 
    method: 'get',
    params,
  });
}

// 强退用户
export async function forceLogout(tokenId: string) {
  return request({
    url: `/monitor/online/${tokenId}`, 
    method: 'detete',
  });
}
