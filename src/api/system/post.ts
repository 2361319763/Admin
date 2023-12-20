import request from '@/utils/request';

// 查询岗位信息列表
export async function getPostList(params?: API.System.PostListParams) {
  return request<API.System.PostPageResult>({
    url: '/system/post/list', 
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params,
  });
}

// 查询岗位信息详细
export function getPost(postId: number) {
  return request<API.System.PostInfoResult>({
    url: `/system/post/${postId}`, 
    method: 'get',
  });
}

// 新增岗位信息
export async function addPost(params: API.System.Post) {
  return request<API.Result>({
    url: '/system/post', 
    method: 'post',
    data: params,
  });
}

// 修改岗位信息
export async function updatePost(params: API.System.Post) {
  return request<API.Result>({
    url: '/system/post', 
    method: 'put',
    data: params,
  });
}

// 删除岗位信息
export async function removePost(ids: string) {
  return request<API.Result>({
    url: `/system/post/${ids}`, 
    method: 'delete',
  });
}

// 导出岗位信息
export function exportPost(params?: API.System.PostListParams) {
  return request<API.Result>({
    url: `/system/post/export`,
    method: 'get',
    params,
  });
}
