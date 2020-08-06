import request from '@/utils/request'

// 查询用户背包列表
export function listUserGoods(query) {
  return request({
    url: '/goodsStatus/exchangeInfo',
    method: 'get',
    params: query
  })
}

