import request from '@/utils/request'


// 查询首页数据列表
export function getHomeIndex(query) {
    return request({
      url: '/home/index',
      method: 'get',
    })
  }