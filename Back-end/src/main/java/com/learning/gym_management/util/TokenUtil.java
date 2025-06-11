package com.learning.gym_management.util;

import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.learning.gym_management.exception.BusinessCommonException;
import org.apache.logging.log4j.util.Strings;
import org.springframework.security.jwt.Jwt;
import org.springframework.security.jwt.JwtHelper;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;

/**
 * @Description: 解析token工具类
 * @Author: wugangzhi
 * @CreateDate: 2021/9/30 10:37
 * @Version: 1.0
 * Copyright (c) 2021,武汉中地云申科技有限公司
 * All rights reserved.
 **/
public final class TokenUtil {

    /**
     * 根据token 获取用户账户名信息
     * @param token
     * @return
     */
    public final static String getUnameByToken(String token) {
        if (token.startsWith("Bearer")) {
            token = token.substring(6).trim();
        }

        Jwt jwtToken = JwtHelper.decode(token);

        String claims = jwtToken.getClaims();
        try {
            HashMap claimsMap = new ObjectMapper().readValue(claims, HashMap.class);
            return (String) claimsMap.get("user_name");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }

    /**
     * 根据token 获取用户ID
     * @param token
     * @return
     */
    public final static String getUidByToken(String token) {
        if (token.startsWith("Bearer")) {
            token = token.substring(6).trim();
        }

        Jwt jwtToken = JwtHelper.decode(token);

        String claims = jwtToken.getClaims();
        try {
            HashMap claimsMap = new ObjectMapper().readValue(claims, HashMap.class);
            return (String) claimsMap.get("uid");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }

    /**
     * 根据token 获取用户真实姓名
     * @param token
     * @return
     */
    public final static String getNameByToken(String token) {
        if (token.startsWith("Bearer")) {
            token = token.substring(6).trim();
        }

        Jwt jwtToken = JwtHelper.decode(token);

        String claims = jwtToken.getClaims();
        try {
            HashMap claimsMap = new ObjectMapper().readValue(claims, HashMap.class);
            return (String) claimsMap.get("name");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }


    /**
     * 根据token 获取用户账户名信息
     * @param
     * @return
     */
    public final static String getUnameByToken(){
        String result= Strings.EMPTY;
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = requestAttributes.getRequest();
        String token = request.getHeader("Authorization");
        if(StringUtils.isNotBlank(token)){
            result= (String)getClaimsMap( token).get("user_name");
        }
        return result;
    }

    /**
     * 根据token 获取用户ID
     * @param
     * @return
     */
    public final static String getUidByToken() {
        String result= Strings.EMPTY;
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = requestAttributes.getRequest();
        String token = request.getHeader("Authorization");
        if(StringUtils.isNotBlank(token)){
            result= (String)getClaimsMap( token).get("uid");
        }
        return result;
    }

    /**
     * 根据token 获取用户真实姓名
     * @param
     * @return
     */
    public final static String getNameByToken() {
        String result= Strings.EMPTY;
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = requestAttributes.getRequest();
        String token = request.getHeader("Authorization");
        if(StringUtils.isNotBlank(token)){
            result= (String)getClaimsMap( token).get("name");
        }
        return result;
    }


    /**
     * 处理返回结果
     * @param token
     * @return
     */
    public  final static HashMap getClaimsMap(String token){
        if (token.startsWith("Bearer")) {
            token = token.substring(6).trim();
        }
        Jwt jwtToken = JwtHelper.decode(token);
        String claims = jwtToken.getClaims();
        try {
            HashMap claimsMap = new ObjectMapper().readValue(claims, HashMap.class);
            return  claimsMap;
        } catch (IOException e) {
            throw new BusinessCommonException("从token解析用户信息失败");
        }
    }

    public static void main(String[] args) {
        String aaa = "Bearer " +
                "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIwMTBmZDNjY2E1MTA0MWZiOTlhNmIwMmYwZWU2Mjc4YyIsInVzZXJfbmFtZSI6ImFkbWluIiwic2NvcGUiOlsiYWxsIl0sIm5hbWUiOiLotoXnuqfnrqHnkIblkZgiLCJleHAiOjE3MTQyODgwMjUsImp0aSI6ImUzNGNjMTE3LWI3OWUtNGM5Ni1iNjllLTY5YWQ1MTI3YmU2OSIsImNsaWVudF9pZCI6InVzZXItc2VydmljZSJ9.TualwwLeHp3DzqaossnAVqtKFE1pe92SFy4dBbWi5V7XtTyZbkdqXGaWtnQ7Lyo2M_G6t1seegckf8n1GsU1tjqobc3_nAJYWPsF97YQIR2fmMAvul0wROyaNm6OEGBiIh6Ugr6D0g6ogoUr2SlRAqcqHb25UHrpNrLDe1vrApfepcmYEvhTPLjQxCs3bQr7PkT8yr55WNQkIx6hn9yVor1cmxsBcR8AZW_Enc8uwwzkZdahj6TJ0SYXSJQ4TfS3LghB2IBPRtAbPQFUaa3a66EI92tehbR7am4NcvkwqR8br1VtfOG95t92FrT7s0FwLYMP_Y5jg4Rw29A13WTDsw";
        System.out.println(getUnameByToken(aaa));
    }
}
