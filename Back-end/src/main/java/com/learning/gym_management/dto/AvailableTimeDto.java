package com.learning.gym_management.dto;

import lombok.Data;

import java.util.Date;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-12 12:30:39
 * @Version: 1.0.0
 * @Description:
 **/
@Data
public class AvailableTimeDto {

    private String availableTime;

    private int isAvailable;

}
