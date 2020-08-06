import request from '@/utils/request'

// 查询箱子盈利列表
export function listProfit(query) {
  return request({
    url: '/box/profit/list',
    method: 'get',
    params: query
  })
}

// 查询箱子盈利详细
export function getProfit(id) {
  return request({
    url: '/box/profit/' + id,
    method: 'get'
  })
}

// 新增箱子盈利
export function addProfit(data) {
  return request({
    url: '/box/profit',
    method: 'post',
    data: data
  })
}

// 修改箱子盈利
export function updateProfit(data) {
  return request({
    url: '/box/profit',
    method: 'put',
    data: data
  })
}

// 删除箱子盈利
export function delProfit(id) {
  return request({
    url: '/box/profit/' + id,
    method: 'delete'
  })
}

// 导出箱子盈利
export function exportProfit(query) {
  return request({
    url: '/box/profit/export',
    method: 'get',
    params: query
  })
}
