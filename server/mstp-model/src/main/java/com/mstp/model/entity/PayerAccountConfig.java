package com.mstp.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "MSTP_PAYER_ACCOUNT_CONFIG")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PayerAccountConfig {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    @Column(name = "CURRENCY", nullable = false, length = 3)
    private String currency;

    @Column(name = "IS_AUTHORIZED", nullable = false)
    private Integer isAuthorized;

    @Column(name = "AUTHORIZED_TIME")
    private LocalDateTime authorizedTime;

    @Column(name = "REMARK", length = 500)
    private String remark;

    @Column(name = "IS_DELETED", nullable = false)
    private Integer isDeleted;

    @Column(name = "CREATED_BY", nullable = false, length = 50)
    private String createdBy;

    @Column(name = "CREATED_TIME", nullable = false)
    private LocalDateTime createdTime;

    @Column(name = "UPDATED_BY", nullable = false, length = 50)
    private String updatedBy;

    @Column(name = "UPDATED_TIME", nullable = false)
    private LocalDateTime updatedTime;
}
