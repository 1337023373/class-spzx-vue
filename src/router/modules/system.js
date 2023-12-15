// 导入组件
const Layout = () => import('@/layout/index.vue')
const sysRole = () => import('@/views/system/sysRole.vue')
const sysUser = () => import('@/views/system/sysUser.vue')
const sysMenu = () => import('@/views/system/sysMenu.vue')
const operLog = () => import('@/views/system/sysOperLog.vue')

// 导出该组件
export default [
  {
    path: '/system',
    component: Layout,
    name: 'system',
    meta: {
      title: '系统管理',
    },
    icon: 'Location',
    children: [
      {
        path: '/sysRole',
        name: 'sysRole',
        component: sysRole,
        meta: {
          title: '角色管理',
        },
        hidden: false,
      },
      {
        path: '/sysUser',
        name: 'sysUser',
        component: sysUser,
        meta: {
          title: '用户管理',
        },
        hidden: false,
      },
      {
        path: '/menu',
        name: 'sysMenu',
        component: sysMenu,
        meta: {
          title: '菜单管理',
        },
        hidden: false,
      },
      {
        path: '/operLog',
        name: 'operLog',
        component: operLog,
        meta: {
          title: '操作日志',
        },
        hidden: false,
      },
    ],
  },
]
