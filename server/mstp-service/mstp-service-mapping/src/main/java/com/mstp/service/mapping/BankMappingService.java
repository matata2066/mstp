package com.mstp.service.mapping;

import com.mstp.model.entity.BankMapping;
import com.mstp.repository.BankMappingRepository;
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
public class BankMappingService {

    private final BankMappingRepository repository;

    public Page<BankMapping> search(String bankCode, String bankName, String codeType, int page, int size) {
        Specification<BankMapping> spec = Specification.where((root, query, cb) -> cb.equal(root.get("isDeleted"), 0));
        if (bankCode != null && !bankCode.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(root.get("bankCode"), "%" + bankCode + "%", '\\'));
        }
        if (bankName != null && !bankName.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(root.get("bankName"), "%" + bankName + "%", '\\'));
        }
        if (codeType != null && !codeType.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("codeType"), codeType));
        }
        return repository.findAll(spec, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedTime")));
    }

    public Optional<BankMapping> findById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public BankMapping create(BankMapping entity, String operator) {
        entity.setId(null);
        entity.setIsDeleted(0);
        entity.setCreatedBy(operator);
        entity.setUpdatedBy(operator);
        entity.setCreatedTime(LocalDateTime.now());
        entity.setUpdatedTime(LocalDateTime.now());
        return repository.save(entity);
    }

    @Transactional
    public BankMapping update(Long id, BankMapping entity, String operator) {
        return repository.findById(id).map(existing -> {
            existing.setBankCode(entity.getBankCode());
            existing.setBankName(entity.getBankName());
            existing.setCodeType(entity.getCodeType());
            existing.setRemark(entity.getRemark());
            existing.setUpdatedBy(operator);
            existing.setUpdatedTime(LocalDateTime.now());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("BankMapping not found: " + id));
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

    public List<BankMapping> findAllActive() {
        return repository.findAll(Specification.where((root, query, cb) -> cb.equal(root.get("isDeleted"), 0)));
    }
}
