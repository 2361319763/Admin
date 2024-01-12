import { downLoadZip } from '@/utils/downloadfile';
import request from '@/utils/request';
import type { GenCodeTableListParams, GenCodeType } from './data.d';

// 查询分页列表
export async function getGenCodeList(params?: GenCodeTableListParams) {
  const queryString = new URLSearchParams(params).toString();
  return request({
    url: `/tool/gen/list?${queryString}`, 
    data: params,
    method: 'get',
  });
}

// 查询表信息
export async function getGenCode(id?: string) {
  return request({
    url: `/tool/gen/${id}`, 
    method: 'get',
  });
}

// 查询数据表信息
export async function queryTableList(params?: any) {
  const queryString = new URLSearchParams(params).toString();
  return request({
    url: `/tool/gen/db/list?${queryString}`, 
    data: params,
    method: 'get',
  });
}

// 导入数据表信息
export async function importTables(tables?: string) {
  return request({
    url: `/tool/gen/importTable?tables=${tables}`, 
    method: 'post',
  });
}

// 删除
export async function removeData(params: { ids: string[] }) {
  return request({
    url: `/tool/gen/${params.ids}`, 
    method: 'delete',
  });
}

// 添加数据
export async function addData(params: GenCodeType) {
  return request({
    url: '/tool/gen', 
    method: 'post',
    data: {
      ...params,
    },
  });
}

// 更新数据
export async function updateData(params: GenCodeType) {
  return request({
    url: '/tool/gen', 
    method: 'put',
    data: {
      ...params,
    },
  });
}

// 更新状态
export async function syncDbInfo(tableName: string) {
  return request({
    url: `/tool/gen/synchDb/${tableName}`, 
    method: 'get',
  });
}

// 生成代码（自定义路径）
export async function genCode(tableName: string) {
  return request({
    url: `/tool/gen/genCode/${tableName}`, 
    method: 'get',
  });
}

// 生成代码（压缩包）
export async function batchGenCode(tableName: string) {
  return downLoadZip(`/tool/gen/batchGenCode?tables=${tableName}`);
}

// 预览
export async function previewCode(id: string) {
  return request({
    url: `/tool/gen/preview/${id}`, 
    method: 'get',
  });
}
