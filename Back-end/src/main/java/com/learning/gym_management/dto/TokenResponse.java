package com.learning.gym_management.dto;

import lombok.Data;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-10 19:17:01
 * @Version: 1.0.0
 * @Description: TODO
 **/
@Data
public class TokenResponse {

    private String token;

    public TokenResponse(String token) {
        this.token = token;
    }

}
