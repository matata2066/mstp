import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '总览' },
      },
      {
        path: 'mapping/account',
        name: 'AccountMapping',
        component: () => import('@/views/AccountMapping.vue'),
        meta: { title: '账号映射' },
      },
      {
        path: 'mapping/bank',
        name: 'BankMapping',
        component: () => import('@/views/BankMapping.vue'),
        meta: { title: '行号映射' },
      },
      {
        path: 'mapping/remark',
        name: 'RemarkMapping',
        component: () => import('@/views/RemarkMapping.vue'),
        meta: { title: '附言映射' },
      },
      {
        path: 'mapping/payer',
        name: 'PayerConfig',
        component: () => import('@/views/PayerConfig.vue'),
        meta: { title: '付款配置' },
      },
      {
        path: 'approval',
        name: 'ApprovalPending',
        component: () => import('@/views/ApprovalPending.vue'),
        meta: { title: '审批查询' },
      },
      {
        path: 'transaction/payment',
        name: 'PaymentQuery',
        component: () => import('@/views/PaymentQuery.vue'),
        meta: { title: '支付指令' },
      },
      {
        path: 'transaction/maintenance',
        name: 'MaintenanceLog',
        component: () => import('@/views/MaintenanceLog.vue'),
        meta: { title: '维护记录' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
