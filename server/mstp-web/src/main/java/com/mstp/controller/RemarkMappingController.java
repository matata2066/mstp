package com.mstp.controller;

import com.mstp.model.entity.RemarkMapping;
import com.mstp.service.mapping.RemarkMappingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/remark-mappings")
@RequiredArgsConstructor
public class RemarkMappingController {

    private final RemarkMappingService service;

    @GetMapping
    public Page<RemarkMapping> search(
            @RequestParam(required = false) String matchPattern,
            @RequestParam(required = false) String remarkChinese,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return service.search(matchPattern, remarkChinese, page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RemarkMapping> findById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public RemarkMapping create(@RequestBody RemarkMapping entity) {
        return service.create(entity, "admin");
    }

    @PutMapping("/{id}")
    public ResponseEntity<RemarkMapping> update(@PathVariable Long id, @RequestBody RemarkMapping entity) {
        return ResponseEntity.ok(service.update(id, entity, "admin"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id, "admin");
        return ResponseEntity.ok().build();
    }
}
