import request from '../utils/request';

// 申请提现
export const withdraw = (data) => {
  return request({
    url: '/rewards/withdraw',
    method: 'post',
    data
  });
};
