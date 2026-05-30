package com.mstp.service.approval;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mstp.model.entity.*;
import com.mstp.repository.ApprovalRecordRepository;
import com.mstp.service.mapping.AccountMappingService;
import com.mstp.service.mapping.BankMappingService;
import com.mstp.service.mapping.PayerAccountConfigService;
import com.mstp.service.mapping.RemarkMappingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApprovalService {

    private final ApprovalRecordRepository repository;
    private final AccountMappingService accountMappingService;
    private final BankMappingService bankMappingService;
    private final RemarkMappingService remarkMappingService;
    private final PayerAccountConfigService payerAccountConfigService;
    private final ObjectMapper objectMapper;

    public Page<ApprovalRecord> search(String bizType, String status, String makerId, int page, int size) {
        return search(bizType, status, makerId, page, size, null);
    }

    public Page<ApprovalRecord> search(String bizType, String status, String makerId, int page, int size, String excludeStatus) {
        Specification<ApprovalRecord> spec = Specification.where((root, query, cb) -> cb.equal(root.get("isDeleted"), 0));
        if (excludeStatus != null && !excludeStatus.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.notEqual(root.get("status"), excludeStatus));
        }
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

    public Optional<ApprovalRecord> findById(Long id) {
        return repository.findById(id);
    }

    public Optional<ApprovalRecord> findByApprovalId(String approvalId) {
        return repository.findByApprovalId(approvalId);
    }

    @Transactional
    public ApprovalRecord submitApproval(String bizType, String operationType, Long bizId,
                                          Object operationData, String makerId) {
        String approvalId = "APR" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + String.format("%04d", (int) (Math.random() * 10000));
        String jsonData;
        try {
            jsonData = objectMapper.writeValueAsString(operationData);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize operation data", e);
        }

        String originalDataJson = null;
        if (("DELETE".equals(operationType) || "UPDATE".equals(operationType)) && bizId != null) {
            originalDataJson = fetchOriginalData(bizType, bizId);
        }

        ApprovalRecord record = ApprovalRecord.builder()
                .approvalId(approvalId)
                .bizType(bizType)
                .bizId(bizId != null ? bizId : 0L)
                .operationType(operationType)
                .operationData(jsonData)
                .originalData(originalDataJson)
                .status("PENDING")
                .makerId(makerId)
                .makerTime(LocalDateTime.now())
                .isDeleted(0)
                .createdBy(makerId)
                .createdTime(LocalDateTime.now())
                .updatedBy(makerId)
                .updatedTime(LocalDateTime.now())
                .build();
        return repository.save(record);
    }

    private String fetchOriginalData(String bizType, Long bizId) {
        try {
            Object original = null;
            switch (bizType) {
                case "ACCOUNT_MAPPING":
                    original = accountMappingService.findById(bizId).orElse(null);
                    break;
                case "BANK_MAPPING":
                    original = bankMappingService.findById(bizId).orElse(null);
                    break;
                case "REMARK_MAPPING":
                    original = remarkMappingService.findById(bizId).orElse(null);
                    break;
                case "PAYER_CONFIG":
                    original = payerAccountConfigService.findById(bizId).orElse(null);
                    break;
            }
            if (original != null) {
                return objectMapper.writeValueAsString(original);
            }
        } catch (Exception e) {
            log.warn("Failed to fetch original data for bizType={}, bizId={}", bizType, bizId, e);
        }
        return null;
    }

    @Transactional
    public ApprovalRecord approve(Long id, String checkerId) {
        return repository.findById(id).map(existing -> {
            existing.setStatus("APPROVED");
            existing.setCheckerId(checkerId);
            existing.setCheckerTime(LocalDateTime.now());
            executeApprovedOperation(existing);
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("ApprovalRecord not found: " + id));
    }

    @Transactional
    public ApprovalRecord reject(Long id, String checkerId, String reason) {
        return repository.findById(id).map(existing -> {
            existing.setStatus("REJECTED");
            existing.setCheckerId(checkerId);
            existing.setCheckerTime(LocalDateTime.now());
            existing.setRejectReason(reason);
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("ApprovalRecord not found: " + id));
    }

    @SuppressWarnings("unchecked")
    private void executeApprovedOperation(ApprovalRecord record) {
        try {
            Map<String, Object> data = objectMapper.readValue(record.getOperationData(), Map.class);
            String bizType = record.getBizType();
            String opType = record.getOperationType();
            Long bizId = record.getBizId();
            String operator = record.getMakerId();

            switch (bizType) {
                case "ACCOUNT_MAPPING":
                    executeAccountMapping(opType, bizId, data, operator);
                    break;
                case "BANK_MAPPING":
                    executeBankMapping(opType, bizId, data, operator);
                    break;
                case "REMARK_MAPPING":
                    executeRemarkMapping(opType, bizId, data, operator);
                    break;
                case "PAYER_CONFIG":
                    executePayerConfig(opType, bizId, data, operator);
                    break;
                default:
                    log.warn("Unknown bizType: {}", bizType);
            }
        } catch (Exception e) {
            log.error("Failed to execute approved operation for record {}", record.getId(), e);
            throw new RuntimeException("Failed to execute approved operation: " + e.getMessage(), e);
        }
    }

    private void executeAccountMapping(String opType, Long bizId, Map<String, Object> data, String operator) {
        switch (opType) {
            case "CREATE":
                AccountMapping am = new AccountMapping();
                am.setAccountNo((String) data.get("accountNo"));
                am.setAccountName((String) data.get("accountName"));
                am.setCurrency((String) data.get("currency"));
                am.setAccountType((String) data.get("accountType"));
                am.setRemark((String) data.get("remark"));
                accountMappingService.create(am, operator);
                break;
            case "UPDATE":
                AccountMapping amUpdate = new AccountMapping();
                amUpdate.setAccountNo((String) data.get("accountNo"));
                amUpdate.setAccountName((String) data.get("accountName"));
                amUpdate.setCurrency((String) data.get("currency"));
                amUpdate.setAccountType((String) data.get("accountType"));
                amUpdate.setRemark((String) data.get("remark"));
                accountMappingService.update(bizId, amUpdate, operator);
                break;
            case "DELETE":
                accountMappingService.delete(bizId, operator);
                break;
        }
    }

    private void executeBankMapping(String opType, Long bizId, Map<String, Object> data, String operator) {
        switch (opType) {
            case "CREATE":
                BankMapping bm = new BankMapping();
                bm.setBankCode((String) data.get("bankCode"));
                bm.setBankName((String) data.get("bankName"));
                bm.setCodeType((String) data.get("codeType"));
                bm.setRemark((String) data.get("remark"));
                bankMappingService.create(bm, operator);
                break;
            case "UPDATE":
                BankMapping bmUpdate = new BankMapping();
                bmUpdate.setBankCode((String) data.get("bankCode"));
                bmUpdate.setBankName((String) data.get("bankName"));
                bmUpdate.setCodeType((String) data.get("codeType"));
                bmUpdate.setRemark((String) data.get("remark"));
                bankMappingService.update(bizId, bmUpdate, operator);
                break;
            case "DELETE":
                bankMappingService.delete(bizId, operator);
                break;
        }
    }

    private void executeRemarkMapping(String opType, Long bizId, Map<String, Object> data, String operator) {
        switch (opType) {
            case "CREATE":
                RemarkMapping rm = new RemarkMapping();
                rm.setMatchPattern((String) data.get("matchPattern"));
                rm.setRemarkChinese((String) data.get("remarkChinese"));
                rm.setRemark((String) data.get("remark"));
                remarkMappingService.create(rm, operator);
                break;
            case "UPDATE":
                RemarkMapping rmUpdate = new RemarkMapping();
                rmUpdate.setMatchPattern((String) data.get("matchPattern"));
                rmUpdate.setRemarkChinese((String) data.get("remarkChinese"));
                rmUpdate.setRemark((String) data.get("remark"));
                remarkMappingService.update(bizId, rmUpdate, operator);
                break;
            case "DELETE":
                remarkMappingService.delete(bizId, operator);
                break;
        }
    }

    private void executePayerConfig(String opType, Long bizId, Map<String, Object> data, String operator) {
        switch (opType) {
            case "CREATE":
                PayerAccountConfig pc = new PayerAccountConfig();
                pc.setChannel((String) data.get("channel"));
                pc.setPayerBankCode((String) data.get("payerBankCode"));
                pc.setPayerBankName((String) data.get("payerBankName"));
                pc.setPayerAccountNo((String) data.get("payerAccountNo"));
                pc.setPayerAccountName((String) data.get("payerAccountName"));
                pc.setCurrency((String) data.get("currency"));
                pc.setRemark((String) data.get("remark"));
                payerAccountConfigService.create(pc, operator);
                break;
            case "UPDATE":
                PayerAccountConfig pcUpdate = new PayerAccountConfig();
                pcUpdate.setChannel((String) data.get("channel"));
                pcUpdate.setPayerBankCode((String) data.get("payerBankCode"));
                pcUpdate.setPayerBankName((String) data.get("payerBankName"));
                pcUpdate.setPayerAccountNo((String) data.get("payerAccountNo"));
                pcUpdate.setPayerAccountName((String) data.get("payerAccountName"));
                pcUpdate.setCurrency((String) data.get("currency"));
                pcUpdate.setRemark((String) data.get("remark"));
                payerAccountConfigService.update(bizId, pcUpdate, operator);
                break;
            case "DELETE":
                payerAccountConfigService.delete(bizId, operator);
                break;
        }
    }
}
