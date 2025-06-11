package com.learning.gym_management.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-10 19:12:00
 * @Version: 1.0.0
 * @Description:
 **/
@Component
public class JwtUtil {

    // 固定的安全密钥（32字节及以上），可以用 Base64 编码生成更安全的版本
    private static final String SECRET = "mySuperSecureAndLongEnoughSecretKey123456";
    // private final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes());
    // private final long EXPIRATION = 1000L * 60 * 60 * 24 * 365; // 1 year
    // 生成不含过期时间的 token
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date()) // 设置签发时间
                // .setExpiration(...) 不设置过期时间 = 永久有效
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
