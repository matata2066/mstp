package com.mstp.repository;

import com.mstp.model.entity.RemarkMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface RemarkMappingRepository extends JpaRepository<RemarkMapping, Long>, JpaSpecificationExecutor<RemarkMapping> {
    List<RemarkMapping> findByMatchPatternAndIsDeleted(String matchPattern, Integer isDeleted);
}
