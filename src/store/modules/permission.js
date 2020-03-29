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
        const _import = require('@/router/_import_production')
        data.forEach((m, i) => {
          if (m.parent === '-1') {
            const module = {
              path: '/' + m.url,
              component: Layout,
              name: m.menuText,
              alwaysShow: true,
              meta: {
                title: m.menuText,
                id: m.menuId,
                icon: m.icon
              },
              children: [
                {
                  path: m.path,
                  component: _import(m.url),
                  name: 'icons',
                  meta: {
                    id: m.menuId,
                    icon: m.icon,
                    title: m.menuText
                  }
                }
              ]
            }
            menuRouters.push(module)
          }
        })
        convertTree(menuRouters, data)
        commit('SET_ROUTES', menuRouters)
        resolve(menuRouters)
      })

      // 定义一个递归方法
      function convertTree(routers, data) {
        const _import = require('@/router/_import_production')
        routers.forEach(r => {
          var flag = true
          const child = r.children
          r.children = []
          data.forEach((m, i) => {
            if (m.parent !== '-1' && m.parent === r.meta.id) {
              flag = false
              if (!r.children) {
                r.children = []
              }
              const menu = {
                path: m.path,
                name: m.menuText,
                component: _import(m.url),
                meta: {
                  id: m.menuId,
                  name: m.url,
                  title: m.menuText,
                  icon: m.icon
                }
              }
              r.children.push(menu)
            }
          })
          if (flag) {
            r.children = child
          }
          // if(r.children){
          // 	convertTree(r.children, data)
          // } eles {
          // 	r.alwaysShow = true
          // }
          // if (r.children)
        })
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
