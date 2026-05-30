package com.mstp.controller;

import com.mstp.model.entity.AccountMapping;
import com.mstp.service.mapping.AccountMappingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account-mappings")
@RequiredArgsConstructor
public class AccountMappingController {

    private final AccountMappingService service;

    @GetMapping
    public Page<AccountMapping> search(
            @RequestParam(required = false) String accountNo,
            @RequestParam(required = false) String accountName,
            @RequestParam(required = false) String currency,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return service.search(accountNo, accountName, currency, page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountMapping> findById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public AccountMapping create(@RequestBody AccountMapping entity) {
        return service.create(entity, "admin");
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountMapping> update(@PathVariable Long id, @RequestBody AccountMapping entity) {
        return ResponseEntity.ok(service.update(id, entity, "admin"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id, "admin");
        return ResponseEntity.ok().build();
    }
}
