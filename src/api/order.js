import request from '@/utils/request'

// 查询用户充值消费记录列表
export function listOrder(query) {
  return request({
    url: '/recharge/order/list',
    method: 'get',
    params: query
  })
}

// 查询用户充值消费记录详细
export function getOrder(amountRecordId) {
  return request({
    url: '/recharge/order/' + amountRecordId,
    method: 'get'
  })
}



// 导出用户充值消费记录
export function exportOrder(query) {
  return request({
    url: '/order/order/export',
    method: 'get',
    params: query
  })
}
