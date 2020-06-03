import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/dictionary/list',
    method: 'get',
    params: query
  })
}

export function fetchDicList(query) {
  return request({
    url: '/dictionaryteams/page',
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

export function createDictionary(data) {
  return request({
    url: '/dictionary/create',
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
