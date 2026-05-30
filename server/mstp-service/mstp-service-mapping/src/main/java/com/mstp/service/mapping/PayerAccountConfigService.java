package com.mstp.service.mapping;

import com.mstp.model.entity.PayerAccountConfig;
import com.mstp.repository.PayerAccountConfigRepository;
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
public class PayerAccountConfigService {

    private final PayerAccountConfigRepository repository;

    public Page<PayerAccountConfig> search(String channel, String paymentChannel, int page, int size) {
        Specification<PayerAccountConfig> spec = Specification.where((root, query, cb) -> cb.equal(root.get("isDeleted"), 0));
        if (channel != null && !channel.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("channel"), channel));
        }
        if (paymentChannel != null && !paymentChannel.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("currency"), paymentChannel));
        }
        return repository.findAll(spec, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedTime")));
    }

    public Optional<PayerAccountConfig> findById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public PayerAccountConfig create(PayerAccountConfig entity, String operator) {
        entity.setId(null);
        entity.setIsDeleted(0);
        entity.setIsAuthorized(0);
        entity.setCreatedBy(operator);
        entity.setUpdatedBy(operator);
        entity.setCreatedTime(LocalDateTime.now());
        entity.setUpdatedTime(LocalDateTime.now());
        return repository.save(entity);
    }

    @Transactional
    public PayerAccountConfig update(Long id, PayerAccountConfig entity, String operator) {
        return repository.findById(id).map(existing -> {
            existing.setChannel(entity.getChannel());
            existing.setPayerBankCode(entity.getPayerBankCode());
            existing.setPayerBankName(entity.getPayerBankName());
            existing.setPayerAccountNo(entity.getPayerAccountNo());
            existing.setPayerAccountName(entity.getPayerAccountName());
            existing.setCurrency(entity.getCurrency());
            existing.setRemark(entity.getRemark());
            existing.setUpdatedBy(operator);
            existing.setUpdatedTime(LocalDateTime.now());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("PayerAccountConfig not found: " + id));
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

    public List<PayerAccountConfig> findAllActive() {
        return repository.findAll(Specification.where((root, query, cb) -> cb.equal(root.get("isDeleted"), 0)));
    }

    @Transactional
    public PayerAccountConfig authorize(Long id, String operator) {
        return repository.findById(id).map(existing -> {
            existing.setIsAuthorized(1);
            existing.setAuthorizedTime(LocalDateTime.now());
            existing.setUpdatedBy(operator);
            existing.setUpdatedTime(LocalDateTime.now());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("PayerAccountConfig not found: " + id));
    }
}
