import request from '@/utils/request';

// 查询操作日志记录列表
export async function getOperlogList(params?: API.Monitor.OperlogListParams) {
  return request<API.Monitor.OperlogPageResult>({
    url: '/monitor/operlog/list', 
    method: 'get',
    params,
  });
}

// 查询操作日志记录详细
export function getOperlog(operId: number) {
  return request<API.Monitor.OperlogInfoResult>({
    url: `/system/operlog/${operId}`, 
    method: 'get',
  });
}

// 新增操作日志记录
export async function addOperlog(params: API.Monitor.Operlog) {
  return request<API.Result>({
    url: '/system/operlog', 
    method: 'post',
    data: params,
  });
}

// 修改操作日志记录
export async function updateOperlog(params: API.Monitor.Operlog) {
  return request<API.Result>({
    url: '/system/operlog', 
    method: 'put',
    data: params,
  });
}

// 删除操作日志记录
export async function removeOperlog(ids: string) {
  return request<API.Result>({
    url: `/system/operlog/${ids}`, 
    method: 'delete',
  });
}

// 导出操作日志记录
export function exportOperlog(params?: API.Monitor.OperlogListParams) {
  return request<API.Result>({
    url: `/system/operlog/export`, 
    method: 'get',
    params,
  });
}
