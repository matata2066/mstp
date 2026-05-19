# MSTP - 数据模型与映射表设计

## 1. 数据库总体设计原则

- 所有表采用统一前缀 `MSTP_` 命名
- 所有表包含标准审计字段：创建人、创建时间、修改人、修改时间
- 所有表支持软删除，使用 `IS_DELETED` 字段（0-有效，1-已删除）
- 主键采用数据库序列（Oracle Sequence）生成
- 金额字段使用 `NUMBER(18,2)` 精度
- 编码字段统一使用 `VARCHAR2`，长度根据实际标准定义
- 所有表添加必要索引与约束

## 2. 映射表设计

### 2.1 收款账号映射表 (MSTP_ACCOUNT_MAPPING)

存储收款账号与账户名称、币种的映射关系。

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ID | NUMBER(20) | PK | 主键，序列生成 |
| ACCOUNT_NO | VARCHAR2(32) | Y | 收款账号（业务主键） |
| ACCOUNT_NAME | VARCHAR2(200) | Y | 收款账户名称 |
| CURRENCY | VARCHAR2(3) | Y | 币种（ISO 4217，如 CNY/USD） |
| ACCOUNT_TYPE | VARCHAR2(10) | Y | 账户类型（INTERNAL-内部/EXTERNAL-外部） |
| STATUS | VARCHAR2(10) | Y | 状态：ACTIVE/INACTIVE |
| REMARK | VARCHAR2(500) | N | 备注 |
| IS_DELETED | NUMBER(1) | Y | 软删除标记：0-有效，1-已删除 |
| CREATED_BY | VARCHAR2(50) | Y | 创建人 |
| CREATED_TIME | TIMESTAMP(6) | Y | 创建时间 |
| UPDATED_BY | VARCHAR2(50) | Y | 修改人 |
| UPDATED_TIME | TIMESTAMP(6) | Y | 修改时间 |

**索引：**
- `UK_ACCOUNT_NO`：UNIQUE(ACCOUNT_NO, IS_DELETED)

### 2.2 行号映射表 (MSTP_BANK_MAPPING)

存储行号（CNAPS Code / CIPS BIC Code）与行名的映射关系。

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ID | NUMBER(20) | PK | 主键 |
| BANK_CODE | VARCHAR2(20) | Y | 行号（CNAPS 12位 / CIPS BIC 11位） |
| BANK_NAME | VARCHAR2(200) | Y | 行名 |
| CODE_TYPE | VARCHAR2(10) | Y | 行号类型：CNAPS / CIPS |
| STATUS | VARCHAR2(10) | Y | 状态：ACTIVE/INACTIVE |
| REMARK | VARCHAR2(500) | N | 备注 |
| IS_DELETED | NUMBER(1) | Y | 软删除标记 |
| CREATED_BY | VARCHAR2(50) | Y | 创建人 |
| CREATED_TIME | TIMESTAMP(6) | Y | 创建时间 |
| UPDATED_BY | VARCHAR2(50) | Y | 修改人 |
| UPDATED_TIME | TIMESTAMP(6) | Y | 修改时间 |

**索引：**
- `UK_BANK_CODE`：UNIQUE(BANK_CODE, CODE_TYPE, IS_DELETED)
- `IDX_BANK_CODE_TYPE`：INDEX(BANK_CODE, CODE_TYPE)

### 2.3 付款账号配置表 (MSTP_PAYER_ACCOUNT_CONFIG)

根据支付渠道配置付款账号信息。

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ID | NUMBER(20) | PK | 主键 |
| CHANNEL | VARCHAR2(10) | Y | 支付渠道：CNAPS / CIPS |
| PAYER_BANK_CODE | VARCHAR2(20) | Y | 付款行行号 |
| PAYER_BANK_NAME | VARCHAR2(200) | Y | 付款行名称 |
| PAYER_ACCOUNT_NO | VARCHAR2(32) | Y | 付款账号 |
| PAYER_ACCOUNT_NAME | VARCHAR2(200) | Y | 付款账户名称 |
| CURRENCY | VARCHAR2(3) | Y | 币种 |
| IS_AUTHORIZED | NUMBER(1) | Y | 是否已授权：0-否，1-是 |
| AUTHORIZED_TIME | TIMESTAMP(6) | N | 授权时间 |
| STATUS | VARCHAR2(10) | Y | 状态：ACTIVE/INACTIVE |
| REMARK | VARCHAR2(500) | N | 备注 |
| IS_DELETED | NUMBER(1) | Y | 软删除标记 |
| CREATED_BY | VARCHAR2(50) | Y | 创建人 |
| CREATED_TIME | TIMESTAMP(6) | Y | 创建时间 |
| UPDATED_BY | VARCHAR2(50) | Y | 修改人 |
| UPDATED_TIME | TIMESTAMP(6) | Y | 修改时间 |

**索引：**
- `UK_CHANNEL_CURRENCY`：UNIQUE(CHANNEL, CURRENCY, IS_DELETED)

## 3. 交易数据表设计

### 3.1 支付指令表 (MSTP_PAYMENT_INSTRUCTION)

存储完整的支付指令信息及处理状态。

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ID | NUMBER(20) | PK | 主键 |
| TXN_ID | VARCHAR2(40) | Y | 交易唯一ID（幂等键） |
| SOURCE_MSG_ID | VARCHAR2(64) | Y | 上游消息ID |
| CHANNEL | VARCHAR2(10) | Y | 支付渠道：CNAPS / CIPS |
| PAYER_BANK_CODE | VARCHAR2(20) | Y | 付款行行号 |
| PAYER_BANK_NAME | VARCHAR2(200) | Y | 付款行名称 |
| PAYER_ACCOUNT_NO | VARCHAR2(32) | Y | 付款账号 |
| PAYER_ACCOUNT_NAME | VARCHAR2(200) | Y | 付款账户名称 |
| PAYEE_BANK_CODE | VARCHAR2(20) | Y | 收款行行号 |
| PAYEE_BANK_NAME | VARCHAR2(200) | Y | 收款行名称 |
| PAYEE_ACCOUNT_NO | VARCHAR2(32) | Y | 收款账号 |
| PAYEE_ACCOUNT_NAME | VARCHAR2(200) | Y | 收款账户名称 |
| AMOUNT | NUMBER(18,2) | Y | 金额 |
| CURRENCY | VARCHAR2(3) | Y | 币种 |
| STATUS | VARCHAR2(20) | Y | 交易状态（见状态机） |
| DOWNSTREAM_REF | VARCHAR2(64) | N | 下游返回的参考号 |
| ERROR_CODE | VARCHAR2(20) | N | 错误码 |
| ERROR_MESSAGE | VARCHAR2(500) | N | 错误信息 |
| RETRY_COUNT | NUMBER(5) | Y | 重试次数，默认0 |
| NEXT_RETRY_TIME | TIMESTAMP(6) | N | 下次重试时间 |
| AUTH_CALLED | NUMBER(1) | Y | 是否已调用授权接口 |
| IS_DELETED | NUMBER(1) | Y | 软删除标记 |
| CREATED_BY | VARCHAR2(50) | Y | 创建人 |
| CREATED_TIME | TIMESTAMP(6) | Y | 创建时间 |
| UPDATED_BY | VARCHAR2(50) | Y | 修改人 |
| UPDATED_TIME | TIMESTAMP(6) | Y | 修改时间 |

**索引：**
- `UK_TXN_ID`：UNIQUE(TXN_ID)
- `IDX_SOURCE_MSG_ID`：INDEX(SOURCE_MSG_ID)
- `IDX_STATUS`：INDEX(STATUS)
- `IDX_CREATED_TIME`：INDEX(CREATED_TIME)
- `IDX_PAYEE_ACCOUNT`：INDEX(PAYEE_ACCOUNT_NO)

**交易状态机：**

支付指令状态根据渠道类型分为两条流转路径：

#### CNAPS 通道状态流

```
GCMS                    消息已接收
    │
    ▼
VALIDATING              要素校验中
    │
    ├─(校验失败)──→ VALIDATING_FAILED  ──(重试)──→ VALIDATING
    │
    ▼
SENDING                 发送支付指令中
    │
    ├─(发送失败)──→ SEND_FAILED
    │
    ▼
CITIFT_PENDING          CitiFT 处理中
    │
    ├─(300s超时)──→ CITIFT_PENDING_TIMEOUT
    │
    ▼
CITIFT_SUCC             CitiFT 处理成功
    │
    ▼
LCP_PENDING             LCP 清算中
    │
    ├─(300s超时)──→ LCP_PENDING_TIMEOUT
    │
    ▼
LCP_CLEARED             LCP 清算完成（终态）
```

#### CIPS 通道状态流

```
GCMS                    消息已接收
    │
    ▼
VALIDATING              要素校验中
    │
    ├─(校验失败)──→ VALIDATING_FAILED  ──(重试)──→ VALIDATING
    │
    ▼
SENDING                 发送支付指令中
    │
    ├─(发送失败)──→ SEND_FAILED
    │
    ▼
CITIFT_PENDING          CitiFT 处理中
    │
    ├─(300s超时)──→ CITIFT_PENDING_TIMEOUT
    │
    ▼
CITIFT_SUCC             CitiFT 处理成功
    │
    ▼
CIPS_PENDING            CIPS 清算中
    │
    ├─(300s超时)──→ CIPS_PENDING_TIMEOUT
    │
    ▼
CIPS_CLEARED            CIPS 清算完成（终态）
```

#### 状态编码对照表

| 状态编码 | 显示名称 | 适用通道 | 类型 |
|----------|----------|----------|------|
| GCMS | GCMS | 通用 | 初始 |
| VALIDATING | Validating | 通用 | 处理中 |
| VALIDATING_FAILED | Validating Failed | 通用 | 异常终态（可重试） |
| SENDING | Sending | 通用 | 处理中 |
| SEND_FAILED | Send Failed | 通用 | 异常终态 |
| CITIFT_PENDING | CitiFT Pending | 通用 | 处理中 |
| CITIFT_PENDING_TIMEOUT | CitiFT Pending (timeout) | 通用 | 异常终态 |
| CITIFT_SUCC | CitiFT Succ | 通用 | 处理中 |
| LCP_PENDING | LCP Pending | CNAPS | 处理中 |
| LCP_PENDING_TIMEOUT | LCP Pending (timeout) | CNAPS | 异常终态 |
| LCP_CLEARED | LCP Cleared | CNAPS | 正常终态 |
| CIPS_PENDING | CIPS Pending | CIPS | 处理中 |
| CIPS_PENDING_TIMEOUT | CIPS Pending (timeout) | CIPS | 异常终态 |
| CIPS_CLEARED | CIPS Cleared | CIPS | 正常终态 |

#### 超时机制

- 每个 Pending 状态（CitiFT Pending / LCP Pending / CIPS Pending）均设置 300 秒超时
- 超时后自动跳转至对应的 Pending (timeout) 状态
- 超时状态为异常终态，需人工介入处理

#### 重试机制（VALIDATING_FAILED）

- 当要素校验失败时，交易状态进入 `VALIDATING_FAILED`
- `VALIDATING_FAILED` 为可重试的异常终态，用户可在 UI 上点击「重试」按钮
- 重试操作将状态重置为 `VALIDATING`，系统重新执行要素校验流程
- 每次重试会递增 `RETRY_COUNT` 字段，并记录状态变更日志
- 重试适用于以下场景：映射表数据补录后重新校验、临时性系统故障恢复后重试

### 3.2 支付状态跟踪表 (MSTP_PAYMENT_STATUS_LOG)

记录支付状态变更日志。

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ID | NUMBER(20) | PK | 主键 |
| TXN_ID | VARCHAR2(40) | Y | 交易ID |
| FROM_STATUS | VARCHAR2(20) | N | 原状态 |
| TO_STATUS | VARCHAR2(20) | Y | 新状态 |
| STATUS_TIME | TIMESTAMP(6) | Y | 状态变更时间 |
| REMARK | VARCHAR2(500) | N | 备注 |
| CREATED_BY | VARCHAR2(50) | Y | 操作人 |
| CREATED_TIME | TIMESTAMP(6) | Y | 创建时间 |

**索引：**
- `IDX_TXN_ID`：INDEX(TXN_ID)
- `IDX_STATUS_TIME`：INDEX(STATUS_TIME)

## 4. 审批流程表设计

### 4.1 审批主表 (MSTP_APPROVAL_RECORD)

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ID | NUMBER(20) | PK | 主键 |
| APPROVAL_ID | VARCHAR2(40) | Y | 审批单号 |
| BIZ_TYPE | VARCHAR2(20) | Y | 业务类型：ACCOUNT_MAPPING / BANK_MAPPING / PAYER_CONFIG |
| BIZ_ID | NUMBER(20) | Y | 关联业务记录ID |
| OPERATION_TYPE | VARCHAR2(10) | Y | 操作类型：CREATE / UPDATE / DELETE |
| OPERATION_DATA | CLOB | Y | 操作数据（JSON格式，保存变更前后快照） |
| STATUS | VARCHAR2(10) | Y | 审批状态：PENDING / APPROVED / REJECTED |
| MAKER_ID | VARCHAR2(50) | Y | 制单人 |
| MAKER_TIME | TIMESTAMP(6) | Y | 制单时间 |
| CHECKER_ID | VARCHAR2(50) | N | 审核人 |
| CHECKER_TIME | TIMESTAMP(6) | N | 审核时间 |
| REJECT_REASON | VARCHAR2(500) | N | 拒绝原因 |
| IS_DELETED | NUMBER(1) | Y | 软删除标记 |
| CREATED_BY | VARCHAR2(50) | Y | 创建人 |
| CREATED_TIME | TIMESTAMP(6) | Y | 创建时间 |
| UPDATED_BY | VARCHAR2(50) | Y | 修改人 |
| UPDATED_TIME | TIMESTAMP(6) | Y | 修改时间 |

**索引：**
- `UK_APPROVAL_ID`：UNIQUE(APPROVAL_ID)
- `IDX_BIZ_TYPE_STATUS`：INDEX(BIZ_TYPE, STATUS)
- `IDX_MAKER_ID`：INDEX(MAKER_ID)
- `IDX_CHECKER_ID`：INDEX(CHECKER_ID)

## 5. 系统管理表设计

### 5.1 操作日志表 (MSTP_AUDIT_LOG)

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ID | NUMBER(20) | PK | 主键 |
| LOG_ID | VARCHAR2(40) | Y | 日志唯一ID |
| USER_ID | VARCHAR2(50) | Y | 操作人ID |
| USER_NAME | VARCHAR2(100) | Y | 操作人姓名 |
| MODULE | VARCHAR2(30) | Y | 模块 |
| ACTION | VARCHAR2(30) | Y | 操作 |
| TARGET_TYPE | VARCHAR2(30) | N | 操作对象类型 |
| TARGET_ID | VARCHAR2(40) | N | 操作对象ID |
| DETAIL | CLOB | N | 操作详情（JSON） |
| CLIENT_IP | VARCHAR2(45) | N | 客户端IP |
| CREATED_TIME | TIMESTAMP(6) | Y | 操作时间 |

**索引：**
- `IDX_USER_ID`：INDEX(USER_ID)
- `IDX_MODULE`：INDEX(MODULE)
- `IDX_CREATED_TIME`：INDEX(CREATED_TIME)

### 5.2 系统配置表 (MSTP_SYS_CONFIG)

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ID | NUMBER(20) | PK | 主键 |
| CONFIG_KEY | VARCHAR2(100) | Y | 配置键 |
| CONFIG_VALUE | VARCHAR2(500) | Y | 配置值 |
| CONFIG_GROUP | VARCHAR2(50) | Y | 配置分组 |
| DESCRIPTION | VARCHAR2(200) | N | 描述 |
| IS_DELETED | NUMBER(1) | Y | 软删除标记 |
| CREATED_BY | VARCHAR2(50) | Y | 创建人 |
| CREATED_TIME | TIMESTAMP(6) | Y | 创建时间 |
| UPDATED_BY | VARCHAR2(50) | Y | 修改人 |
| UPDATED_TIME | TIMESTAMP(6) | Y | 修改时间 |

**索引：**
- `UK_CONFIG_KEY`：UNIQUE(CONFIG_KEY, IS_DELETED)

## 6. ER 关系图

```
┌────────────────────┐        ┌────────────────────┐
│ MSTP_ACCOUNT_      │        │ MSTP_BANK_         │
│ MAPPING            │        │ MAPPING            │
├────────────────────┤        ├────────────────────┤
│ *ID                │        │ *ID                │
│  ACCOUNT_NO  ──────┼──┐     │  BANK_CODE  ───────┼──┐
│  ACCOUNT_NAME      │  │     │  BANK_NAME         │  │
│  CURRENCY          │  │     │  CODE_TYPE         │  │
│  ACCOUNT_TYPE      │  │     │  STATUS            │  │
│  STATUS            │  │     └────────────────────┘  │
└────────────────────┘  │                              │
                        │     ┌────────────────────┐   │
                        │     │ MSTP_PAYER_ACCOUNT_│   │
                        │     │ CONFIG             │   │
                        │     ├────────────────────┤   │
                        │     │ *ID                │   │
                        └────►│  CHANNEL           │   │
                               │  PAYER_BANK_CODE   │◄──┘
                               │  PAYER_BANK_NAME   │
                        ┌────►│  PAYER_ACCOUNT_NO  │
                        │     │  PAYER_ACCOUNT_NAME │
                        │     │  CURRENCY           │
                        │     │  IS_AUTHORIZED      │
                        │     └────────────────────┘
                        │
┌────────────────────┐  │
│ MSTP_PAYMENT_      │  │
│ INSTRUCTION        │  │
├────────────────────┤  │
│ *ID                │  │
│  TXN_ID            │  │
│  CHANNEL           │  │
│  PAYER_BANK_CODE   │  │
│  PAYER_BANK_NAME   │  │
│  PAYER_ACCOUNT_NO ◄──┘
│  PAYER_ACCOUNT_NAME│
│  PAYEE_BANK_CODE   │
│  PAYEE_BANK_NAME   │
│  PAYEE_ACCOUNT_NO  │
│  PAYEE_ACCOUNT_NAME│
│  AMOUNT            │
│  CURRENCY          │
│  STATUS            │
│  DOWNSTREAM_REF    │
│  ERROR_CODE        │
│  ERROR_MESSAGE     │
└────────┬───────────┘
         │ 1:N
         ▼
┌────────────────────┐
│ MSTP_PAYMENT_      │
│ STATUS_LOG         │
├────────────────────┤
│ *ID                │
│  TXN_ID            │
│  FROM_STATUS       │
│  TO_STATUS         │
│  STATUS_TIME       │
│  REMARK            │
└────────────────────┘

┌────────────────────┐
│ MSTP_APPROVAL_     │
│ RECORD             │
├────────────────────┤
│ *ID                │
│  APPROVAL_ID       │
│  BIZ_TYPE          │
│  BIZ_ID            │
│  OPERATION_TYPE    │
│  OPERATION_DATA    │
│  STATUS            │
│  MAKER_ID          │
│  CHECKER_ID        │
└────────────────────┘
```

## 7. 数据安全要求

- 敏感字段（账号等）在日志中脱敏显示，仅保留前4后4位
- 数据库层面启用透明数据加密（TDE）
- 审计日志不可篡改，仅支持追加写入
- 所有删除操作为逻辑删除，保留数据可追溯
- 定期数据归档策略，历史数据迁移至归档表
