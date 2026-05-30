package com.mstp.repository;

import com.mstp.model.entity.BankMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface BankMappingRepository extends JpaRepository<BankMapping, Long>, JpaSpecificationExecutor<BankMapping> {
    List<BankMapping> findByBankCodeAndCodeTypeAndIsDeleted(String bankCode, String codeType, Integer isDeleted);
}
