package com.mstp.controller;

import com.mstp.model.entity.ApprovalRecord;
import com.mstp.service.approval.ApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/maintenance-logs")
@RequiredArgsConstructor
public class MaintenanceLogController {

    private final ApprovalService service;

    @GetMapping
    public Page<ApprovalRecord> search(
            @RequestParam(required = false) String bizType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String makerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        String effectiveStatus = (status != null && !status.isBlank()) ? status : "APPROVED";
        return service.search(bizType, effectiveStatus, makerId, page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApprovalRecord> findById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
