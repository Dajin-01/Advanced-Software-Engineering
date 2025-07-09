package com.learning.gym_management.bo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-12 12:01:18
 * @Version: 1.0.0
 * @Description:
 **/
@Data
public class BookingBo {

    @ApiModelProperty(value = "user id")
    private String userId;

    @ApiModelProperty(value = "Booking date")
    private String bookingDate;

    @ApiModelProperty(value = "chosen time ID (subsessionId)")
    private String chosenTimeId;

}
