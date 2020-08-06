import request from '@/utils/request'

// 查询箱子分组列表
export function listGroup(query) {
  return request({
    url: '/box/group/list',
    method: 'get',
    params: query
  })
}

// 查询箱子分组详细
export function getGroup(groupId) {
  return request({
    url: '/box/group/' + groupId,
    method: 'get'
  })
}

// 新增箱子分组
export function addGroup(data) {
  return request({
    url: '/box/group',
    method: 'post',
    data: data
  })
}

// 修改箱子分组
export function updateGroup(data) {
  return request({
    url: '/box/group',
    method: 'put',
    data: data
  })
}

// 删除箱子分组
export function delGroup(groupId) {
  return request({
    url: '/box/group/' + groupId,
    method: 'delete'
  })
}

// 导出箱子分组
export function exportGroup(query) {
  return request({
    url: '/box/group/export',
    method: 'get',
    params: query
  })
}
