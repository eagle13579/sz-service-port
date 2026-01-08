import request from '../utils/request';

// 获取任务列表
export const getTasks = (params) => {
  return request({
    url: '/tasks',
    method: 'get',
    params
  });
};

// 获取任务详情
export const getTaskDetail = (id) => {
  return request({
    url: `/tasks/${id}`,
    method: 'get'
  });
};

// 认领任务
export const claimTask = (id, data) => {
  return request({
    url: `/tasks/${id}/claim`,
    method: 'post',
    data
  });
};

// 更新任务进度
export const updateProgress = (id, data) => {
  return request({
    url: `/tasks/claims/${id}/progress`,
    method: 'put',
    data
  });
};

// 提交交付物
export const submitDelivery = (id, data) => {
  return request({
    url: `/tasks/claims/${id}/deliver`,
    method: 'post',
    data
  });
};
