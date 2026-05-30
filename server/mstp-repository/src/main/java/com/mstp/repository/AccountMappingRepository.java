package com.mstp.repository;

import com.mstp.model.entity.AccountMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface AccountMappingRepository extends JpaRepository<AccountMapping, Long>, JpaSpecificationExecutor<AccountMapping> {
    List<AccountMapping> findByIsDeleted(Integer isDeleted);
    List<AccountMapping> findByAccountNoAndIsDeleted(String accountNo, Integer isDeleted);
}
