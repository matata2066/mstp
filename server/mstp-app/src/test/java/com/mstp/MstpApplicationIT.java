package com.mstp;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.*;

class MstpApplicationIT extends BaseIntegrationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void contextLoads() {
        assertNotNull(jdbcTemplate);
    }

    @Test
    void canQueryDatabase() {
        Integer result = jdbcTemplate.queryForObject("SELECT 1 FROM DUAL", Integer.class);
        assertEquals(1, result);
    }
}
