package com.learning.gym_management.dto;

import lombok.Data;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-12 13:01:37
 * @Version: 1.0.0
 * @Description: TODO
 **/
@Data
public class AvailableHourDto {

    private String subSessionId;

    private String availableHour;

    private int isAvailable;

}
