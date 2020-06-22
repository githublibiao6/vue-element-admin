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
    url: '/dictionary/add',
    method: 'post',
    data
  })
}

export function createTeam(data) {
  return request({
    url: '/dictionaryteams/add',
    method: 'post',
    data
  })
}

export function updateDictionary(data) {
  return request({
    url: '/dictionary/update',
    method: 'post',
    data
  })
}

export function updateTeam(data) {
  return request({
    url: '/dictionaryteams/update',
    method: 'post',
    data
  })
}

export function removeDictionary(data) {
  return request({
    url: '/dictionary/remove',
    method: 'delete',
    data
  })
}

export function removeTeam(data) {
  return request({
    url: '/dictionaryteams/delete',
    method: 'delete',
    data
  })
}
