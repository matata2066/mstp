package com.mstp.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "MSTP_ACCOUNT_MAPPING")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountMapping {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ACCOUNT_NO", nullable = false, length = 32)
    private String accountNo;

    @Column(name = "ACCOUNT_NAME", nullable = false, length = 200)
    private String accountName;

    @Column(name = "CURRENCY", nullable = false, length = 3)
    private String currency;

    @Column(name = "ACCOUNT_TYPE", nullable = false, length = 10)
    private String accountType;

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
