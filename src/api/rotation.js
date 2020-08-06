import request from '@/utils/request'

// 查询首页轮播图列表
export function listRotation(query) {
  return request({
    url: '/obcase/rotation/list',
    method: 'get',
    params: query
  })
}

// 查询首页轮播图详细
export function getRotation(id) {
  return request({
    url: '/obcase/rotation/' + id,
    method: 'get'
  })
}

// 新增首页轮播图
export function addRotation(data) {
  return request({
    url: '/obcase/rotation',
    method: 'post',
    data: data
  })
}

// 修改首页轮播图
export function updateRotation(data) {
  return request({
    url: '/obcase/rotation',
    method: 'put',
    data: data
  })
}

// 删除首页轮播图
export function delRotation(id) {
  return request({
    url: '/obcase/rotation/' + id,
    method: 'delete'
  })
}

// 导出首页轮播图
export function exportRotation(query) {
  return request({
    url: '/obcase/rotation/export',
    method: 'get',
    params: query
  })
}