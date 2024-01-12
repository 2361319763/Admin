import request from '@/utils/request';

// 查询字典数据列表
export async function getDictDataList(
  params?: API.System.DictDataListParams,
) {
  return request<API.System.DictDataPageResult>({
    url: '/system/dict/data/list', 
    method: 'get',
    params,
  });
}

// 查询字典数据详细
export function getDictData(
  dictCode: number,
) {
  return request<API.System.DictDataInfoResult>({
    url: `/system/dict/data/${dictCode}`,
    method: 'get',
  });
}

// 新增字典数据
export async function addDictData(
  params: API.System.DictData,
) {
  return request<API.Result>({
    url: '/system/dict/data', 
    method: 'post',
    data: params,
  });
}

// 修改字典数据
export async function updateDictData(
  params: API.System.DictData,
) {
  return request<API.Result>({
    url: '/system/dict/data', 
    method: 'PUT',
    data: params,
  });
}

// 删除字典数据
export async function removeDictData(
  ids: string,
) {
  return request<API.Result>({
    url: `/system/dict/data/${ids}`, 
    method: 'delete',
  });
}

// 导出字典数据
export function exportDictData(
  params?: API.System.DictDataListParams,
) {
  return request<API.Result>({
    url: `/system/dict/data/export`, 
    method: 'get',
    params,
  });
}
