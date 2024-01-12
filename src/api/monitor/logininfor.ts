import request from '@/utils/request';

// 查询系统访问记录列表
export async function getLogininforList(
  params?: API.Monitor.LogininforListParams,
) {
  return request<API.Monitor.LogininforPageResult>({
    url: '/monitor/logininfor/list', 
    method: 'get',
    params,
  });
}

// 查询系统访问记录详细
export function getLogininfor(infoId: number) {
  return request<API.Monitor.LogininforInfoResult>(
    {
      url: `/system/logininfor/${infoId}`,
      method: 'get',
    },
  );
}

// 新增系统访问记录
export async function addLogininfor(params: API.Monitor.Logininfor) {
  return request<API.Result>({
    url: '/system/logininfor', 
    method: 'post',
    data: params,
  });
}

// 修改系统访问记录
export async function updateLogininfor(params: API.Monitor.Logininfor) {
  return request<API.Result>({
    url: '/system/logininfor', 
    method: 'put',
    data: params,
  });
}

// 删除系统访问记录
export async function removeLogininfor(ids: string) {
  return request<API.Result>({
    url: `/system/logininfor/${ids}`, 
    method: 'delete',
  });
}

// 导出系统访问记录
export function exportLogininfor(params?: API.Monitor.LogininforListParams) {
  return request<API.Result>({
    url: `/system/logininfor/export`, 
    method: 'get',
    params,
  });
}

// 解锁用户登录状态
export function unlockLogininfor(userName: string) {
  return request<API.Result>({
    url: '/system/logininfor/unlock/' + userName, 
    method: 'get',
  });
}

// 清空登录日志
export function cleanLogininfor() {
  return request<API.Result>({
    url: '/system/logininfor/clean', 
    method: 'delete',
  });
}
