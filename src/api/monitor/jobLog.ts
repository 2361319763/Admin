import request from '@/utils/request';

/**
 * 定时任务调度日志 API
 *
 * @author whiteshader
 * @date 2023-02-07
 */

// 查询定时任务调度日志列表
export async function getJobLogList(params?: API.Monitor.JobLogListParams) {
  return request<API.Monitor.JobLogPageResult>({
    url: '/schedule/job/log/list', 
    method: 'get',
    params,
  });
}

// 删除定时任务调度日志
export async function removeJobLog(jobLogId: string) {
  return request<API.Result>({
    url: `/schedule/job/log/${jobLogId}`, 
    method: 'delete',
  });
}

// 清空调度日志
export function cleanJobLog() {
  return request({
    url: '/schedule/job/log/clean', 
    method: 'delete',
  });
}

// 导出定时任务调度日志
export function exportJobLog(params?: API.Monitor.JobLogListParams) {
  return request<API.Result>({
    url: `/schedule/job/log/export`, 
    method: 'get',
    params,
  });
}
