import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/menu/page',
    method: 'get',
    params: query
  })
}

export function fetchMenu(id) {
  return request({
    url: '/menu/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/menu/pv',
    method: 'get',
    params: { pv }
  })
}

export function createMenu(data) {
  return request({
    url: '/menu/create',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: '/menu/update',
    method: 'post',
    data
  })
}
