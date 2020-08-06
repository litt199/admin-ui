import request from '@/utils/request'

// 查询支付接口列表
export function listMerchant(query) {
  return request({
    url: '/recharge/merchant/list',
    method: 'get',
    params: query
  })
}

// 查询支付接口详细
export function getMerchant(id) {
  return request({
    url: '/recharge/merchant/' + id,
    method: 'get'
  })
}

// 新增支付接口
export function addMerchant(data) {
  return request({
    url: '/recharge/merchant',
    method: 'post',
    data: data
  })
}

// 修改支付接口
export function updateMerchant(data) {
  return request({
    url: '/recharge/merchant',
    method: 'put',
    data: data
  })
}

// 删除支付接口
export function delMerchant(id) {
  return request({
    url: '/recharge/merchant/' + id,
    method: 'delete'
  })
}

// 导出支付接口
export function exportMerchant(query) {
  return request({
    url: '/recharge/merchant/export',
    method: 'get',
    params: query
  })
}
