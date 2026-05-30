package com.mstp.repository;

import com.mstp.model.entity.PaymentStatusLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentStatusLogRepository extends JpaRepository<PaymentStatusLog, Long> {
    List<PaymentStatusLog> findByTxnIdOrderByStatusTimeDesc(String txnId);
}
