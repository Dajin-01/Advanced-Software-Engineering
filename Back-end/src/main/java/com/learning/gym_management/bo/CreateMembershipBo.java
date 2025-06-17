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

    @ApiModelProperty(value = "jcu id")
    private String jcuId;

    @ApiModelProperty(value = "user role")
    private int userRole;

    @ApiModelProperty(value = "user name")
    private String userName;

    @ApiModelProperty(value = "user gender")
    private int userGender;

    @ApiModelProperty(value = "user birthday")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+16")
    private Date userBirth;

    @ApiModelProperty(value = "user telephone number")
    private int userTele;

    @ApiModelProperty(value = "user email")
    private String userEmail;

    @ApiModelProperty(value = "user emergency contact name")
    private String userEmergencyName;

    @ApiModelProperty(value = "user emergency contact number")
    private int userEmergencyNumber;

    @ApiModelProperty(value = "user membership type")
    private int memberType;

}
