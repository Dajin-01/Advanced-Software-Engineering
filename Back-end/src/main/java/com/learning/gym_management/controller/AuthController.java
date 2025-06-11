package com.learning.gym_management.controller;

import com.learning.gym_management.dto.LoginRequest;
import com.learning.gym_management.dto.R;
import com.learning.gym_management.util.JwtUtil;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-10 19:12:51
 * @Version: 1.0.0
 * @Description:
 **/
@RestController
@RequestMapping("/api/auth")
@Api(tags = "Auth")
public class AuthController {

    private final Map<String, String> usersMap = new HashMap<String, String>() {{
        put("jd100001", "123456");
    }};

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public R login(@RequestBody LoginRequest req) {
        // 1. 验证用户名和密码（此处用简单示例，实际应接数据库验证）
        if (usersMap.containsKey(req.getUsername()) && usersMap.get(req.getUsername()).equals(req.getPassword())) {
            // 2. 登录成功，生成 JWT
            String token = jwtUtil.generateToken(req.getUsername());
            Map<String, String> result = new HashMap<>();
            result.put("token", token);
            return R.ok(result);
        } else {
            return R.error("用户名或密码错误");
        }
    }
}
