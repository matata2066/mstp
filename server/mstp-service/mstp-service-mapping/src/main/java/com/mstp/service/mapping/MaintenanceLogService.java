package com.mstp.service.mapping;

import com.mstp.model.entity.ApprovalRecord;
import com.mstp.repository.ApprovalRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MaintenanceLogService {

    private final ApprovalRecordRepository repository;

    public Page<ApprovalRecord> search(String bizType, String status, String makerId, int page, int size) {
        Specification<ApprovalRecord> spec = Specification.where((root, query, cb) -> cb.equal(root.get("isDeleted"), 0));
        if (bizType != null && !bizType.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("bizType"), bizType));
        }
        if (status != null && !status.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }
        if (makerId != null && !makerId.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(root.get("makerId"), "%" + makerId + "%", '\\'));
        }
        return repository.findAll(spec, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedTime")));
    }
}
