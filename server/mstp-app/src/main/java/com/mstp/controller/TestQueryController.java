package com.mstp.controller;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@ConditionalOnProperty(name = "mstp.test-endpoint.enabled", havingValue = "true", matchIfMissing = true)
public class TestQueryController {

    private final JdbcTemplate jdbcTemplate;

    public TestQueryController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/query")
    public Map<String, Object> query(@RequestParam String sql) {
        if (sql.trim().toUpperCase().startsWith("SELECT") ||
            sql.trim().toUpperCase().startsWith("WITH")) {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            return Map.of("rows", rows, "count", rows.size());
        }
        return Map.of("error", "Only SELECT queries are allowed");
    }

    @GetMapping("/tables")
    public List<Map<String, Object>> tables() {
        return jdbcTemplate.queryForList(
            "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'PUBLIC' ORDER BY TABLE_NAME"
        );
    }

    @GetMapping("/count")
    public Map<String, Object> count(@RequestParam String table) {
        Integer cnt = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + table, Integer.class);
        return Map.of("table", table, "count", cnt);
    }
}
