package com.mstp.model.entity;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode
public class PaymentInstructionId implements Serializable {
    private Long id;
    private LocalDateTime createdTime;
}
