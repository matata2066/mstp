package com.mstp.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "MSTP_MESSAGE_EXCEPTION")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MessageException {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "MSG_ID", nullable = false, length = 64)
    private String msgId;

    @Column(name = "RAW_PAYLOAD", nullable = false, columnDefinition = "TEXT")
    private String rawPayload;

    @Column(name = "EXCEPTION_TYPE", nullable = false, length = 20)
    private String exceptionType;

    @Column(name = "ERROR_MESSAGE", nullable = false, length = 500)
    private String errorMessage;

    @Column(name = "STATUS", nullable = false, length = 10)
    private String status;

    @Column(name = "RESOLVED_BY", length = 50)
    private String resolvedBy;

    @Column(name = "RESOLVED_TIME")
    private LocalDateTime resolvedTime;

    @Column(name = "CREATED_TIME", nullable = false)
    private LocalDateTime createdTime;
}
