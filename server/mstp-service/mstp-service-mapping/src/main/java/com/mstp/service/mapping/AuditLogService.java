package com.mstp.service.mapping;

import com.mstp.model.entity.AuditLog;
import com.mstp.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository repository;

    public Page<AuditLog> search(String userId, String module, String action, int page, int size) {
        Specification<AuditLog> spec = Specification.where(null);
        if (userId != null && !userId.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("userId"), userId));
        }
        if (module != null && !module.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("module"), module));
        }
        if (action != null && !action.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("action"), action));
        }
        return repository.findAll(spec, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")));
    }

    @Transactional
    public AuditLog create(AuditLog entity) {
        entity.setId(null);
        return repository.save(entity);
    }
}
