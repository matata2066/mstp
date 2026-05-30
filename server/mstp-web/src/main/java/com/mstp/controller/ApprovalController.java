package com.mstp.controller;

import com.mstp.model.entity.ApprovalRecord;
import com.mstp.service.approval.ApprovalService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
@Tag(name = "2. 审批管理", description = "待审批指令查询与审批操作")
public class ApprovalController {

    private final ApprovalService service;

    @GetMapping
    public Page<ApprovalRecord> search(
            @RequestParam(required = false) String bizType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String makerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return service.search(bizType, status, makerId, page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApprovalRecord> findById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/submit")
    public ApprovalRecord submit(@RequestBody Map<String, Object> body) {
        String bizType = (String) body.get("bizType");
        String operationType = (String) body.get("operationType");
        Long bizId = body.get("bizId") != null ? Long.valueOf(body.get("bizId").toString()) : null;
        Object operationData = body.get("operationData");
        String makerId = (String) body.getOrDefault("makerId", "admin");
        return service.submitApproval(bizType, operationType, bizId, operationData, makerId);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApprovalRecord> approve(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(service.approve(id, body.get("checkerId")));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApprovalRecord> reject(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(service.reject(id, body.get("checkerId"), body.get("reason")));
    }
}
