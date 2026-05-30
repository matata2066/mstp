package com.mstp.service.mapping;

import com.mstp.model.entity.RemarkMapping;
import com.mstp.repository.RemarkMappingRepository;
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
public class RemarkMappingService {

    private final RemarkMappingRepository repository;

    public Page<RemarkMapping> search(String matchPattern, String remarkChinese, int page, int size) {
        Specification<RemarkMapping> spec = Specification.where((root, query, cb) -> cb.equal(root.get("isDeleted"), 0));
        if (matchPattern != null && !matchPattern.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("matchPattern"), matchPattern));
        }
        if (remarkChinese != null && !remarkChinese.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(root.get("remarkChinese"), "%" + remarkChinese + "%", '\\'));
        }
        return repository.findAll(spec, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedTime")));
    }

    public Optional<RemarkMapping> findById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public RemarkMapping create(RemarkMapping entity, String operator) {
        entity.setId(null);
        entity.setIsDeleted(0);
        entity.setCreatedBy(operator);
        entity.setUpdatedBy(operator);
        entity.setCreatedTime(LocalDateTime.now());
        entity.setUpdatedTime(LocalDateTime.now());
        return repository.save(entity);
    }

    @Transactional
    public RemarkMapping update(Long id, RemarkMapping entity, String operator) {
        return repository.findById(id).map(existing -> {
            existing.setMatchPattern(entity.getMatchPattern());
            existing.setRemarkChinese(entity.getRemarkChinese());
            existing.setRemark(entity.getRemark());
            existing.setUpdatedBy(operator);
            existing.setUpdatedTime(LocalDateTime.now());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("RemarkMapping not found: " + id));
    }

    @Transactional
    public void delete(Long id, String operator) {
        repository.findById(id).ifPresent(existing -> {
            existing.setIsDeleted(1);
            existing.setUpdatedBy(operator);
            existing.setUpdatedTime(LocalDateTime.now());
            repository.save(existing);
        });
    }

    public List<RemarkMapping> findAllActive() {
        return repository.findAll(Specification.where((root, query, cb) -> cb.equal(root.get("isDeleted"), 0)));
    }
}
