import request from '@/utils/request';
import { DataNode } from 'antd/es/tree';
import { formatTreeData } from '@/utils/tree';

// 查询用户信息列表
export async function getUserList(params?: API.System.UserListParams) {
  return request<API.System.UserPageResult>({
    url: '/system/user/list',
    method: 'get',
    params
  });
}

// 查询用户信息详细
export function getUser(userId: number) {
  return request<API.System.UserInfoResult>({
    url: `/system/user/${userId}`,
    method: 'get'
  });
}

// 新增用户信息
export async function addUser(params: API.System.User) {
  return request<API.Result>({
    url: '/system/user',
    method: 'post',
    data: params
  });
}

// 修改用户信息
export async function updateUser(params: API.System.User) {
  return request<API.Result>({
    url: '/system/user',
    method: 'put',
    data: params
  });
}

// 删除用户信息
export async function removeUser(ids: string) {
  return request<API.Result>({
    url: `/system/user/${ids}`,
    method: 'delete'
  });
}

// 导出用户信息
export function exportUser(params?: API.System.UserListParams) {
  return request<API.Result>({
    url: `/system/user/export`,
    method: 'get',
    params
  });
}

// 用户状态修改
export function changeUserStatus(userId: number, status: string) {
  const data = {
    userId,
    status,
  };
  return request<API.Result>({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data,
  });
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get',
  });
}

export function updateUserProfile(data: API.CurrentUser) {
  return request<API.Result>({
    url: '/system/user/profile',
    method: 'put',
    data: data,
  });
}

// 用户密码重置
export function resetUserPwd(userId: number, password: string) {
  const data = {
    userId,
    password,
  };
  return request<API.Result>({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data,
  });
}

// 用户t个人密码重置
export function updateUserPwd(oldPassword: string, newPassword: string) {
  const data = {
    oldPassword,
    newPassword,
  };
  return request<API.Result>({
    url: '/system/user/profile/updatePwd', 
    method: 'put',
    params: data,
  });
}

// 用户头像上传
export function uploadAvatar(data: any) {
  return request({
    url: '/system/user/profile/avatar', 
    method: 'post',
    data: data,
  });
}

// 查询授权角色
export function getAuthRole(userId: number) {
  return request({
    url: '/system/user/authRole/' + userId, 
    method: 'get',
  });
}

// 保存授权角色
export function updateAuthRole(data: Record<string, any>) {
  return request({
    url: '/system/user/authRole', 
    method: 'put',
    params: data,
  });
}

// 获取数据列表
export function getDeptTree(params: any): Promise<DataNode[]> {
  return new Promise((resolve) => {
    request({
      url: `/system/user/deptTree`, 
      method: 'get',
      params,
    }).then((res: any) => {
      if (res && res.code === 200) {
        const treeData = formatTreeData(res.data);
        resolve(treeData);
      } else {
        resolve([]);
      }
    });
  });
}
