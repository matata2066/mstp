package com.mstp.repository;

import com.mstp.model.entity.MessageException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageExceptionRepository extends JpaRepository<MessageException, Long> {
    List<MessageException> findByStatus(String status);
}
