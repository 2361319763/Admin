import request from '@/utils/request';

// 查询部门列表
export async function getDeptList(params?: API.System.DeptListParams) {
  return request<API.System.DeptPageResult>({
    url: '/system/dept/list', 
    method: 'get',
    params,
  });
}

// 查询部门列表（排除节点）
export function getDeptListExcludeChild(deptId: number) {
  return request({
    url: `/system/dept/list/exclude/${deptId}`,
    method: 'get',
  });
}

// 查询部门详细
export function getDept(deptId: number) {
  return request<API.System.DeptInfoResult>({
    url: `/system/dept/${deptId}`, 
    method: 'get',
  });
}

// 新增部门
export async function addDept(params: API.System.Dept) {
  return request<API.Result>({
    url: '/system/dept', 
    method: 'post',
    data: params,
  });
}

// 修改部门
export async function updateDept(params: API.System.Dept) {
  return request<API.Result>({
    url: '/system/dept', 
    method: 'put',
    data: params,
  });
}

// 删除部门
export async function removeDept(ids: string) {
  return request<API.Result>({
    url: `/system/dept/${ids}`, 
    method: 'delete',
  });
}

// 导出部门
export function exportDept(params?: API.System.DeptListParams) {
  return request<API.Result>({
    url: `/system/dept/export`, 
    method: 'get',
    params,
  });
}
