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
      // 原本的写死路径
      // let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
      // 后台请求的路径
      const menuRouters = []
      request({
        url: '/menu/list',
        method: 'get',
        roles
      }).then(res => {
        const { data } = res
        data.forEach((m, i) => {
          if (m.parent === '-1') {
            const url = '@/views/icons/index'
            m.path = '/' + m.url
            console.log(url)
            const module = {
              path: '/' + m.url,
              component: Layout,
              // meta: { id: m.menuId, title: m.menu_text, path: '/' + m.url },
              children: [
                {
                  path: 'index',
                  component: () => import('@/views/' + m.url + '/index'),
                  meta: {
                    name: 'icons',
                    icon: m.icon,
                    title: m.menuText
                  }
                }
              ]
            }
            menuRouters.push(module)
          }
        })
        // convertTree(menuRouters, data)
        console.log(333)
        console.log(menuRouters)
        commit('SET_ROUTES', menuRouters)
        resolve(menuRouters)
      })

      // 定义一个递归方法
      /* function convertTree(routers, data) {
        routers.forEach(r => {
          data.forEach((m, i) => {
            if (m.parent_id != -1 && m.parent_id === r.meta.id) {
              if (!r.children) r.children = []
              m.path = r.meta.fullPath + '/' + m.url
              const menu = {
                path: m.path,
                component: () => import('@/views' + r.meta.path + '/' + m.url),
                meta: { id: m.menuId, name:m.url,title: m.menu_text, fullPath: r.meta.path + '/' + m.url }
              }
              r.children.push(menu)
            }
          })
          if (r.children) convertTree(r.children, data)
        })
      } */
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
