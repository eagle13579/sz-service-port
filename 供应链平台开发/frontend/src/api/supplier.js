import request from '../utils/request';

// 提交供应商入驻申请
export const registerSupplier = (data) => {
  return request({
    url: '/suppliers/register',
    method: 'post',
    data
  });
};

// 获取供应商信息
export const getSupplierInfo = () => {
  return request({
    url: '/suppliers/info',
    method: 'get'
  });
};

// 更新供应商信息
export const updateSupplierInfo = (data) => {
  return request({
    url: '/suppliers/info',
    method: 'put',
    data
  });
};

// 获取供应商列表
export const getSupplierList = (params) => {
  return request({
    url: '/suppliers/list',
    method: 'get',
    params
  });
};

// 获取供应商详情
export const getSupplierDetail = (id) => {
  return request({
    url: `/suppliers/${id}`,
    method: 'get'
  });
};

// 审核供应商
export const reviewSupplier = (id, data) => {
  return request({
    url: `/suppliers/${id}/review`,
    method: 'post',
    data
  });
};

// 设置供应商等级
export const setSupplierLevel = (id, data) => {
  return request({
    url: `/suppliers/${id}/level`,
    method: 'put',
    data
  });
};
