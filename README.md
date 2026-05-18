# MSTP - Multi-channel Settlement & Transfer Platform

多渠道支付中间平台，位于上游业务系统与下游支付结算系统之间，承担消息接收、要素补齐、支付指令组装与下发、状态跟踪等核心职责。

## 项目结构

```
mstp/
├── spec/                    # 需求规格设计文档
│   ├── 01-system-overview.md    # 系统概述与架构设计
│   ├── 02-data-model.md         # 数据模型与映射表设计
│   ├── 03-upstream-solace.md    # 上游 Solace 消息接入设计
│   ├── 04-downstream-api.md     # 下游 REST API 接口设计
│   ├── 05-ux-design.md          # UX 界面设计
│   ├── 06-nonfunctional.md      # 企业级非功能需求
│   └── 07-maker-checker.md      # Maker/Checker 工作流设计
├── demo/                    # 静态页面 Demo
│   ├── common.css                # 公共样式
│   ├── common.js                 # 公共脚本
│   ├── dashboard.html            # 总览
│   ├── account-mapping.html      # 收款账号映射
│   ├── bank-mapping.html         # 行号映射
│   ├── payer-config.html         # 付款账号配置
│   ├── approval-pending.html     # 审批查询
│   ├── payment-query.html        # 支付指令查询
│   └── maintenance-log.html      # 维护记录查询
└── README.md
```

## 核心功能

- **消息接入**：通过 Solace 接收上游支付请求消息
- **要素补齐**：基于本地映射表补齐完整支付指令要素
- **支付下发**：向下游支付系统发送支付指令并跟踪状态
- **映射管理**：收款账号、行号、付款账号的映射关系维护
- **审批流程**：Maker/Checker 四眼原则，所有映射变更需审批
- **交易查询**：支付指令状态跟踪与维护记录查询

## 技术栈

- 后端：Spring Boot 3.x + Oracle 19c+
- 消息中间件：Solace JMS
- 前端：React + Ant Design Pro
- 认证/权限：SPI 可插拔设计，预留 SSO 和企业权限系统接口

## Demo 预览

```bash
cd demo
python -m http.server 8080
# 浏览器打开 http://localhost:8080/dashboard.html
```
