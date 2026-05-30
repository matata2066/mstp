package com.mstp.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "MSTP_REMARK_MAPPING")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RemarkMapping {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "MATCH_PATTERN", nullable = false, length = 100)
    private String matchPattern;

    @Column(name = "REMARK_CHINESE", nullable = false, length = 200)
    private String remarkChinese;

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
