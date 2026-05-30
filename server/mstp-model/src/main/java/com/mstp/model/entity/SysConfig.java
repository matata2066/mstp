package com.mstp.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "MSTP_SYS_CONFIG")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SysConfig {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "CONFIG_KEY", nullable = false, length = 100)
    private String configKey;

    @Column(name = "CONFIG_VALUE", nullable = false, length = 500)
    private String configValue;

    @Column(name = "CONFIG_GROUP", nullable = false, length = 50)
    private String configGroup;

    @Column(name = "DESCRIPTION", length = 200)
    private String description;

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
