package com.mstp.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "MSTP_API_CLIENT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiClient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "CLIENT_ID", nullable = false, length = 50, unique = true)
    private String clientId;

    @Column(name = "CLIENT_SECRET_HASH", nullable = false, length = 100)
    private String clientSecretHash;

    @Column(name = "CLIENT_NAME", length = 100)
    private String clientName;

    @Column(name = "STATUS", nullable = false, length = 10)
    private String status;

    @Column(name = "IS_DELETED", nullable = false)
    @Builder.Default
    private Short isDeleted = 0;

    @Column(name = "CREATED_BY", nullable = false, length = 50)
    private String createdBy;

    @Column(name = "CREATED_TIME", nullable = false)
    private LocalDateTime createdTime;

    @Column(name = "UPDATED_BY", nullable = false, length = 50)
    private String updatedBy;

    @Column(name = "UPDATED_TIME", nullable = false)
    private LocalDateTime updatedTime;
}
