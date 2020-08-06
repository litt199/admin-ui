import request from '@/utils/request'

// 查询优惠券和代金券列表
export function listCoupon(query) {
  return request({
    url: '/coupon/coupon/list',
    method: 'get',
    params: query
  })
}

// 查询优惠券和代金券详细
export function getCoupon(id) {
  return request({
    url: '/coupon/coupon/' + id,
    method: 'get'
  })
}

// 新增优惠券和代金券
export function addCoupon(data) {
  return request({
    url: '/coupon/coupon',
    method: 'post',
    data: data
  })
}

// 修改优惠券和代金券
export function updateCoupon(data) {
  return request({
    url: '/coupon/coupon',
    method: 'put',
    data: data
  })
}

// 删除优惠券和代金券
export function delCoupon(id) {
  return request({
    url: '/coupon/coupon/' + id,
    method: 'delete'
  })
}

// 导出优惠券和代金券
export function exportCoupon(query) {
  return request({
    url: '/coupon/coupon/export',
    method: 'get',
    params: query
  })
}