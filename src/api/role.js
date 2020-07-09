import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: 'menu/listMap',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: 'roles/list',
    method: 'get'
  })
}

export function getMenuByRoleId(role_id) {
  return request({
    url: 'roles/listMenusByRoleId',
    method: 'get',
    params: { role_id }
  })
}

export function addRole(data) {
  return request({
    url: '/roles/add',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/roles/update`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/roles/delete`,
    method: 'delete',
    params: { id }
  })
}
