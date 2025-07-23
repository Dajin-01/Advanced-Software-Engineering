package com.learning.gym_management.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-07-16 11:53:47
 * @Version: 1.0.0
 * @Description: TODO
 **/
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // ✅ 本地和线上前端地址都加入
                .allowedOrigins(
                        "http://localhost:63342"
                        // "https://www.yourfrontend.com" // 替换成你正式前端部署地址
                )
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600); // 预检请求缓存时间（单位秒）
    }
}
