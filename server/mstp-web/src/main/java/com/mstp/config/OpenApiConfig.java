package com.mstp.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MSTP API")
                        .description("多渠道支付中间平台 API")
                        .version("1.0.0"))
                .tags(List.of(
                        new Tag().name("1. 认证管理").description("JWT Token 获取与身份认证"),
                        new Tag().name("2. 审批管理").description("待审批指令查询与审批操作"),
                        new Tag().name("3. 付款指令").description("付款指令查询与状态管理"),
                        new Tag().name("4. 账户映射").description("账户映射配置管理"),
                        new Tag().name("5. 银行映射").description("银行映射配置管理"),
                        new Tag().name("6. 摘要映射").description("摘要映射配置管理"),
                        new Tag().name("7. 付款人配置").description("付款人账户配置管理"),
                        new Tag().name("8. 审计日志").description("系统审计日志查询"),
                        new Tag().name("9. 维护日志").description("维护操作日志查询")
                ))
                .addSecurityItem(new SecurityRequirement().addList("BearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("BearerAuth", new SecurityScheme()
                                .name("BearerAuth")
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("先调用 POST /api/auth/token 获取 JWT Token，然后在此处填入")));
    }
}
