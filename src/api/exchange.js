import request from '@/utils/request'

// 查询兑换商品列表
export function listExchange(query) {
  return request({
    url: '/obcase/exchange/list',
    method: 'get',
    params: query
  })
}

// 查询兑换商品详细
export function getExchange(id) {
  return request({
    url: '/obcase/exchange/' + id,
    method: 'get'
  })
}

// 新增兑换商品
export function addExchange(data) {
  return request({
    url: '/obcase/exchange',
    method: 'post',
    data: data
  })
}

// 修改兑换商品
export function updateExchange(data) {
  return request({
    url: '/obcase/exchange',
    method: 'put',
    data: data
  })
}

// 删除兑换商品
export function delExchange(id) {
  return request({
    url: '/obcase/exchange/' + id,
    method: 'delete'
  })
}

// 导出兑换商品
export function exportExchange(query) {
  return request({
    url: '/obcase/exchange/export',
    method: 'get',
    params: query
  })
}