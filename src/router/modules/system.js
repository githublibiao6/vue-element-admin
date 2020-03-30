/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/complex-table',
  name: 'Table',
  meta: {
    title: '系统管理',
    icon: 'lock'
  },
  children: [
    {
      path: 'dynamic-table',
      component: () => import('@/views/system/dynamic-table/index'),
      name: 'DynamicTable',
      meta: { title: 'dynamicTable' }
    },
    {
      path: 'drag-table',
      component: () => import('@/views/system/drag-table'),
      name: 'DragTable',
      meta: { title: 'dragTable' }
    },
    {
      path: 'inline-edit-table',
      component: () => import('@/views/system/inline-edit-table'),
      name: 'InlineEditTable',
      meta: { title: 'inlineEditTable' }
    },
    {
      path: 'menu',
      component: () => import('@/views/system/menu'),
      name: 'ComplexTable',
      meta: { title: 'complexTable' }
    }
  ]
}
export default systemRouter
