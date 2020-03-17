import { asyncRoutes, constantRoutes } from '@/router'
import request from '@/utils/request'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      // 根据角色查询路径
      console.log(roles)
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  index({ commit }, roles) {
    return new Promise(resolve => {
      /* let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }*/
      let menuRouters
      request({
        url: '/menu/list',
        method: 'get',
        roles
      }).then(res => {
        const { data } = res
        console.log(data)
        data.forEach((m, i) => {
          if (m.parent != null) {
            m.path = '/' + m.url
            const module = {
              path: '/' + m.path,
              component: Layout,
              meta: { id: m.menuId, title: m.title, fullPath: '/' + m.path },
              children: [
                {
                  path: '',
                  component: () => import('@/views/' + m.path + '/index'),
                  meta: {
                    menuHide: true,
                    title: m.title
                  }
                }
              ]
            }
            menuRouters.push(module)
          }
          menuRouters
        })
      })
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
      commit('SET_ROUTES', menuRouters)
      resolve(menuRouters)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
