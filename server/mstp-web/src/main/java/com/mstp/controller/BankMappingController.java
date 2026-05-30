package com.mstp.controller;

import com.mstp.model.entity.BankMapping;
import com.mstp.service.mapping.BankMappingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bank-mappings")
@RequiredArgsConstructor
@Tag(name = "5. 银行映射", description = "银行映射配置管理")
public class BankMappingController {

    private final BankMappingService service;

    @GetMapping
    public Page<BankMapping> search(
            @RequestParam(required = false) String bankCode,
            @RequestParam(required = false) String bankName,
            @RequestParam(required = false) String codeType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return service.search(bankCode, bankName, codeType, page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BankMapping> findById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public BankMapping create(@RequestBody BankMapping entity) {
        return service.create(entity, "admin");
    }

    @PutMapping("/{id}")
    public ResponseEntity<BankMapping> update(@PathVariable Long id, @RequestBody BankMapping entity) {
        return ResponseEntity.ok(service.update(id, entity, "admin"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id, "admin");
        return ResponseEntity.ok().build();
    }
}
