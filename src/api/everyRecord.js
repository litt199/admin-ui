import request from '@/utils/request'

// 查询每日免费参与记录列表
export function listRecord(query) {
  return request({
    url: '/record/list',
    method: 'get',
    params: query
  })
}

// 查询每日免费参与记录详细
export function getRecord(id) {
  return request({
    url: '/record/' + id,
    method: 'get'
  })
}

// 新增每日免费参与记录
export function addRecord(data) {
  return request({
    url: '/record',
    method: 'post',
    data: data
  })
}

// 修改每日免费参与记录
export function updateRecord(data) {
  return request({
    url: '/obcase/record',
    method: 'put',
    data: data
  })
}

// 删除每日免费参与记录
export function delRecord(id) {
  return request({
    url: '/record/' + id,
    method: 'delete'
  })
}

// 导出每日免费参与记录
export function exportRecord(query) {
  return request({
    url: '/record/export',
    method: 'get',
    params: query
  })
}
