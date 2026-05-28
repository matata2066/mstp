<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      :trigger="null"
      theme="dark"
      width="220"
    >
      <div class="sider-logo">
        <span v-if="!collapsed" class="logo-text">MSTP</span>
        <span v-else class="logo-text">M</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        theme="dark"
        mode="inline"
      >
        <a-menu-item key="/dashboard">
          <template #icon><DashboardOutlined /></template>
          <router-link to="/dashboard">总览</router-link>
        </a-menu-item>
        <a-sub-menu key="mapping">
          <template #icon><ApartmentOutlined /></template>
          <template #title>映射管理</template>
          <a-menu-item key="/mapping/account">
            <router-link to="/mapping/account">账号映射</router-link>
          </a-menu-item>
          <a-menu-item key="/mapping/bank">
            <router-link to="/mapping/bank">行号映射</router-link>
          </a-menu-item>
          <a-menu-item key="/mapping/remark">
            <router-link to="/mapping/remark">附言映射</router-link>
          </a-menu-item>
          <a-menu-item key="/mapping/payer">
            <router-link to="/mapping/payer">付款配置</router-link>
          </a-menu-item>
          <a-menu-item key="/approval">
            <router-link to="/approval">审批查询</router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="transaction">
          <template #icon><TransactionOutlined /></template>
          <template #title>交易查询</template>
          <a-menu-item key="/transaction/payment">
            <router-link to="/transaction/payment">支付指令</router-link>
          </a-menu-item>
          <a-menu-item key="/transaction/maintenance">
            <router-link to="/transaction/maintenance">维护记录</router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="main-header">
        <div class="header-left">
          <component
            :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined"
            class="trigger-icon"
            @click="collapsed = !collapsed"
          />
        </div>
        <div class="header-right">
          <a-dropdown>
            <span class="user-info">
              <UserOutlined />
              <span class="user-name">Admin</span>
            </span>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile">个人设置</a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout">退出登录</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="main-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  DashboardOutlined,
  ApartmentOutlined,
  TransactionOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const collapsed = ref(false)
const selectedKeys = ref(['/dashboard'])
const openKeys = ref(['mapping'])

watch(
  () => router.currentRoute.value.path,
  (path) => {
    selectedKeys.value = [path]
    if (path.startsWith('/mapping') || path === '/approval') {
      openKeys.value = ['mapping']
    } else if (path.startsWith('/transaction')) {
      openKeys.value = ['transaction']
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.sider-logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
}

.logo-text {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 2px;
}

.main-header {
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.trigger-icon {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger-icon:hover {
  color: #1890ff;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-size: 14px;
}

.main-content {
  margin: 24px;
  min-height: 280px;
}
</style>
