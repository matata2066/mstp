package com.mstp.service.payment;

import com.mstp.model.entity.PaymentInstruction;
import com.mstp.model.entity.PaymentInstructionId;
import com.mstp.model.entity.PaymentStatusLog;
import com.mstp.repository.PaymentInstructionRepository;
import com.mstp.repository.PaymentStatusLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentInstructionService {

    private final PaymentInstructionRepository repository;
    private final PaymentStatusLogRepository statusLogRepository;

    public Page<PaymentInstruction> search(String txnId, String payeeAccountNo, String channel, String status, int page, int size) {
        Specification<PaymentInstruction> spec = Specification.where((root, query, cb) -> cb.equal(root.get("isDeleted"), 0));
        if (txnId != null && !txnId.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(root.get("txnId"), "%" + txnId + "%", '\\'));
        }
        if (payeeAccountNo != null && !payeeAccountNo.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(root.get("payeeAccountNo"), "%" + payeeAccountNo + "%", '\\'));
        }
        if (channel != null && !channel.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("channel"), channel));
        }
        if (status != null && !status.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }
        return repository.findAll(spec, PageRequest.of(page, size, Sort.by(
                Sort.Order.desc("valueDate"),
                Sort.Order.desc("createdTime")
        )));
    }

    public Optional<PaymentInstruction> findById(PaymentInstructionId id) {
        return repository.findById(id);
    }

    public Optional<PaymentInstruction> findByTxnId(String txnId) {
        return repository.findByTxnId(txnId);
    }

    @Transactional
    public PaymentInstruction retry(String txnId, String operator) {
        return repository.findByTxnId(txnId).map(existing -> {
            if (!"VALIDATING_FAILED".equals(existing.getStatus())) {
                throw new RuntimeException("Cannot retry payment with status: " + existing.getStatus());
            }
            existing.setStatus("VALIDATING");
            existing.setRetryCount(existing.getRetryCount() + 1);
            existing.setUpdatedBy(operator);
            existing.setUpdatedTime(LocalDateTime.now());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("PaymentInstruction not found: " + txnId));
    }

    public List<PaymentStatusLog> getStatusLogs(String txnId) {
        return statusLogRepository.findByTxnIdOrderByStatusTimeDesc(txnId);
    }
}
