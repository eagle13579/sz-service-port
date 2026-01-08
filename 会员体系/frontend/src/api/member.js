import request from '../utils/request';

// 创建会员档案
export const createProfile = (data) => {
  return request({
    url: '/members/profile',
    method: 'post',
    data
  });
};

// 获取会员信息
export const getProfile = () => {
  return request({
    url: '/members/profile',
    method: 'get'
  });
};

// 更新会员信息
export const updateProfile = (data) => {
  return request({
    url: '/members/profile',
    method: 'put',
    data
  });
};

// 添加技能
export const addSkill = (data) => {
  return request({
    url: '/members/skills',
    method: 'post',
    data
  });
};

// 获取技能列表
export const getSkills = () => {
  return request({
    url: '/members/skills',
    method: 'get'
  });
};

// 删除技能
export const deleteSkill = (id) => {
  return request({
    url: `/members/skills/${id}`,
    method: 'delete'
  });
};

// 获取任务认领列表
export const getTaskClaims = (params) => {
  return request({
    url: '/members/task-claims',
    method: 'get',
    params
  });
};

// 获取收益统计
export const getRewardStatistics = () => {
  return request({
    url: '/members/rewards/statistics',
    method: 'get'
  });
};

// 获取回报记录
export const getRewardRecords = (params) => {
  return request({
    url: '/members/rewards',
    method: 'get',
    params
  });
};

// 获取信用评分
export const getCreditScore = () => {
  return request({
    url: '/members/credit-score',
    method: 'get'
  });
};

// 获取评价列表
export const getReviews = (params) => {
  return request({
    url: '/members/reviews',
    method: 'get',
    params
  });
};
