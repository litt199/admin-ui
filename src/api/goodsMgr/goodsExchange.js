import request from '@/utils/request'

//兑换商品
export function goodsDeliverGoods(data) {
  return request({
    url: '/goodsStatus/deliverGoods',
    method: 'post',
    data: data
  })
}

// 查询兑换列表
export function listGoodsExchange(query) {
  return request({
    url: '/goodsMgr/goodsExchange/list',
    method: 'get',
    params: query
  })
}

// 查询兑换详细
export function getGoodsExchange(id) {
  return request({
    url: '/goodsMgr/goodsExchange/' + id,
    method: 'get'
  })
}

// 新增兑换
export function addGoodsExchange(data) {
  return request({
    url: '/goodsMgr/goodsExchange',
    method: 'post',
    data: data
  })
}

// 修改兑换
export function updateGoodsExchange(data) {
  return request({
    url: '/goodsMgr/goodsExchange',
    method: 'put',
    data: data
  })
}

// 删除兑换
export function delGoodsExchange(id) {
  return request({
    url: '/goodsMgr/goodsExchange/' + id,
    method: 'delete'
  })
}

// 导出兑换
export function exportGoodsExchange(query) {
  return request({
    url: '/goodsMgr/goodsExchange/export',
    method: 'get',
    params: query
  })
}