package com.learning.gym_management.util;

import java.util.UUID;

/**
 * @Description: UUIDUtil工具类
 * @Author: wugangzhi
 * @CreateDate: 2021/9/30 10:37
 * @Version: 1.0
 * Copyright (c) 2021,武汉中地云申科技有限公司
 * All rights reserved.
 **/
public class UUIDUtil {

    /**
     * 生成32位主键ID
     * @return
     */
    public static String uuid32(){
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        return uuid;
    }

    /**
     * 生成36位主键ID
     * @return
     */
    public static String uuid36(){
        String uuid = UUID.randomUUID().toString();
        return uuid;
    }

    public static void main(String []args){
        for(int i=0;i<100;i++)
        System.out.println(uuid32());
    }

}
