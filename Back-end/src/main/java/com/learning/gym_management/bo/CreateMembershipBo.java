package com.learning.gym_management.bo;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-10 11:10:47
 * @Version: 1.0.0
 * @Description:
 **/
@Data
public class CreateMembershipBo {

    @ApiModelProperty(value = "user's role: 0-student 1-employed")
    private int userRole;

    @ApiModelProperty(value = "user's full name")
    private String fullName;

    @ApiModelProperty(value = "account password")
    private String password;

    @ApiModelProperty(value = "user's email address")
    private String email;

    @ApiModelProperty(value = "user's connect number")
    private int mobileNumber;

    @ApiModelProperty(value = "user's gender: 0-male 1-female 2-other 3-unspecified")
    private int gender;

    @ApiModelProperty(value = "user birthday")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+16")
    private Date birthdate;

    @ApiModelProperty(value = "user emergency contact name")
    private String userEmergencyName;

    @ApiModelProperty(value = "user emergency contact number")
    private int userEmergencyNumber;

    @ApiModelProperty(value = "term")
    private int term;

    @ApiModelProperty(value = "fee")
    private int fee;

    @ApiModelProperty(value = "payment type")
    private int paymentType;

}
