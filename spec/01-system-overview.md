# MSTP - 多渠道支付中间平台 系统概述与架构设计

## 1. 系统定位

MSTP（Multi-channel Settlement & Transfer Platform）是一个银行支付中间层平台，位于上游业务系统与下游支付结算系统之间，承担消息接收、要素补齐、支付指令组装与下发、状态跟踪等核心职责。

### 1.1 系统目标

- 接收上游 Solace 消息，解析并提取关键交易要素
- 基于本地映射表补齐完整支付指令要素
- 向下游支付系统发送支付指令并跟踪处理状态
- 提供映射关系维护功能，支持 Maker/Checker 审批流程
- 提供支付指令查询与状态跟踪功能
- 满足银行企业级安全、审计与合规要求

### 1.2 系统边界

```
┌──────────────────────────────────────────────────────────────────┐
│                        上游业务系统                               │
│                    (Solace Message Provider)                      │
└──────────────────────────┬───────────────────────────────────────┘
                           │ Solace JMS
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                       MSTP 中间平台                               │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐             │
│  │ 消息接收引擎  │  │  要素补齐引擎 │  │  支付指令引擎  │             │
│  └─────────────┘  └─────────────┘  └──────────────┘             │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐             │
│  │ 映射管理模块  │  │  状态跟踪引擎 │  │  审批流程引擎  │             │
│  └─────────────┘  └─────────────┘  └──────────────┘             │
│                                                                  │
│  ┌─────────────────────────────────────────────────┐             │
│  │              Web 管理控制台 (UX)                  │             │
│  └─────────────────────────────────────────────────┘             │
│                                                                  │
└──────────────────────────┬───────────────────────────────────────┘
                           │ RESTful API (HTTPS)
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                     下游支付结算系统                               │
│              (Payment Settlement System)                          │
└──────────────────────────────────────────────────────────────────┘
```

## 2. 系统架构

### 2.1 整体架构分层

| 层次 | 组件 | 职责 |
|------|------|------|
| 接入层 | Solace Listener | 监听上游消息队列，接收并解析消息 |
| 接入层 | Web Controller | 提供 REST API 供管理控制台调用 |
| 业务层 | Message Parser | 解析 Solace 消息，提取交易要素 |
| 业务层 | Enrichment Engine | 基于映射表补齐交易要素 |
| 业务层 | Payment Engine | 组装支付指令，调用下游 API |
| 业务层 | Status Tracker | 轮询支付状态，跟踪交易生命周期 |
| 业务层 | Approval Engine | Maker/Checker 审批流程控制 |
| 集成层 | Downstream Client | 封装下游 REST API 调用 |
| 集成层 | Auth Adapter | 身份认证适配器（SSO 对接） |
| 集成层 | RBAC Adapter | 权限管理适配器（企业权限系统对接） |
| 数据层 | Repository | 数据持久化访问（Oracle） |

### 2.2 技术选型原则

| 维度 | 选型方向 | 说明 |
|------|----------|------|
| 后端框架 | Spring Boot 3.x | 企业级 Java 框架，生态成熟 |
| 消息中间件 | Solace JMS/API | 与上游系统对接 |
| 数据库 | Oracle 19c+ | 满足银行合规与性能要求 |
| 前端框架 | React + Ant Design Pro | 企业级中后台 UI 方案 |
| 安全框架 | Spring Security + SPI | 保留 SSO/RBAC 外部接口 |
| 日志框架 | SLF4J + Logback | 分级日志，结构化输出 |
| API 文档 | OpenAPI 3.0 (Swagger) | 接口文档自动生成 |

### 2.3 部署架构

```
                    ┌─────────────┐
                    │  Load Balancer │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ MSTP-App │ │ MSTP-App │ │ MSTP-App │
        │  Node 1  │ │  Node 2  │ │  Node 3  │
        └────┬─────┘ └────┬─────┘ └────┬─────┘
             │             │             │
             └──────┬──────┘─────────────┘
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
    ┌──────────┐         ┌────────┐
    │  Oracle  │         │ Solace │
    │   RAC    │         │  HA    │
    └──────────┘         └────────┘
```

- 应用层多节点部署，无状态设计，支持水平扩展
- Oracle RAC 部署保证数据库高可用
- Solace HA 保证消息不丢失

## 3. 核心业务流程

### 3.1 支付指令处理主流程

```
上游Solace消息
      │
      ▼
[消息接收] ──→ 解析消息头/体
      │
      ▼
[要素提取] ──→ 收款账号、金额、渠道、收款行行号
      │
      ▼
[要素补齐] ──→ 查询映射表
      │           ├─ 收款账号 → 收款账户名称
      │           ├─ 收款行行号 → 收款行名称
      │           └─ 渠道 → 付款账号/付款行信息
      │
      ▼
[指令组装] ──→ 组装完整支付指令
      │
      ▼
[支付发送] ──→ 调用下游支付API
      │
      ▼
[状态跟踪] ──→ 根据渠道跟踪状态
      │
      ├─ CNAPS: GCMS → Validating → Sending → CitiFT Pending → CitiFT Succ → LCP Pending → LCP Cleared
      │
      └─ CIPS:  GCMS → Validating → Sending → CitiFT Pending → CitiFT Succ → CIPS Pending → CIPS Cleared
      │
      │   Validating 校验失败时进入 VALIDATING_FAILED，支持重试回到 Validating
      │   每个 Pending 状态 20 分钟超时自动跳转至 Pending (timeout)
      │
      ▼
[交易完成/超时] ──→ 更新最终状态
```

### 3.2 异常处理策略

| 异常场景 | 处理策略 |
|----------|----------|
| Solace 消息解析失败 | 记录原始消息至异常表，告警通知，消息进入死信队列 |
| 要素校验失败 | 交易状态进入 VALIDATING_FAILED，用户可在 UI 点击重试，重新从 Validating 开始校验 |
| 映射表查找失败 | 交易挂起，标记为 VALIDATING_FAILED，通知运维补录映射数据后可重试 |
| 下游 API 调用超时 | 重试（指数退避，最多3次），超过重试次数标记为 SEND_FAILED |
| Pending 状态超时 | 20分钟未获得下一步状态，自动跳转至 Pending (timeout)，需人工介入 |

## 4. 系统模块划分

### 4.1 后端模块

```
mstp/
├── mstp-common/              # 公共模块：工具类、常量、异常定义
├── mstp-model/               # 数据模型：实体、DTO、VO
├── mstp-repository/          # 数据访问层：Repository、Mapper
├── mstp-service/             # 业务逻辑层
│   ├── mstp-service-message/     # 消息接收与解析
│   ├── mstp-service-enrichment/  # 要素补齐
│   ├── mstp-service-payment/     # 支付指令处理
│   ├── mstp-service-mapping/     # 映射关系管理
│   └── mstp-service-approval/    # 审批流程
├── mstp-integration/         # 外部集成层
│   ├── mstp-integration-solace/  # Solace 集成
│   ├── mstp-integration-payment/ # 下游支付 API 客户端
│   ├── mstp-integration-auth/    # 认证适配器
│   └── mstp-integration-rbac/    # 权限适配器
├── mstp-web/                 # Web 层：Controller、拦截器
└── mstp-admin/               # 管理后台前端
```

### 4.2 模块依赖关系

```
mstp-web
  ├── mstp-service-message
  ├── mstp-service-enrichment
  ├── mstp-service-payment
  ├── mstp-service-mapping
  ├── mstp-service-approval
  └── mstp-common

mstp-service-message
  ├── mstp-integration-solace
  ├── mstp-service-enrichment
  └── mstp-common

mstp-service-enrichment
  ├── mstp-service-mapping
  ├── mstp-repository
  └── mstp-common

mstp-service-payment
  ├── mstp-integration-payment
  ├── mstp-repository
  └── mstp-common

mstp-service-mapping
  ├── mstp-service-approval
  ├── mstp-repository
  └── mstp-common

mstp-service-approval
  ├── mstp-repository
  └── mstp-common
```

## 5. 关键设计决策

### 5.1 消息可靠性保证

- Solace 消息采用 CLIENT_ACKNOWLEDGE 模式，业务处理成功后才确认
- 消息处理失败进入重试队列，超过重试次数进入死信队列
- 所有关键操作记录审计日志，支持消息回溯

### 5.2 幂等性设计

- 每笔交易生成唯一交易ID（基于上游消息ID + 时间戳）
- 下游支付调用前检查交易ID是否已处理
- 数据库层面唯一约束防止重复插入

### 5.3 事务一致性

- 映射表维护操作与审批记录在同一事务内
- 支付指令状态更新与日志记录在同一事务内
- 跨系统操作采用最终一致性，通过状态机和对账机制保证

### 5.4 配置外部化

- 所有环境相关配置通过 Spring Cloud Config / Nacos 管理
- 轮询间隔、重试策略等均可配置
- 下游 API 地址、超时时间等通过配置中心管理
