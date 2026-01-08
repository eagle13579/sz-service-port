import request from '../utils/request';

// 发布任务
export const createTask = (data) => {
  return request({
    url: '/tasks',
    method: 'post',
    data
  });
};

// 获取任务列表
export const getTaskList = (params) => {
  return request({
    url: '/tasks',
    method: 'get',
    params
  });
};

// 获取我的任务列表
export const getMyTasks = (params) => {
  return request({
    url: '/tasks/my',
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

// 更新任务
export const updateTask = (id, data) => {
  return request({
    url: `/tasks/${id}`,
    method: 'put',
    data
  });
};

// 删除任务
export const deleteTask = (id) => {
  return request({
    url: `/tasks/${id}`,
    method: 'delete'
  });
};

// 取消任务
export const cancelTask = (id) => {
  return request({
    url: `/tasks/${id}/cancel`,
    method: 'post'
  });
};

// 认领任务
export const claimTask = (id) => {
  return request({
    url: `/tasks/${id}/claim`,
    method: 'post'
  });
};

// 完成任务
export const completeTask = (id) => {
  return request({
    url: `/tasks/${id}/complete`,
    method: 'post'
  });
};

// 获取我认领的任务
export const getClaimedTasks = (params) => {
  return request({
    url: '/tasks/claimed/my',
    method: 'get',
    params
  });
};
