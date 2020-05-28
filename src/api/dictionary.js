import request from '@/utils/request'

export function fetchList(query) {
  console.log(222)
  console.log(query)
  return request({
    url: '/dictionary/page',
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

export function deleteMenu(data) {
  return request({
    url: '/menu/delete',
    method: 'delete',
    data
  })
}
