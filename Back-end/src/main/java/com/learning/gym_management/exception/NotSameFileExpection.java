package com.learning.gym_management.exception;

/**
 * @Description: TODO
 * @Author: 黄祥光 1306175106@qq.com
 * @CreateDate: 2020/8/1 11:33
 * @UpdateUser:
 * @UpdateDate: 2020/8/1 11:33
 * @UpdateRemark:
 * @Version: 1.0
 * Copyright (c) 2020,武汉中地云申科技有限公司
 * All rights reserved.
 **/
public class NotSameFileExpection extends Exception {
        public NotSameFileExpection() {
            super("File MD5 Different");
        }
    }

