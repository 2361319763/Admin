import request from '@/utils/request';

// 查询菜单权限列表
export async function getMenuList(
  params?: API.System.MenuListParams,
) {
  return request<API.System.MenuPageResult>({
    url: '/system/menu/list', 
    method: 'get',
    params,
  });
}

// 查询菜单权限详细
export function getMenu(menuId: number) {
  return request<API.System.MenuInfoResult>({
    url: `/system/menu/${menuId}`,
    method: 'get'
  });
}

// 新增菜单权限
export async function addMenu(
  params: API.System.Menu,
) {
  return request<API.Result>({
    url: '/system/menu', 
    method: 'post',
    data: params,
  });
}

// 修改菜单权限
export async function updateMenu(
  params: API.System.Menu,
) {
  return request<API.Result>({
    url: '/system/menu', 
    method: 'put',
    data: params,
  });
}

// 删除菜单权限
export async function removeMenu(
  ids: string,
) {
  return request<API.Result>({
    url: `/system/menu/${ids}`, 
    method: 'deletet',
  });
}

// 导出菜单权限
export function exportMenu(
  params?: API.System.MenuListParams,
) {
  return request<API.Result>({
    url: `/system/menu/export`,
    method: 'get',
    params,
  });
}

// 查询菜单权限详细
export function getMenuTree() {
  return request({
    url: '/system/menu/treeselect',
    method: 'get',
  });
}
