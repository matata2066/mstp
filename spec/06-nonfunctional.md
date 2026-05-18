# MSTP - 企业级非功能需求

## 1. 身份认证设计

### 1.1 认证架构

系统采用 SPI（Service Provider Interface）模式设计认证模块，当前实现基于 JWT 的本地认证，预留 SSO 集成接口，后续可无缝切换至企业 SSO 系统。

```
┌─────────────────────────────────────────────┐
│              MSTP Application                │
│                                              │
│  ┌─────────────────────────────────────┐     │
│  │        Authentication Manager       │     │
│  │  ┌─────────────────────────────┐    │     │
│  │  │   AuthProvider (SPI)        │    │     │
│  │  │  ┌───────────┐ ┌─────────┐ │    │     │
│  │  │  │ LocalAuth │ │ SSOAuth │ │    │     │
│  │  │  │ Provider  │ │ Provider│ │    │     │
│  │  │  └───────────┘ └─────────┘ │    │     │
│  │  └─────────────────────────────┘    │     │
│  └─────────────────────────────────────┘     │
└─────────────────────────────────────────────┘
```

### 1.2 认证接口定义

```java
public interface AuthProvider {

    AuthResult authenticate(AuthRequest request);

    TokenResult validateToken(String token);

    TokenResult refreshToken(String refreshToken);

    void logout(String token);

    UserInfo getUserInfo(String token);
}
```

### 1.3 LocalAuthProvider（默认实现）

| 项目 | 说明 |
|------|------|
| 认证方式 | 用户名 + 密码 |
| 令牌类型 | JWT (Access Token + Refresh Token) |
| Access Token 有效期 | 30 分钟 |
| Refresh Token 有效期 | 8 小时 |
| 密码存储 | BCrypt 加密 |
| 登录失败锁定 | 连续5次失败锁定30分钟 |

### 1.4 SSOAuthProvider（预留实现）

| 项目 | 说明 |
|------|------|
| 协议 | SAML 2.0 / OAuth2 / OIDC |
| 集成方式 | 重定向至 SSO 登录页 |
| 令牌验证 | 通过 SSO 端点验证 |
| 会话管理 | 与 SSO 会话同步 |
| 单点登出 | 支持 SLO (Single Logout) |

### 1.5 认证配置

```yaml
mstp:
  auth:
    provider: local          # local / sso
    local:
      jwt-secret: ${JWT_SECRET}
      access-token-ttl: 30m
      refresh-token-ttl: 8h
      max-login-attempts: 5
      lock-duration: 30m
    sso:
      issuer-url: ${SSO_ISSUER_URL}
      client-id: ${SSO_CLIENT_ID}
      client-secret: ${SSO_CLIENT_SECRET}
      redirect-uri: ${SSO_REDIRECT_URI}
      jwk-set-uri: ${SSO_JWK_SET_URI}
```

## 2. 权限管理设计

### 2.1 权限架构

系统采用 SPI 模式设计权限模块，当前实现基于本地角色表，预留企业权限管理系统集成接口，后续可从企业接口拉取角色与权限信息。

```
┌─────────────────────────────────────────────┐
│              MSTP Application                │
│                                              │
│  ┌─────────────────────────────────────┐     │
│  │        Authorization Manager        │     │
│  │  ┌─────────────────────────────┐    │     │
│  │  │   RbacProvider (SPI)        │    │     │
│  │  │  ┌───────────┐ ┌─────────┐ │    │     │
│  │  │  │ LocalRBAC │ │ ExtRBAC │ │    │     │
│  │  │  │ Provider  │ │ Provider│ │    │     │
│  │  │  └───────────┘ └─────────┘ │    │     │
│  │  └─────────────────────────────┘    │     │
│  └─────────────────────────────────────┘     │
└─────────────────────────────────────────────┘
```

### 2.2 权限接口定义

```java
public interface RbacProvider {

    List<Role> getUserRoles(String userId);

    List<Permission> getRolePermissions(String roleId);

    boolean hasPermission(String userId, String resource, String action);

    List<MenuNode> getUserMenu(String userId);

    void syncRoles();
}
```

### 2.3 角色定义

| 角色 | 角色编码 | 说明 |
|------|----------|------|
| 制单人 | MAKER | 可新增/编辑映射记录，查询数据 |
| 审核人 | CHECKER | 可审批映射记录，查询数据 |
| 管理员 | ADMIN | 拥有所有权限 |
| 观察者 | VIEWER | 仅查询权限 |

### 2.4 权限矩阵

| 资源 | 操作 | MAKER | CHECKER | ADMIN | VIEWER |
|------|------|-------|---------|-------|--------|
| account-mapping | read | ✅ | ✅ | ✅ | ✅ |
| account-mapping | create | ✅ | - | ✅ | - |
| account-mapping | update | ✅ | - | ✅ | - |
| account-mapping | delete | ✅ | - | ✅ | - |
| bank-mapping | read | ✅ | ✅ | ✅ | ✅ |
| bank-mapping | create | ✅ | - | ✅ | - |
| bank-mapping | update | ✅ | - | ✅ | - |
| bank-mapping | delete | ✅ | - | ✅ | - |
| payer-config | read | ✅ | ✅ | ✅ | ✅ |
| payer-config | create | ✅ | - | ✅ | - |
| payer-config | update | ✅ | - | ✅ | - |
| payer-config | authorize | ✅ | - | ✅ | - |
| approval | approve | - | ✅ | ✅ | - |
| approval | reject | - | ✅ | ✅ | - |
| approval | read | ✅ | ✅ | ✅ | ✅ |
| payment-txn | read | ✅ | ✅ | ✅ | ✅ |
| audit-log | read | - | - | ✅ | - |
| sys-config | read | - | - | ✅ | - |
| sys-config | update | - | - | ✅ | - |

### 2.5 LocalRbacProvider（默认实现）

- 角色与权限存储在本地数据库表
- 用户-角色关联存储在本地
- 支持动态角色分配

### 2.6 ExtRbacProvider（预留实现）

| 项目 | 说明 |
|------|------|
| 数据源 | 企业权限管理系统 API |
| 同步策略 | 定时拉取（默认每5分钟）+ 事件驱动 |
| 同步内容 | 角色、权限、用户-角色关系 |
| 降级策略 | 外部系统不可用时使用本地已同步数据 |
| 冲突处理 | 以外部系统为准 |

### 2.7 权限相关数据表

#### 用户表 (MSTP_USER)

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ID | NUMBER(20) | PK | 主键 |
| USER_ID | VARCHAR2(50) | Y | 用户ID（业务主键） |
| USER_NAME | VARCHAR2(100) | Y | 用户姓名 |
| EMAIL | VARCHAR2(100) | N | 邮箱 |
| STATUS | VARCHAR2(10) | Y | 状态：ACTIVE/LOCKED/DISABLED |
| PASSWORD_HASH | VARCHAR2(200) | N | 密码哈希（Local模式使用） |
| LAST_LOGIN_TIME | TIMESTAMP(6) | N | 最后登录时间 |
| IS_DELETED | NUMBER(1) | Y | 软删除标记 |
| CREATED_BY | VARCHAR2(50) | Y | 创建人 |
| CREATED_TIME | TIMESTAMP(6) | Y | 创建时间 |
| UPDATED_BY | VARCHAR2(50) | Y | 修改人 |
| UPDATED_TIME | TIMESTAMP(6) | Y | 修改时间 |

#### 角色表 (MSTP_ROLE)

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ID | NUMBER(20) | PK | 主键 |
| ROLE_CODE | VARCHAR2(30) | Y | 角色编码 |
| ROLE_NAME | VARCHAR2(100) | Y | 角色名称 |
| DESCRIPTION | VARCHAR2(200) | N | 描述 |
| SOURCE | VARCHAR2(10) | Y | 来源：LOCAL/EXTERNAL |
| IS_DELETED | NUMBER(1) | Y | 软删除标记 |
| CREATED_BY | VARCHAR2(50) | Y | 创建人 |
| CREATED_TIME | TIMESTAMP(6) | Y | 创建时间 |
| UPDATED_BY | VARCHAR2(50) | Y | 修改人 |
| UPDATED_TIME | TIMESTAMP(6) | Y | 修改时间 |

#### 用户角色关联表 (MSTP_USER_ROLE)

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ID | NUMBER(20) | PK | 主键 |
| USER_ID | VARCHAR2(50) | Y | 用户ID |
| ROLE_CODE | VARCHAR2(30) | Y | 角色编码 |
| CREATED_BY | VARCHAR2(50) | Y | 创建人 |
| CREATED_TIME | TIMESTAMP(6) | Y | 创建时间 |

## 3. 日志设计

### 3.1 日志分级

| 级别 | 用途 | 示例 |
|------|------|------|
| ERROR | 系统错误，需要立即处理 | 数据库连接失败、下游API调用异常 |
| WARN | 潜在问题，需要关注 | 消息处理重试、映射查找失败、轮询超时 |
| INFO | 关键业务操作 | 交易创建、支付发送、状态变更、审批操作 |
| DEBUG | 调试信息，生产环境关闭 | 请求/响应详情、SQL参数 |
| TRACE | 详细追踪，仅开发环境 | 方法进出、变量值 |

### 3.2 日志分类

| 分类 | 日志类型 | 输出目标 | 保留策略 |
|------|----------|----------|----------|
| 应用日志 | 业务操作、异常信息 | 文件 + ELK | 30天 |
| 审计日志 | 用户操作、数据变更 | 数据库 + 文件 | 永久 |
| 交易日志 | 交易状态变更 | 数据库 + 文件 | 5年 |
| 接口日志 | 上下游接口调用 | 文件 + ELK | 90天 |
| 性能日志 | 慢查询、慢接口 | 文件 + ELK | 7天 |

### 3.3 结构化日志格式

```json
{
  "timestamp": "2026-05-18T10:30:00.000+08:00",
  "level": "INFO",
  "traceId": "trace-uuid-xxx",
  "spanId": "span-uuid-xxx",
  "service": "mstp-service-payment",
  "class": "com.mstp.payment.PaymentEngine",
  "method": "sendPayment",
  "userId": "user001",
  "category": "TRANSACTION",
  "message": "Payment instruction sent successfully",
  "context": {
    "txnId": "MSTP-20260518-000001",
    "channel": "CNAPS",
    "amount": 100000.00,
    "currency": "CNY"
  },
  "errorCode": null,
  "duration": 1250
}
```

### 3.4 日志字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| timestamp | Y | 日志时间（ISO 8601） |
| level | Y | 日志级别 |
| traceId | Y | 链路追踪ID |
| spanId | N | 当前Span ID |
| service | Y | 服务模块名 |
| class | Y | 类名 |
| method | Y | 方法名 |
| userId | N | 操作用户ID |
| category | Y | 日志分类 |
| message | Y | 日志消息 |
| context | N | 上下文信息（JSON） |
| errorCode | N | 错误码 |
| duration | N | 耗时（毫秒） |

### 3.5 敏感信息脱敏

| 数据类型 | 脱敏规则 | 日志中示例 |
|----------|----------|-----------|
| 银行账号 | 前4后4，中间* | 6225\*\*\*\*\*\*\*6789 |
| 密码 | 全部* | \*\*\*\*\*\* |
| Token | 仅显示前8位 | eyJhbGci\*\*\* |
| 身份证号 | 前3后4，中间* | 110\*\*\*\*\*\*\*\*1234 |

### 3.6 Logback 配置要点

- 生产环境：INFO 级别，结构化 JSON 输出
- 测试环境：DEBUG 级别，可读格式输出
- 开发环境：TRACE 级别，控制台输出
- 日志文件按天滚动，单文件最大 500MB
- 异步日志（AsyncAppender），避免影响业务性能
- 按模块分文件：mstp-app.log / mstp-api.log / mstp-audit.log

## 4. 数据库设计（Oracle）

### 4.1 Oracle 特定要求

| 项目 | 要求 |
|------|------|
| 版本 | Oracle 19c 及以上 |
| 字符集 | AL32UTF8 |
| 部署模式 | RAC（生产）/ 单实例（开发测试） |
| 连接池 | HikariCP，最大连接数 50 |
| Schema | MSTP（独立 Schema） |

### 4.2 数据库初始化

- 使用 Flyway 管理数据库版本迁移
- 迁移脚本按版本号命名：`V1.0.0__init_schema.sql`
- 每次变更生成新的迁移脚本
- 生产环境迁移需 DBA 审核后执行

### 4.3 性能优化策略

| 策略 | 说明 |
|------|------|
| 索引优化 | 根据查询模式创建合适索引，避免全表扫描 |
| 分区表 | 支付指令表按月分区（按 CREATED_TIME） |
| 物化视图 | 统计查询使用物化视图 |
| 绑定变量 | 所有 SQL 使用绑定变量，避免硬解析 |
| 连接池 | HikariCP 配置合理连接数 |
| 读写分离 | 查询走从库，写入走主库（如部署架构支持） |

### 4.4 数据归档策略

| 表 | 归档条件 | 归档周期 |
|----|----------|----------|
| MSTP_PAYMENT_INSTRUCTION | 状态为终态且超过1年 | 每月归档 |
| MSTP_PAYMENT_STATUS_LOG | 关联交易已归档 | 随交易归档 |
| MSTP_AUDIT_LOG | 超过3年 | 每季度归档 |
| MSTP_MESSAGE_EXCEPTION | 状态为RESOLVED且超过6个月 | 每月归档 |

### 4.5 备份策略

| 类型 | 频率 | 保留时间 |
|------|------|----------|
| 全量备份 | 每日 | 30天 |
| 增量备份 | 每小时 | 7天 |
| 归档日志 | 实时 | 7天 |

## 5. 安全要求

### 5.1 传输安全

- 所有外部通信使用 HTTPS (TLS 1.2+)
- 内部服务间通信建议使用 mTLS
- API 请求签名验证（HMAC-SHA256）

### 5.2 数据安全

- 敏感配置（数据库密码、API密钥等）使用加密存储
- 数据库启用 TDE（透明数据加密）
- 日志中敏感信息脱敏
- API 响应中账号信息脱敏

### 5.3 应用安全

- SQL 注入防护（参数化查询）
- XSS 防护（输入过滤 + 输出编码）
- CSRF 防护（Token 验证）
- 请求频率限制（Rate Limiting）
- 会话超时控制

### 5.4 审计合规

- 所有用户操作记录审计日志
- 审计日志不可篡改
- 审计日志保留期满足监管要求（至少5年）
- 支持审计日志导出
