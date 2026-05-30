package com.mstp.repository;

import com.mstp.model.entity.SysConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SysConfigRepository extends JpaRepository<SysConfig, Long> {
    List<SysConfig> findByConfigKeyAndIsDeleted(String configKey, Integer isDeleted);
}
