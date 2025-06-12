package com.learning.gym_management.bo;

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

    private String userId;

    private String bookingDate;

    private List<String> timeIdList;

}
