import request from '@/utils/request';

// 查询定时任务调度列表
export async function getJobList(params?: API.Monitor.JobListParams) {
  return request<API.Monitor.JobPageResult>({
    url: '/monitor/job/list', 
    method: 'get',
    params,
  });
}

// 查询定时任务调度详细
export function getJob(jobId: number) {
  return request<API.Monitor.JobInfoResult>({
    url: `/monitor/job/${jobId}`, 
    method: 'get',
  });
}

// 新增定时任务调度
export async function addJob(params: API.Monitor.Job) {
  return request<API.Result>({
    url: '/monitor/job', 
    method: 'post',
    data: params,
  });
}

// 修改定时任务调度
export async function updateJob(params: API.Monitor.Job) {
  return request<API.Result>({
    url: '/monitor/job', 
    method: 'put',
    data: params,
  });
}

// 删除定时任务调度
export async function removeJob(ids: string) {
  return request<API.Result>({
    url: `/monitor/job/${ids}`, 
    method: 'delete',
  });
}

// 导出定时任务调度
export function exportJob(params?: API.Monitor.JobListParams) {
  return request<API.Result>({
    url: `/monitor/job/export`, 
    method: 'get',
    params,
  });
}

// 定时任务立即执行一次
export async function runJob(jobId: number, jobGroup: string) {
  const job = {
    jobId,
    jobGroup,
  };
  return request({
    url: '/monitor/job/run', 
    method: 'put',
    data: job,
  });
}
