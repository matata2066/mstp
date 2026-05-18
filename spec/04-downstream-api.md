# MSTP - 下游 REST API 接口设计

## 1. 接口概述

MSTP 作为客户端调用下游支付结算系统的 RESTful API，完成支付指令发送、状态查询、动账通知与账号授权等功能。所有接口调用基于 HTTPS，采用 JSON 格式交互。

## 2. 通用约定

### 2.1 通信协议

| 项目 | 规范 |
|------|------|
| 协议 | HTTPS (TLS 1.2+) |
| 方法 | POST / GET |
| 字符集 | UTF-8 |
| 内容类型 | application/json |
| 超时时间 | 连接超时 5s，读取超时 30s |

### 2.2 请求头

| Header | 必填 | 说明 |
|--------|------|------|
| Content-Type | Y | application/json |
| Authorization | Y | Bearer Token（OAuth2 令牌） |
| X-Request-ID | Y | 请求唯一ID（UUID） |
| X-Client-ID | Y | 客户端标识：MSTP |
| X-Timestamp | Y | 请求时间戳（ISO 8601） |

### 2.3 通用响应结构

```json
{
  "code": "0000",
  "message": "success",
  "requestId": "uuid-xxx",
  "timestamp": "2026-05-18T10:30:00.000+08:00",
  "data": {}
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| code | String(4) | 响应码：0000-成功，其他-失败 |
| message | String | 响应信息 |
| requestId | String | 请求ID（回传） |
| timestamp | String | 响应时间 |
| data | Object | 业务数据 |

### 2.4 错误码定义

| 错误码 | 说明 | 处理策略 |
|--------|------|----------|
| 0000 | 成功 | - |
| 1001 | 参数校验失败 | 记录日志，交易标记失败 |
| 2001 | 认证失败 | 刷新令牌重试 |
| 2002 | 权限不足 | 交易标记失败，告警 |
| 3001 | 账号未授权 | 调用授权接口后重试 |
| 3002 | 余额不足 | 交易标记失败 |
| 4001 | 交易不存在 | 检查交易ID |
| 5001 | 系统异常 | 重试 |
| 5002 | 交易重复 | 幂等处理，查询状态 |

## 3. 支付接口

### 3.1 发送支付指令

**接口说明：** 向下游支付系统发送支付指令。接口调用成功仅表示请求已受理，不代表支付成功。

| 项目 | 值 |
|------|-----|
| Method | POST |
| Path | /api/v1/payment/send |
| 超时 | 30s |
| 重试 | 3次（指数退避） |

#### 请求体

```json
{
  "txnId": "MSTP-20260518-000001",
  "channel": "CNAPS",
  "payer": {
    "bankCode": "102100099996",
    "bankName": "中国工商银行北京市分行",
    "accountNo": "0200003609000123456",
    "accountName": "某某公司"
  },
  "payee": {
    "bankCode": "102100099996",
    "bankName": "中国工商银行北京市分行",
    "accountNo": "6225880123456789",
    "accountName": "张三"
  },
  "amount": 100000.00,
  "currency": "CNY",
  "referenceNo": "REF-20260518-001",
  "remark": "测试付款"
}
```

#### 请求字段

| 字段 | 路径 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| txnId | $.txnId | String(40) | Y | 交易唯一ID |
| channel | $.channel | String(10) | Y | CNAPS / CIPS |
| payer.bankCode | $.payer.bankCode | String(20) | Y | 付款行行号 |
| payer.bankName | $.payer.bankName | String(200) | Y | 付款行名称 |
| payer.accountNo | $.payer.accountNo | String(32) | Y | 付款账号 |
| payer.accountName | $.payer.accountName | String(200) | Y | 付款账户名称 |
| payee.bankCode | $.payee.bankCode | String(20) | Y | 收款行行号 |
| payee.bankName | $.payee.bankName | String(200) | Y | 收款行名称 |
| payee.accountNo | $.payee.accountNo | String(32) | Y | 收款账号 |
| payee.accountName | $.payee.accountName | String(200) | Y | 收款账户名称 |
| amount | $.amount | Decimal(18,2) | Y | 金额 |
| currency | $.currency | String(3) | Y | 币种 |
| referenceNo | $.referenceNo | String(64) | N | 业务参考号 |
| remark | $.remark | String(200) | N | 备注 |

#### 成功响应

```json
{
  "code": "0000",
  "message": "success",
  "requestId": "uuid-xxx",
  "timestamp": "2026-05-18T10:30:01.000+08:00",
  "data": {
    "txnId": "MSTP-20260518-000001",
    "downstreamRef": "DS-20260518-123456",
    "status": "ACCEPTED",
    "acceptedTime": "2026-05-18T10:30:01.000+08:00"
  }
}
```

#### 响应字段

| 字段 | 路径 | 类型 | 说明 |
|------|------|------|------|
| txnId | $.data.txnId | String | 交易ID（回传） |
| downstreamRef | $.data.downstreamRef | String | 下游参考号（用于后续查询） |
| status | $.data.status | String | 受理状态：ACCEPTED / REJECTED |
| acceptedTime | $.data.acceptedTime | String | 受理时间 |

## 4. 支付状态查询接口

### 4.1 查询支付状态

**接口说明：** 查询支付指令的处理状态。MSTP 需主动轮询此接口，直到获得终态（SUCCESS/FAILED）。

| 项目 | 值 |
|------|-----|
| Method | POST |
| Path | /api/v1/payment/query |
| 超时 | 10s |
| 重试 | 2次 |

#### 请求体

```json
{
  "txnId": "MSTP-20260518-000001",
  "downstreamRef": "DS-20260518-123456"
}
```

#### 成功响应

```json
{
  "code": "0000",
  "message": "success",
  "requestId": "uuid-xxx",
  "timestamp": "2026-05-18T10:35:00.000+08:00",
  "data": {
    "txnId": "MSTP-20260518-000001",
    "downstreamRef": "DS-20260518-123456",
    "status": "SUCCESS",
    "statusTime": "2026-05-18T10:32:15.000+08:00",
    "errorCode": null,
    "errorMessage": null
  }
}
```

#### 响应字段

| 字段 | 路径 | 类型 | 说明 |
|------|------|------|------|
| txnId | $.data.txnId | String | 交易ID |
| downstreamRef | $.data.downstreamRef | String | 下游参考号 |
| status | $.data.status | String | PROCESSING / SUCCESS / FAILED / UNKNOWN |
| statusTime | $.data.statusTime | String | 状态时间 |
| errorCode | $.data.errorCode | String | 失败错误码 |
| errorMessage | $.data.errorMessage | String | 失败原因 |

### 4.2 轮询策略

| 参数 | 值 | 说明 |
|------|-----|------|
| 初始间隔 | 5s | 支付发送后首次查询间隔 |
| 最大间隔 | 60s | 轮询间隔上限 |
| 间隔递增 | 1.5倍 | 每次查询后间隔递增 |
| 最大轮询次数 | 30次 | 超过后标记为 STATUS_UNKNOWN |
| 最大轮询时长 | 30分钟 | 超过后标记为 STATUS_UNKNOWN |
| 轮询条件 | status = PROCESSING | 仅处理中状态继续轮询 |

## 5. 动账通知接口

### 5.1 查询动账情况

**接口说明：** 查询指定账号的动账情况，用于确认收付款交易是否实际发生。

| 项目 | 值 |
|------|-----|
| Method | POST |
| Path | /api/v1/account/movement |
| 超时 | 10s |
| 重试 | 2次 |

#### 请求体

```json
{
  "accountNo": "0200003609000123456",
  "currency": "CNY",
  "fromTime": "2026-05-18T00:00:00.000+08:00",
  "toTime": "2026-05-18T23:59:59.999+08:00",
  "amount": 100000.00,
  "direction": "DEBIT",
  "referenceNo": "DS-20260518-123456"
}
```

#### 请求字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| accountNo | String(32) | Y | 查询账号 |
| currency | String(3) | Y | 币种 |
| fromTime | String | Y | 查询开始时间 |
| toTime | String | Y | 查询结束时间 |
| amount | Decimal(18,2) | N | 匹配金额（精确匹配） |
| direction | String(10) | N | 方向：DEBIT-借记/CREDIT-贷记 |
| referenceNo | String(64) | N | 关联参考号 |

#### 成功响应

```json
{
  "code": "0000",
  "message": "success",
  "requestId": "uuid-xxx",
  "timestamp": "2026-05-18T10:36:00.000+08:00",
  "data": {
    "accountNo": "0200003609000123456",
    "currency": "CNY",
    "movements": [
      {
        "movementId": "MV-20260518-001",
        "amount": 100000.00,
        "direction": "DEBIT",
        "balanceAfter": 900000.00,
        "movementTime": "2026-05-18T10:32:15.000+08:00",
        "referenceNo": "DS-20260518-123456"
      }
    ]
  }
}
```

### 5.2 动账确认逻辑

- 支付状态为 SUCCESS 后，延迟 10s 调用动账通知接口
- 匹配条件：账号 + 金额 + 方向 + 参考号
- 付款账号查 DEBIT 方向，收款账号查 CREDIT 方向
- 匹配成功 → 交易标记 COMPLETED
- 匹配失败 → 延迟后重试（最多3次），仍失败标记 CONFIRM_MISMATCH

## 6. 支付授权接口

### 6.1 账号授权

**接口说明：** 对付款账号进行授权声明，初次维护付款账号时调用一次，声明对该账号的付款权限。

| 项目 | 值 |
|------|-----|
| Method | POST |
| Path | /api/v1/payment/authorize |
| 超时 | 30s |
| 重试 | 3次 |

#### 请求体

```json
{
  "accountNo": "0200003609000123456",
  "accountName": "某某公司",
  "bankCode": "102100099996",
  "bankName": "中国工商银行北京市分行",
  "currency": "CNY",
  "channel": "CNAPS",
  "authorizedScope": "PAYMENT",
  "callbackUrl": "https://mstp.internal/api/v1/authorization/callback"
}
```

#### 请求字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| accountNo | String(32) | Y | 付款账号 |
| accountName | String(200) | Y | 付款账户名称 |
| bankCode | String(20) | Y | 付款行行号 |
| bankName | String(200) | Y | 付款行名称 |
| currency | String(3) | Y | 币种 |
| channel | String(10) | Y | 授权渠道：CNAPS / CIPS |
| authorizedScope | String(20) | Y | 授权范围：PAYMENT |
| callbackUrl | String(200) | N | 授权结果回调地址 |

#### 成功响应

```json
{
  "code": "0000",
  "message": "success",
  "requestId": "uuid-xxx",
  "timestamp": "2026-05-18T10:00:00.000+08:00",
  "data": {
    "accountNo": "0200003609000123456",
    "channel": "CNAPS",
    "authorizationStatus": "APPROVED",
    "authorizedTime": "2026-05-18T10:00:00.000+08:00",
    "expireTime": null
  }
}
```

#### 响应字段

| 字段 | 类型 | 说明 |
|------|------|------|
| accountNo | String | 授权账号 |
| channel | String | 授权渠道 |
| authorizationStatus | String | APPROVED / PENDING / REJECTED |
| authorizedTime | String | 授权时间 |
| expireTime | String | 过期时间（null表示永久） |

### 6.2 授权回调接口（MSTP 提供）

下游授权完成后可能通过回调通知授权结果。

| 项目 | 值 |
|------|-----|
| Method | POST |
| Path | /api/v1/authorization/callback |
| 认证 | HMAC 签名验证 |

#### 回调请求体

```json
{
  "accountNo": "0200003609000123456",
  "channel": "CNAPS",
  "authorizationStatus": "APPROVED",
  "authorizedTime": "2026-05-18T10:00:00.000+08:00"
}
```

## 7. 客户端封装设计

### 7.1 接口客户端接口定义

```java
public interface PaymentClient {

    PaymentSendResponse sendPayment(PaymentSendRequest request);

    PaymentQueryResponse queryPaymentStatus(PaymentQueryRequest request);

    AccountMovementResponse queryAccountMovement(AccountMovementRequest request);

    AuthorizationResponse authorizeAccount(AuthorizationRequest request);
}
```

### 7.2 容错机制

| 机制 | 说明 |
|------|------|
| 超时控制 | 每个接口独立配置连接/读取超时 |
| 重试策略 | 可配置重试次数与退避策略 |
| 熔断器 | 连续失败超过阈值时熔断，半开状态探测恢复 |
| 限流 | 令牌桶限流，防止突发流量冲击下游 |
| 幂等控制 | 基于请求ID的幂等保障 |

### 7.3 令牌管理

- 采用 OAuth2 Client Credentials 模式获取访问令牌
- 令牌本地内存存储，过期前自动刷新
- 令牌刷新失败时触发告警
- 令牌存储于加密本地内存存储中

## 8. 接口调用时序

### 8.1 完整支付流程时序

```
MSTP                    Downstream API
  │                           │
  │  1. authorizeAccount      │
  │ ─────────────────────────►│
  │  authorization response   │
  │◄───────────────────────── │
  │                           │
  │  2. sendPayment           │
  │ ─────────────────────────►│
  │  payment accepted         │
  │◄───────────────────────── │
  │                           │
  │  3. queryPaymentStatus    │
  │ ─────────────────────────►│  (轮询)
  │  PROCESSING               │
  │◄───────────────────────── │
  │                           │
  │  4. queryPaymentStatus    │
  │ ─────────────────────────►│  (轮询)
  │  SUCCESS                  │
  │◄───────────────────────── │
  │                           │
  │  5. queryAccountMovement  │
  │ ─────────────────────────►│  (动账确认)
  │  movement found           │
  │◄───────────────────────── │
  │                           │
```
