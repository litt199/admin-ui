import request from '@/utils/request'

// 查询每日免费新商品列表
export function listPrize(query) {
  return request({
    url: '/prize/list',
    method: 'get',
    params: query
  })
}

// 查询每日免费新商品详细
export function getPrize(id) {
  return request({
    url: '/prize/' + id,
    method: 'get'
  })
}

// 新增每日免费新商品
export function addPrize(data) {
  return request({
    url: '/prize/saveGoods',
    method: 'post',
    data: data
  })
}

// 修改每日免费新商品
export function updatePrize(data) {
  return request({
    url: '/prize',
    method: 'put',
    data: data
  })
}

// 删除每日免费新商品
export function delPrize(id) {
  return request({
    url: '/prize/' + id,
    method: 'delete'
  })
}

// 导出每日免费新商品
export function exportPrize(query) {
  return request({
    url: '/prize/export',
    method: 'get',
    params: query
  })
}

//设置奖金
export function setPrizeMoney(data) {
  return request({
    url: '/prize/saveMoney',
    method: 'post',
    data: data
  })
}

//设置概率
export function setProprit(data) {
  return request({
    url: '/prize/savePro',
    method: 'post',
    data: data
  })
}


