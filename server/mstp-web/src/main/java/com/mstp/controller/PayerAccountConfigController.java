package com.mstp.controller;

import com.mstp.model.entity.PayerAccountConfig;
import com.mstp.service.mapping.PayerAccountConfigService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payer-configs")
@RequiredArgsConstructor
@Tag(name = "7. 付款人配置", description = "付款人账户配置管理")
public class PayerAccountConfigController {

    private final PayerAccountConfigService service;

    @GetMapping
    public Page<PayerAccountConfig> search(
            @RequestParam(required = false) String channel,
            @RequestParam(required = false) String paymentChannel,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return service.search(channel, paymentChannel, page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PayerAccountConfig> findById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PayerAccountConfig create(@RequestBody PayerAccountConfig entity) {
        return service.create(entity, "admin");
    }

    @PutMapping("/{id}")
    public ResponseEntity<PayerAccountConfig> update(@PathVariable Long id, @RequestBody PayerAccountConfig entity) {
        return ResponseEntity.ok(service.update(id, entity, "admin"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id, "admin");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/authorize")
    public ResponseEntity<PayerAccountConfig> authorize(@PathVariable Long id) {
        return ResponseEntity.ok(service.authorize(id, "admin"));
    }
}
