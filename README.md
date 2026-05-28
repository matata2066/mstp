# MSTP - Multi-channel Settlement & Transfer Platform

多渠道支付中间平台，位于上游业务系统与下游支付结算系统之间，承担消息接收、要素补齐、支付指令组装与下发、状态跟踪等核心职责。

## 项目结构

```
mstp/
├── spec/                          # 需求规格设计文档
│   ├── 01-system-overview.md          # 系统概述与架构设计
│   ├── 02-data-model.md               # 数据模型与映射表设计
│   ├── 03-upstream-solace.md          # 上游 Solace 消息接入设计
│   ├── 04-downstream-api.md           # 下游 REST API 接口设计
│   ├── 05-ux-design.md                # UX 界面设计
│   ├── 06-nonfunctional.md            # 企业级非功能需求
│   └── 07-maker-checker.md            # Maker/Checker 工作流设计
├── db/                            # 数据库脚本（Oracle）
│   ├── create_schema.sql              # Schema 创建与授权
│   ├── create_sequences.sql           # 序列创建
│   ├── tbl_account_mapping.sql        # 收款账号映射表
│   ├── tbl_bank_mapping.sql           # 行号映射表
│   ├── tbl_payer_account_config.sql   # 付款账号配置表
│   ├── tbl_remark_mapping.sql         # 交易附言映射表
│   ├── tbl_payment_instruction.sql    # 支付指令表
│   ├── tbl_payment_status_log.sql     # 支付状态跟踪表
│   ├── tbl_message_exception.sql      # 异常消息表
│   ├── tbl_approval_record.sql        # 审批主表
│   ├── tbl_user.sql                   # 用户表
│   ├── tbl_role.sql                   # 角色表
│   ├── tbl_user_role.sql              # 用户角色关联表
│   ├── tbl_audit_log.sql              # 操作日志表
│   └── tbl_sys_config.sql             # 系统配置表
├── demo/                          # 静态页面 Demo（纯 HTML+JS）
│   ├── common.css / common.js         # 公共样式与脚本
│   ├── dashboard.html                 # 总览
│   ├── account-mapping.html           # 收款账号映射
│   ├── bank-mapping.html              # 行号映射
│   ├── remark-mapping.html            # 交易附言映射
│   ├── payer-config.html              # 付款账号配置
│   ├── approval-pending.html          # 审批查询
│   ├── payment-query.html             # 支付指令查询
│   └── maintenance-log.html           # 维护记录查询
├── server/                        # 后端（Spring Boot 3 + JDK 17 + Maven）
│   ├── pom.xml                        # 父 POM
│   ├── mstp-common/                   # 工具类、常量、异常
│   ├── mstp-model/                    # 实体、DTO、VO
│   ├── mstp-repository/               # JPA 数据访问层
│   ├── mstp-service/                  # 业务逻辑（5 个子模块）
│   ├── mstp-integration/              # 外部集成（4 个子模块）
│   ├── mstp-web/                      # Controller、拦截器
│   └── mstp-app/                      # 启动入口，打 Fat JAR
├── ui/                            # 前端（Vue3 + Ant Design Vue + Vite）
│   ├── package.json
│   ├── vite.config.js
│   └── src/
├── tests/                         # E2E 测试（Playwright）
│   ├── package.json
│   ├── playwright.config.ts
│   └── specs/
└── README.md
```

## 核心功能

- **消息接入**：通过 Solace 接收上游支付请求消息
- **要素补齐**：基于本地映射表补齐完整支付指令要素（账号、行号、附言）
- **支付下发**：向下游支付系统发送支付指令并跟踪状态
- **映射管理**：收款账号、行号、交易附言、付款账号的映射关系维护
- **审批流程**：Maker/Checker 四眼原则，所有映射变更需审批
- **交易查询**：支付指令状态跟踪与维护记录查询
- **重试机制**：VALIDATING_FAILED 状态支持手动重试

## 技术栈

| 维度 | 选型 | 版本 |
|------|------|------|
| 后端框架 | Spring Boot | 3.2.5 |
| JDK | OpenJDK | 17 |
| 构建工具 | Maven（多模块） | - |
| 数据库 | Oracle | 19c+ |
| 消息中间件 | Solace JMS | 10.23 |
| 前端框架 | Vue3 + Ant Design Vue | 3.4 / 4.1 |
| 前端构建 | Vite | 5.2 |
| E2E 测试 | Playwright | 1.44 |
| 认证/权限 | SPI 可插拔设计 | 预留 SSO 和企业权限系统接口 |

## 快速开始

### 前置条件

- JDK 17+（生产环境路径 `/opt/jdk/latest`）
- Maven 3.8+
- Node.js 18+
- Oracle 19c+（开发环境可用 H2 替代）

### 1. Demo 预览（无需任何后端）

```bash
cd demo
npx http-server -p 3200 -c-1
# 浏览器打开 http://localhost:3200/dashboard.html
```

### 2. 后端编译与打包

```bash
cd server

# 编译
mvn compile

# 打包（跳过测试）
mvn clean package -DskipTests

# 打包（含测试）
mvn clean package
```

打包产物：`server/mstp-app/target/mstp-app-1.0.0-SNAPSHOT.jar`

### 3. 后端启动

**开发环境：**

```bash
cd server
mvn spring-boot:run -pl mstp-app
```

**生产环境：**

```bash
# 基本启动
/opt/jdk/latest/bin/java -jar mstp-app-1.0.0-SNAPSHOT.jar

# 指定环境配置
/opt/jdk/latest/bin/java -jar mstp-app-1.0.0-SNAPSHOT.jar \
  --spring.profiles.active=prod

# 覆盖数据库连接
/opt/jdk/latest/bin/java -jar mstp-app-1.0.0-SNAPSHOT.jar \
  --spring.datasource.url=jdbc:oracle:thin:@//db-host:1521/MSTP \
  --spring.datasource.password=$ORACLE_PASSWORD

# 后台运行
nohup /opt/jdk/latest/bin/java -jar mstp-app-1.0.0-SNAPSHOT.jar \
  --spring.profiles.active=prod \
  > /var/log/mstp/app.log 2>&1 &
```

**关键配置参数：**

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `server.port` | 8080 | 服务端口 |
| `spring.datasource.url` | `jdbc:oracle:thin:@//localhost:1521/XE` | Oracle 连接 |
| `spring.datasource.password` | `${ORACLE_PASSWORD:changeme}` | 数据库密码，优先读环境变量 |
| `spring.flyway.enabled` | true | Flyway 数据库迁移 |
| `spring.jpa.hibernate.ddl-auto` | validate | JPA DDL 策略 |

### 4. 前端开发与构建

```bash
cd ui

# 安装依赖
npm install

# 开发模式（自动代理 /api → localhost:8080）
npm run dev
# 访问 http://localhost:5173

# 生产构建
npm run build
# 产物在 ui/dist/

# 预览构建结果
npm run preview
```

### 5. E2E 测试

```bash
cd tests

# 安装依赖
npm install

# 安装浏览器
npx playwright install chromium

# 运行全部测试（自动启动 http-server 服务 demo 页面）
npm test

# 有头模式（可见浏览器）
npm run test:headed

# 交互式 UI 模式
npm run test:ui

# 调试模式
npm run test:debug
```

## 生产部署

```
客户端 ──HTTPS──→ Apache HTTPD ──HTTP──→ MSTP App (JAR :8080)
                     │                      │
                  TLS 证书校验          /api/*  → Spring Boot
                  反向代理              /*      → 前端静态文件 (ui/dist/)
```

**部署步骤：**

1. 后端打包并上传 JAR
2. 前端构建并将 `ui/dist/` 部署到 Apache 静态目录
3. Apache 配置 TLS 证书和反向代理（`/api/*` → `localhost:8080`）
4. 启动后端服务

**Apache 配置示例：**

```apache
<VirtualHost *:443>
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/mstp.crt
    SSLCertificateKeyFile /etc/ssl/private/mstp.key
    SSLVerifyClient require
    SSLVerifyDepth 2

    # 前端静态文件
    DocumentRoot /var/www/mstp/ui/dist

    # API 反向代理
    ProxyPass /api http://localhost:8080/api
    ProxyPassReverse /api http://localhost:8080/api
</VirtualHost>
```

## 数据库初始化

按顺序执行 `db/` 目录下的 SQL 脚本：

```bash
# 1. 创建 Schema 和授权
sqlplus sys/password@XE as sysdba @db/create_schema.sql

# 2. 创建序列
sqlplus mstp/mstp@XE @db/create_sequences.sql

# 3. 创建表（按任意顺序）
sqlplus mstp/mstp@XE @db/tbl_user.sql
sqlplus mstp/mstp@XE @db/tbl_role.sql
sqlplus mstp/mstp@XE @db/tbl_user_role.sql
sqlplus mstp/mstp@XE @db/tbl_account_mapping.sql
sqlplus mstp/mstp@XE @db/tbl_bank_mapping.sql
sqlplus mstp/mstp@XE @db/tbl_payer_account_config.sql
sqlplus mstp/mstp@XE @db/tbl_remark_mapping.sql
sqlplus mstp/mstp@XE @db/tbl_payment_instruction.sql
sqlplus mstp/mstp@XE @db/tbl_payment_status_log.sql
sqlplus mstp/mstp@XE @db/tbl_message_exception.sql
sqlplus mstp/mstp@XE @db/tbl_approval_record.sql
sqlplus mstp/mstp@XE @db/tbl_audit_log.sql
sqlplus mstp/mstp@XE @db/tbl_sys_config.sql
```

## 状态机

### CNAPS 通道

```
GCMS → VALIDATING → SENDING → CITIFT_PENDING → CITIFT_SUCC → LCP_PENDING → LCP_CLEARED
           ↓(校验失败)                    ↓(20min超时)                    ↓(20min超时)
     VALIDATING_FAILED          CITIFT_PENDING_TIMEOUT          LCP_PENDING_TIMEOUT
           ↑(重试)──┘
```

### CIPS 通道

```
GCMS → VALIDATING → SENDING → CIPS_PENDING → CIPS_CLEARED
           ↓(校验失败)              ↓(20min超时)
     VALIDATING_FAILED        CIPS_PENDING_TIMEOUT
           ↑(重试)──┘
```
