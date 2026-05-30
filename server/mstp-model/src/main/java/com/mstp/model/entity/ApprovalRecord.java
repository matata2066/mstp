package com.mstp.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "MSTP_APPROVAL_RECORD")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ApprovalRecord {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "APPROVAL_ID", nullable = false, length = 40)
    private String approvalId;

    @Column(name = "BIZ_TYPE", nullable = false, length = 20)
    private String bizType;

    @Column(name = "BIZ_ID", nullable = false)
    private Long bizId;

    @Column(name = "OPERATION_TYPE", nullable = false, length = 10)
    private String operationType;

    @Column(name = "OPERATION_DATA", nullable = false, columnDefinition = "TEXT")
    private String operationData;

    @Column(name = "ORIGINAL_DATA", columnDefinition = "TEXT")
    private String originalData;

    @Column(name = "STATUS", nullable = false, length = 10)
    private String status;

    @Column(name = "MAKER_ID", nullable = false, length = 50)
    private String makerId;

    @Column(name = "MAKER_TIME", nullable = false)
    private LocalDateTime makerTime;

    @Column(name = "CHECKER_ID", length = 50)
    private String checkerId;

    @Column(name = "CHECKER_TIME")
    private LocalDateTime checkerTime;

    @Column(name = "REJECT_REASON", length = 500)
    private String rejectReason;

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
