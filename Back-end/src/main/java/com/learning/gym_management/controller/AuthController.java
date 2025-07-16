package com.learning.gym_management.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.learning.gym_management.dto.LoginRequest;
import com.learning.gym_management.dto.R;
import com.learning.gym_management.entity.JcuAccountEntity;
import com.learning.gym_management.entity.UsersEntity;
import com.learning.gym_management.mapper.JcuAccountMapper;
import com.learning.gym_management.mapper.UsersMapper;
import com.learning.gym_management.util.JwtUtil;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
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

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JcuAccountMapper jcuAccountMapper;

    @Autowired
    private UsersMapper usersMapper;

    @PostMapping("/login")
    public R login(@RequestBody LoginRequest req) {
        List<JcuAccountEntity> jcuAccountEntityList = jcuAccountMapper.selectList(null);
        JcuAccountEntity jcuAccountEntity = new JcuAccountEntity();
        jcuAccountEntity.setAccountId(req.getUsername());
        jcuAccountEntity.setAccountPassword(req.getPassword());
        // 1. verify the login and password (via the database).
        if (jcuAccountEntityList.contains(jcuAccountEntity)) {
            // 2. login successfully and return token
            String token = jwtUtil.generateToken(req.getUsername());
            Map<String, String> result = new HashMap<>();
            result.put("token", token);
            result.put("accountId", jcuAccountEntity.getAccountId());
            return R.ok(result);
        } else {
            return R.error("用户名或密码错误");
        }
    }
}
