import request from '@/utils/request'

export function getImg(id) {
  return request({
    url: '/img/getImg/' + id,
    method: 'get'
  })
}
