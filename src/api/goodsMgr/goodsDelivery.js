import request from '@/utils/request'

// 查询待发货列表
export function listGoodsDelivery(query) {
  return request({
    url: '/goodsMgr/goodsDelivery/list',
    method: 'get',
    params: query
  })
}

// 查询待发货详细
export function getGoodsDelivery(id) {
  return request({
    url: '/goodsMgr/goodsDelivery/' + id,
    method: 'get'
  })
}

// 新增待发货
export function addGoodsDelivery(data) {
  return request({
    url: '/goodsMgr/goodsDelivery',
    method: 'post',
    data: data
  })
}

// 修改待发货
export function updateGoodsDelivery(data) {
  return request({
    url: '/goodsMgr/goodsDelivery',
    method: 'put',
    data: data
  })
}

// 删除待发货
export function delGoodsDelivery(id) {
  return request({
    url: '/goodsMgr/goodsDelivery/' + id,
    method: 'delete'
  })
}

// 导出待发货
export function exportGoodsDelivery(query) {
  return request({
    url: '/goodsMgr/goodsDelivery/export',
    method: 'get',
    params: query
  })
}