package com.mstp.controller;

import com.mstp.model.entity.PaymentInstruction;
import com.mstp.model.entity.PaymentInstructionId;
import com.mstp.model.entity.PaymentStatusLog;
import com.mstp.service.payment.PaymentInstructionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/payment-instructions")
@RequiredArgsConstructor
public class PaymentInstructionController {

    private final PaymentInstructionService service;

    @GetMapping
    public Page<PaymentInstruction> search(
            @RequestParam(required = false) String txnId,
            @RequestParam(required = false) String payeeAccountNo,
            @RequestParam(required = false) String channel,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return service.search(txnId, payeeAccountNo, channel, status, page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentInstruction> findById(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdTime) {
        PaymentInstructionId pid = new PaymentInstructionId(id, createdTime);
        return service.findById(pid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/txn/{txnId}")
    public ResponseEntity<PaymentInstruction> findByTxnId(@PathVariable String txnId) {
        return service.findByTxnId(txnId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/txn/{txnId}/retry")
    public ResponseEntity<PaymentInstruction> retry(@PathVariable String txnId) {
        return ResponseEntity.ok(service.retry(txnId, "admin"));
    }

    @GetMapping("/txn/{txnId}/status-logs")
    public List<PaymentStatusLog> getStatusLogs(@PathVariable String txnId) {
        return service.getStatusLogs(txnId);
    }
}
