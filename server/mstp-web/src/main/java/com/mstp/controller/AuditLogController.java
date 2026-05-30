package com.mstp.controller;

import com.mstp.model.entity.AuditLog;
import com.mstp.service.mapping.AuditLogService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
@Tag(name = "8. 审计日志", description = "系统审计日志查询")
public class AuditLogController {

    private final AuditLogService service;

    @GetMapping
    public Page<AuditLog> search(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String module,
            @RequestParam(required = false) String action,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return service.search(userId, module, action, page, size);
    }
}
