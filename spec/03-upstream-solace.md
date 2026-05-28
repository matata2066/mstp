# MSTP - 上游 Solace 消息接入设计

## 1. Solace 接入概述

MSTP 通过 Solace 消息中间件接收上游业务系统发送的支付请求消息。系统作为消息消费者，订阅指定 Topic，解析消息内容，提取交易要素后交由业务层处理。

## 2. Solace 连接配置

### 2.1 连接参数

| 参数 | 说明 | 示例 |
|------|------|------|
| HOST | Solace Broker 地址 | tcp://solace-host:55555 |
| VPN | 消息VPN名称 | mstp-vpn |
| USERNAME | 认证用户名 | mstp-consumer |
| PASSWORD | 认证密码 | ****** |
| CLIENT_NAME | 客户端标识 | mstp-app-node1 |

### 2.2 连接策略

- 采用 Solace JMS 2.0 API 接入
- 支持主备 Broker 自动切换（High Availability）
- 连接断开自动重连，重连间隔指数退避（1s → 2s → 4s → 8s → 最大30s）
- 连接状态变更事件监听，异常时触发告警

### 2.3 资源配置

| 资源 | 类型 | 名称 | 说明 |
|------|------|------|------|
| Queue | Durable | MSTP_PAYMENT_REQ_Q | 支付请求队列 |
| Topic | - | mstp/payment/request | 支付请求主题 |
| Subscription | - | MSTP_PAYMENT_REQ_Q → mstp/payment/request | 队列订阅主题 |

## 3. 消息格式定义

### 3.1 消息结构

上游消息采用 JSON 格式，通过 Solace TextMessage 传输。

#### 消息头（Solace Message Properties）

| Property | 类型 | 必填 | 说明 |
|----------|------|------|------|
| MSG_ID | String | Y | 上游消息唯一ID |
| MSG_TYPE | String | Y | 消息类型：PAYMENT_REQ |
| SOURCE_SYSTEM | String | Y | 来源系统标识 |
| TIMESTAMP | String | Y | 消息发送时间（ISO 8601） |

#### 消息体（JSON Payload）

```json
{
  "msgId": "MSG-20260518-000001",
  "msgType": "PAYMENT_REQ",
  "sourceSystem": "CORE_BANKING",
  "timestamp": "2026-05-18T10:30:00.000+08:00",
  "paymentRequest": {
    "payeeAccountNo": "6225880123456789",
    "currency": "CNY",
    "amount": 100000.00,
    "channel": "CNAPS",
    "payeeBankCode": "102100099996",
    "valueDate": "2026-05-19",
    "referenceNo": "REF-20260518-001",
    "remark": "测试付款"
  }
}
```

### 3.2 字段定义

| 字段 | 路径 | 类型 | 必填 | 校验规则 | 说明 |
|------|------|------|------|----------|------|
| msgId | $.msgId | String(64) | Y | 非空，唯一 | 消息唯一标识 |
| msgType | $.msgType | String(20) | Y | 枚举：PAYMENT_REQ | 消息类型 |
| sourceSystem | $.sourceSystem | String(30) | Y | 非空 | 来源系统 |
| timestamp | $.timestamp | String | Y | ISO 8601格式 | 消息时间戳 |
| payeeAccountNo | $.paymentRequest.payeeAccountNo | String(32) | Y | 非空，数字 | 收款账号 |
| currency | $.paymentRequest.currency | String(3) | Y | ISO 4217 | 币种 |
| amount | $.paymentRequest.amount | Decimal(18,2) | Y | > 0 | 金额 |
| channel | $.paymentRequest.channel | String(10) | Y | 枚举：CNAPS/CIPS | 支付渠道 |
| payeeBankCode | $.paymentRequest.payeeBankCode | String(20) | Y | 非空 | 收款行行号 |
| valueDate | $.paymentRequest.valueDate | String(10) | Y | ISO 日期格式 YYYY-MM-DD | 记账日期 |
| referenceNo | $.paymentRequest.referenceNo | String(64) | N | - | 业务参考号 |
| remark | $.paymentRequest.remark | String(200) | N | - | 备注（用于附言映射匹配） |

### 3.3 渠道与行号规则

| 渠道 | 行号类型 | 行号格式 | 示例 |
|------|----------|----------|------|
| CNAPS | CNAPS Code | 12位数字 | 102100099996 |
| CIPS | CIPS BIC Code | 11位字母数字 | CIBKCNBJXXX |

## 4. 消息处理流程

### 4.1 处理步骤

```
Solace Message
      │
      ▼
[1.消息接收] ──→ 从 Queue 消费消息
      │
      ▼
[2.消息解析] ──→ 解析消息头与消息体
      │
      ▼
[3.格式校验] ──→ 校验必填字段、格式、枚举值
      │
      ├─(校验失败)──→ 记录异常日志 → 写入异常表 → ACK消息 → 告警
      │
      ▼
[4.幂等检查] ──→ 根据 MSG_ID 检查是否已处理
      │
      ├─(已处理)──→ ACK消息，跳过处理
      │
      ▼
[5.创建交易记录] ──→ 状态：RECEIVED
      │
      ▼
[6.要素补齐] ──→ 调用 Enrichment Service
      │
      ▼
[7.支付处理] ──→ 调用 Payment Service
      │
      ▼
[8.ACK消息] ──→ 业务处理完成后确认消息
```

### 4.2 消息确认策略

- 采用 `CLIENT_ACKNOWLEDGE` 模式
- 仅在业务处理成功（至少已创建交易记录）后 ACK
- 处理异常时 NACK，消息重新入队
- 超过最大重试次数（默认5次）后消息进入死信队列

### 4.3 并发消费配置

| 参数 | 值 | 说明 |
|------|-----|------|
| concurrentConsumers | 5 | 初始并发消费者数 |
| maxConcurrentConsumers | 20 | 最大并发消费者数 |
| prefetchCount | 10 | 每个消费者预取消息数 |
| receiveTimeout | 5000ms | 接收超时时间 |

## 5. 异常消息处理

### 5.1 异常分类

| 异常类型 | 处理方式 | 是否ACK |
|----------|----------|---------|
| 消息格式错误 | 写入异常表，ACK | 是 |
| 必填字段缺失 | 写入异常表，ACK | 是 |
| 枚举值非法 | 写入异常表，ACK | 是 |
| 业务处理异常 | 重试，超过次数入死信队列 | 否（重试）/ 是（超限） |
| 系统异常 | 重试，超过次数入死信队列 | 否（重试）/ 是（超限） |

### 5.2 异常消息表 (MSTP_MESSAGE_EXCEPTION)

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ID | NUMBER(20) | PK | 主键 |
| MSG_ID | VARCHAR2(64) | Y | 原始消息ID |
| RAW_PAYLOAD | CLOB | Y | 原始消息内容 |
| EXCEPTION_TYPE | VARCHAR2(20) | Y | 异常类型 |
| ERROR_MESSAGE | VARCHAR2(500) | Y | 错误信息 |
| STATUS | VARCHAR2(10) | Y | 状态：PENDING/RESOLVED |
| RESOLVED_BY | VARCHAR2(50) | N | 处理人 |
| RESOLVED_TIME | TIMESTAMP(6) | N | 处理时间 |
| CREATED_TIME | TIMESTAMP(6) | Y | 创建时间 |

### 5.3 死信队列处理

- 死信队列名称：`MSTP_PAYMENT_REQ_DLQ`
- 死信消息保留时间：7天
- 提供管理界面查看死信消息
- 支持手动重发死信消息

## 6. 消息监控

### 6.1 监控指标

| 指标 | 说明 | 告警阈值 |
|------|------|----------|
| queue.depth | 队列深度 | > 1000 |
| consumer.count | 消费者数量 | < 3 |
| msg.process.latency | 消息处理延迟 | > 5s (P99) |
| msg.process.error.rate | 处理错误率 | > 1% |
| dlq.depth | 死信队列深度 | > 0 |
| connection.status | 连接状态 | DISCONNECTED |

### 6.2 健康检查

- 提供 `/actuator/health/solace` 端点
- 定期检查 Solace 连接状态
- 定期检查队列深度
- 连接异常时触发告警并尝试自动重连
