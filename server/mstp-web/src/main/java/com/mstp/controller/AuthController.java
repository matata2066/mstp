package com.mstp.controller;

import com.mstp.auth.JwtTokenProvider;
import com.mstp.model.entity.ApiClient;
import com.mstp.repository.ApiClientRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "1. 认证管理", description = "JWT Token 获取与身份认证")
public class AuthController {

    private final ApiClientRepository apiClientRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @SecurityRequirements
    @PostMapping("/token")
    @Operation(summary = "获取访问令牌", description = "通过 clientId 和 clientSecret 换取 JWT 访问令牌")
    public ResponseEntity<?> issueToken(
            @Parameter(description = "客户端ID", example = "mstp-web")
            @RequestParam String clientId,
            @Parameter(description = "客户端密钥", example = "mstp-web-secret")
            @RequestParam String clientSecret) {

        if (clientId == null || clientId.isBlank() || clientSecret == null || clientSecret.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "INVALID_REQUEST", "message", "clientId and clientSecret are required"));
        }

        ApiClient client = apiClientRepository
                .findByClientIdAndIsDeleted(clientId, (short) 0)
                .orElse(null);

        if (client == null || !"ACTIVE".equals(client.getStatus())) {
            log.warn("Authentication failed: client not found or inactive, clientId={}", clientId);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "INVALID_CLIENT", "message", "Invalid client credentials"));
        }

        if (!passwordEncoder.matches(clientSecret, client.getClientSecretHash())) {
            log.warn("Authentication failed: secret mismatch, clientId={}", clientId);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "INVALID_CLIENT", "message", "Invalid client credentials"));
        }

        String token = jwtTokenProvider.generateToken(clientId);
        log.info("Token issued for clientId={}", clientId);

        return ResponseEntity.ok(Map.of(
                "accessToken", token,
                "tokenType", "Bearer",
                "expiresIn", jwtTokenProvider.getAccessTokenTtlSeconds()
        ));
    }
}
