import request from '@/utils/request'


//查询用户开箱信息
export function getUserOpenPage(query){
  return request({
    url: '/userGoods/openBoxRecordPage',
    method: 'get',
    params: query
  })
}


// 查询用户列表
export function listUser(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/user/' + userId,
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/user/' + userId,
    method: 'delete'
  })
}

// 导出用户
export function exportUser(query) {
  return request({
    url: '/user/export',
    method: 'get',
    params: query
  })
}

//查看包裹
export function getPackage(query) {
  return request({
    url: '/userGoods/getPackagesData',
    method: 'get',
    params: query
  })
}

//修改金额
export function editMoney(data) {
  return request({
    url: '/user/updateMoney',
    method: 'post',
    data: data
  })
}

//启用禁用用户
export function enableUse(data) {
  return request({
    url: '/user/enableUser',
    method: 'post',
    data: data
  })
}

//查看优惠券
export function getCound(query) {
  return request({
    url: '/coupon/info',
    method: 'get',
    params: query
  })
}