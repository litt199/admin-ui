import request from '@/utils/request'

// 查询公告列表
export function listNotice(query) {
  return request({
    url: '/obcase/notice/list',
    method: 'get',
    params: query
  })
}

// 查询公告详细
export function getNotice(id) {
  return request({
    url: '/obcase/notice/' + id,
    method: 'get'
  })
}

// 新增公告
export function addNotice(data) {
  return request({
    url: '/obcase/notice',
    method: 'post',
    data: data
  })
}

// 修改公告
export function updateNotice(data) {
  return request({
    url: '/obcase/notice',
    method: 'put',
    data: data
  })
}

// 删除公告
export function delNotice(id) {
  return request({
    url: '/obcase/notice/' + id,
    method: 'delete'
  })
}

// 导出公告
export function exportNotice(query) {
  return request({
    url: '/obcase/notice/export',
    method: 'get',
    params: query
  })
}