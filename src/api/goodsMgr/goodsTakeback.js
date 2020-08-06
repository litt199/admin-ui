import request from '@/utils/request'

// 查询取回列表
export function listGoodsTakeback(query) {
  return request({
    url: '/goodsMgr/goodsTakeback/list',
    method: 'get',
    params: query
  })
}

// 查询取回详细
export function getGoodsTakeback(id) {
  return request({
    url: '/goodsMgr/goodsTakeback/' + id,
    method: 'get'
  })
}

// 新增取回
export function addGoodsTakeback(data) {
  return request({
    url: '/goodsMgr/goodsTakeback',
    method: 'post',
    data: data
  })
}

// 修改取回
export function updateGoodsTakeback(data) {
  return request({
    url: '/goodsMgr/goodsTakeback',
    method: 'put',
    data: data
  })
}

// 删除取回
export function delGoodsTakeback(id) {
  return request({
    url: '/goodsMgr/goodsTakeback/' + id,
    method: 'delete'
  })
}

// 导出取回
export function exportGoodsTakeback(query) {
  return request({
    url: '/goodsMgr/goodsTakeback/export',
    method: 'get',
    params: query
  })
}