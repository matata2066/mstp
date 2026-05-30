package com.mstp.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "MSTP_BANK_MAPPING")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BankMapping {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "BANK_CODE", nullable = false, length = 20)
    private String bankCode;

    @Column(name = "BANK_NAME", nullable = false, length = 200)
    private String bankName;

    @Column(name = "CODE_TYPE", nullable = false, length = 10)
    private String codeType;

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
