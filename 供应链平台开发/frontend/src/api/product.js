import request from '../utils/request';

// 发布产品
export const createProduct = (data) => {
  return request({
    url: '/products',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 获取产品列表
export const getProductList = (params) => {
  return request({
    url: '/products',
    method: 'get',
    params
  });
};

// 获取我的产品列表
export const getMyProducts = (params) => {
  return request({
    url: '/products/my',
    method: 'get',
    params
  });
};

// 获取产品详情
export const getProductDetail = (id) => {
  return request({
    url: `/products/${id}`,
    method: 'get'
  });
};

// 更新产品
export const updateProduct = (id, data) => {
  return request({
    url: `/products/${id}`,
    method: 'put',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 删除产品
export const deleteProduct = (id) => {
  return request({
    url: `/products/${id}`,
    method: 'delete'
  });
};

// 审核产品
export const reviewProduct = (id, data) => {
  return request({
    url: `/products/${id}/review`,
    method: 'post',
    data
  });
};

// 获取待审核产品列表
export const getPendingReviewProducts = (params) => {
  return request({
    url: '/products/review/pending',
    method: 'get',
    params
  });
};
