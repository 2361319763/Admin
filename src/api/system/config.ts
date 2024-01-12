import request from '@/utils/request';

// 查询参数配置列表
export async function getConfigList(params?: API.System.ConfigListParams) {
  return request<API.System.ConfigPageResult>({
    url: '/system/config/list',
    method: 'get',
    params,
  });
}

// 查询参数配置详细
export function getConfig(configId: number) {
  return request<API.System.ConfigInfoResult>({
    url: `/system/config/${configId}`, 
    method: 'get',
  });
}

// 新增参数配置
export async function addConfig(params: API.System.Config) {
  return request<API.Result>({
    url: '/system/config', 
    method: 'post',
    data: params,
  });
}

// 修改参数配置
export async function updateConfig(params: API.System.Config) {
  return request<API.Result>({
    url: '/system/config', 
    method: 'put',
    data: params,
  });
}

// 删除参数配置
export async function removeConfig(ids: string) {
  return request<API.Result>({
    url: `/system/config/${ids}`, 
    method: 'delete',
  });
}

// 导出参数配置
export function exportConfig(params?: API.System.ConfigListParams) {
  return request<API.Result>({
    url: `/system/config/export`, 
    method: 'get',
    params,
  });
}

// 刷新参数缓存
export function refreshConfigCache() {
  return request<API.Result>({
    url: '/system/config/refreshCache', 
    method: 'delete',
  });
}
