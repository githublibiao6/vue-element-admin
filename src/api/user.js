import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/page',
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/user/delete',
    method: 'delete',
    data
  })
}

export function login(data) {
  return request({
    url: '/system/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/system/logout',
    method: 'post'
  })
}
