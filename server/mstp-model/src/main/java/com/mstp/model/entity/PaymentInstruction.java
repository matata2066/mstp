package com.mstp.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "MSTP_PAYMENT_INSTRUCTION")
@IdClass(PaymentInstructionId.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentInstruction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "TXN_ID", nullable = false, length = 40)
    private String txnId;

    @Column(name = "SOURCE_MSG_ID", nullable = false, length = 64)
    private String sourceMsgId;

    @Column(name = "CHANNEL", nullable = false, length = 10)
    private String channel;

    @Column(name = "PAYER_BANK_CODE", nullable = false, length = 20)
    private String payerBankCode;

    @Column(name = "PAYER_BANK_NAME", nullable = false, length = 200)
    private String payerBankName;

    @Column(name = "PAYER_ACCOUNT_NO", nullable = false, length = 32)
    private String payerAccountNo;

    @Column(name = "PAYER_ACCOUNT_NAME", nullable = false, length = 200)
    private String payerAccountName;

    @Column(name = "PAYEE_BANK_CODE", nullable = false, length = 20)
    private String payeeBankCode;

    @Column(name = "PAYEE_BANK_NAME", nullable = false, length = 200)
    private String payeeBankName;

    @Column(name = "PAYEE_ACCOUNT_NO", nullable = false, length = 32)
    private String payeeAccountNo;

    @Column(name = "PAYEE_ACCOUNT_NAME", nullable = false, length = 200)
    private String payeeAccountName;

    @Column(name = "AMOUNT", nullable = false, precision = 18, scale = 2)
    private BigDecimal amount;

    @Column(name = "CURRENCY", nullable = false, length = 3)
    private String currency;

    @Column(name = "VALUE_DATE", nullable = false)
    private LocalDate valueDate;

    @Column(name = "REMARK_CHINESE", length = 200)
    private String remarkChinese;

    @Column(name = "STATUS", nullable = false, length = 30)
    private String status;

    @Column(name = "DOWNSTREAM_REF", length = 64)
    private String downstreamRef;

    @Column(name = "ERROR_CODE", length = 20)
    private String errorCode;

    @Column(name = "ERROR_MESSAGE", length = 500)
    private String errorMessage;

    @Column(name = "RETRY_COUNT", nullable = false)
    private Integer retryCount;

    @Column(name = "NEXT_RETRY_TIME")
    private LocalDateTime nextRetryTime;

    @Column(name = "AUTH_CALLED", nullable = false)
    private Integer authCalled;

    @Column(name = "IS_DELETED", nullable = false)
    private Integer isDeleted;

    @Column(name = "CREATED_BY", nullable = false, length = 50)
    private String createdBy;

    @Id
    @Column(name = "CREATED_TIME", nullable = false)
    private LocalDateTime createdTime;

    @Column(name = "UPDATED_BY", nullable = false, length = 50)
    private String updatedBy;

    @Column(name = "UPDATED_TIME", nullable = false)
    private LocalDateTime updatedTime;
}
