package com.learning.gym_management.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-12 13:01:37
 * @Version: 1.0.0
 * @Description: TODO
 **/
@Data
public class AvailableHourDto {

    @ApiModelProperty(value = "subsession id")
    private String subSessionId;

    @ApiModelProperty(value = "available hour")
    private String availableHour;

    @ApiModelProperty(value = "the session is available or not: 0-available, 1-unavailable")
    private int isAvailable;

}
