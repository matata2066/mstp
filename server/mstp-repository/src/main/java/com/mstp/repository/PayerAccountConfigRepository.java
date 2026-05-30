package com.mstp.repository;

import com.mstp.model.entity.PayerAccountConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface PayerAccountConfigRepository extends JpaRepository<PayerAccountConfig, Long>, JpaSpecificationExecutor<PayerAccountConfig> {
    List<PayerAccountConfig> findByChannelAndCurrencyAndIsDeleted(String channel, String currency, Integer isDeleted);
}
