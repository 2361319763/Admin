import request from '@/utils/request';

// 查询通知公告列表
export async function getNoticeList(params?: API.System.NoticeListParams) {
  return request<API.System.NoticePageResult>({
    url: '/system/notice/list', 
    method: 'get',
    params,
  });
}

// 查询通知公告详细
export function getNotice(noticeId: number) {
  return request<API.System.NoticeInfoResult>({
    url: `/system/notice/${noticeId}`, 
    method: 'get',
  });
}

// 新增通知公告
export async function addNotice(params: API.System.Notice) {
  return request<API.Result>({
    url: '/system/notice', 
    method: 'post',
    data: params,
  });
}

// 修改通知公告
export async function updateNotice(params: API.System.Notice) {
  return request<API.Result>({
    url: '/system/notice', 
    method: 'put',
    data: params,
  });
}

// 删除通知公告
export async function removeNotice(ids: string) {
  return request<API.Result>({
    url: `/system/notice/${ids}`, 
    method: 'delete',
  });
}

// 导出通知公告
export function exportNotice(params?: API.System.NoticeListParams) {
  return request<API.Result>({
    url: `/system/notice/export`, 
    method: 'get',
    params,
  });
}
