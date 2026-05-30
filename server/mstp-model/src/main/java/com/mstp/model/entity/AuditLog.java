package com.mstp.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "MSTP_AUDIT_LOG")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "LOG_ID", nullable = false, length = 40)
    private String logId;

    @Column(name = "USER_ID", nullable = false, length = 50)
    private String userId;

    @Column(name = "USER_NAME", nullable = false, length = 100)
    private String userName;

    @Column(name = "MODULE", nullable = false, length = 30)
    private String module;

    @Column(name = "ACTION", nullable = false, length = 30)
    private String action;

    @Column(name = "TARGET_TYPE", length = 30)
    private String targetType;

    @Column(name = "TARGET_ID", length = 40)
    private String targetId;

    @Column(name = "DETAIL", columnDefinition = "TEXT")
    private String detail;

    @Column(name = "CLIENT_IP", length = 45)
    private String clientIp;

    @Column(name = "CREATED_TIME", nullable = false)
    private LocalDateTime createdTime;
}
