package com.mstp.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "MSTP_PAYMENT_STATUS_LOG")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentStatusLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "TXN_ID", nullable = false, length = 40)
    private String txnId;

    @Column(name = "FROM_STATUS", length = 30)
    private String fromStatus;

    @Column(name = "TO_STATUS", nullable = false, length = 30)
    private String toStatus;

    @Column(name = "STATUS_TIME", nullable = false)
    private LocalDateTime statusTime;

    @Column(name = "REMARK", length = 500)
    private String remark;

    @Column(name = "CREATED_BY", nullable = false, length = 50)
    private String createdBy;

    @Column(name = "CREATED_TIME", nullable = false)
    private LocalDateTime createdTime;
}
