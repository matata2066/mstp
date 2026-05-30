package com.mstp.repository;

import com.mstp.model.entity.PaymentInstruction;
import com.mstp.model.entity.PaymentInstructionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface PaymentInstructionRepository extends JpaRepository<PaymentInstruction, PaymentInstructionId>, JpaSpecificationExecutor<PaymentInstruction> {
    Optional<PaymentInstruction> findByTxnId(String txnId);
    List<PaymentInstruction> findByStatus(String status);
}
