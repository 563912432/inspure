import request from '@/utils/request'

/* 模块自定义 */
export function fetchBuyList() {
  return request({
    url: '/dashboard/listBuy',
    method: 'get'
  })
}

