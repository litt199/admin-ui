import request from '@/utils/request'

// 查询ROLL 房活动列表
export function listRoll(query) {
  return request({
    url: '/activity/roll/list',
    method: 'get',
    params: query
  })
}

// 查询ROLL 房活动详细
export function getRoll(rollId) {
  return request({
    url: '/activity/roll/' + rollId,
    method: 'get'
  })
}

// 新增ROLL 房活动
export function addRoll(data) {
  return request({
    url: '/activity/roll',
    method: 'post',
    data: data
  })
}

// 修改ROLL 房活动
export function updateRoll(data) {
  return request({
    url: '/activity/roll',
    method: 'put',
    data: data
  })
}

// 删除ROLL 房活动
export function delRoll(rollId) {
  return request({
    url: '/activity/roll/' + rollId,
    method: 'delete'
  })
}

// 导出ROLL 房活动
export function exportRoll(query) {
  return request({
    url: '/activity/roll/export',
    method: 'get',
    params: query
  })
}



// 获取roll房下面的商品
export function getRollGoods(query) {
  return request({
    url: '/activity/roll/RollInfoById',
    method: 'get',
    params: query
  })
}

// 添加商品
export function addGoods(data) {
  return request({
    url: '/activity/roll/addRollGoods',
    method: 'post',
    data:data
  })
}