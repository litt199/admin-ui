import request from '@/utils/request'

// 查询箱子列表
export function listBox(query) {
  return request({
    url: '/box/boxes/list',
    method: 'get',
    params: query
  })
}

// 查询箱子详细
export function getBox(boxId) {
  return request({
    url: '/box/boxes/' + boxId,
    method: 'get'
  })
}

// 新增箱子
export function addBox(data) {
  return request({
    url: '/box/boxes',
    method: 'post',
    data: data
  })
}

// 修改箱子
export function updateBox(data) {
  return request({
    url: '/box/boxes',
    method: 'put',
    data: data
  })
}

// 删除箱子
export function delBox(boxId) {
  return request({
    url: '/box/boxes/' + boxId,
    method: 'delete'
  })
}

// 导出箱子
export function exportBox(query) {
  return request({
    url: '/box/boxes/export',
    method: 'get',
    params: query
  })
}
// 添加商品
export function addGoods(data) {
  return request({
    url: '/box/boxes/saveOrUpdate',
    method: 'post',
    data:data
  })
}

// 获取箱子下的商品
export function getBoxGoods(query) {
  return request({
    url: '/box/boxes/edit/'+query,
    method: 'get',
  })
}
