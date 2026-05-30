package com.mstp.service.mapping;

import com.mstp.model.entity.AccountMapping;
import com.mstp.repository.AccountMappingRepository;
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
public class AccountMappingService {

    private final AccountMappingRepository repository;

    public Page<AccountMapping> search(String accountNo, String accountName, String currency, int page, int size) {
        Specification<AccountMapping> spec = Specification.where((root, query, cb) -> cb.equal(root.get("isDeleted"), 0));
        if (accountNo != null && !accountNo.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(root.get("accountNo"), "%" + accountNo + "%", '\\'));
        }
        if (accountName != null && !accountName.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(root.get("accountName"), "%" + accountName + "%", '\\'));
        }
        if (currency != null && !currency.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("currency"), currency));
        }
        return repository.findAll(spec, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedTime")));
    }

    public Optional<AccountMapping> findById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public AccountMapping create(AccountMapping entity, String operator) {
        entity.setId(null);
        entity.setIsDeleted(0);
        entity.setCreatedBy(operator);
        entity.setUpdatedBy(operator);
        entity.setCreatedTime(LocalDateTime.now());
        entity.setUpdatedTime(LocalDateTime.now());
        return repository.save(entity);
    }

    @Transactional
    public AccountMapping update(Long id, AccountMapping entity, String operator) {
        return repository.findById(id).map(existing -> {
            existing.setAccountNo(entity.getAccountNo());
            existing.setAccountName(entity.getAccountName());
            existing.setCurrency(entity.getCurrency());
            existing.setAccountType(entity.getAccountType());
            existing.setRemark(entity.getRemark());
            existing.setUpdatedBy(operator);
            existing.setUpdatedTime(LocalDateTime.now());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("AccountMapping not found: " + id));
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

    public List<AccountMapping> findAllActive() {
        return repository.findByIsDeleted(0);
    }
}
