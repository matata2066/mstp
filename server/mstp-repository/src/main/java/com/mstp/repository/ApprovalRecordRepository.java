package com.mstp.repository;

import com.mstp.model.entity.ApprovalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface ApprovalRecordRepository extends JpaRepository<ApprovalRecord, Long>, JpaSpecificationExecutor<ApprovalRecord> {
    Optional<ApprovalRecord> findByApprovalId(String approvalId);
    List<ApprovalRecord> findByStatus(String status);
    List<ApprovalRecord> findByBizTypeAndStatus(String bizType, String status);
}
