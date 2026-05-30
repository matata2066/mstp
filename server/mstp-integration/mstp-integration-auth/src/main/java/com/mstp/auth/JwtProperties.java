package com.mstp.auth;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "mstp.jwt")
public class JwtProperties {

    private String secret = "mstp-default-jwt-secret-key-that-must-be-at-least-256-bits-long-for-hs256";
    private long accessTokenTtlMinutes = 30;
}
