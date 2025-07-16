package com.learning.gym_management.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

@ApiModel(description="users")
@Data
@TableName(value = "users")
public class UsersEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.INPUT)
    @ApiModelProperty(value="")
    private String id;

    /**
     * 0-student, 1-staff
     */
    @TableField(value = "user_role")
    @ApiModelProperty(value="0-student, 1-staff")
    private Integer userRole;

    @TableField(value = "user_name")
    @ApiModelProperty(value="")
    private String userName;

    /**
     * 0-male, 1-female
     */
    @TableField(value = "user_gender")
    @ApiModelProperty(value="0-male, 1-female")
    private Integer userGender;

    @TableField(value = "user_birth")
    @ApiModelProperty(value="")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+16")
    private Date userBirth;

    @TableField(value = "user_tele")
    @ApiModelProperty(value="")
    private Integer userTele;

    @TableField(value = "user_email")
    @ApiModelProperty(value="")
    private String userEmail;

    @TableField(value = "user_emergency_name")
    @ApiModelProperty(value="")
    private String userEmergencyName;

    @TableField(value = "user_emergency_number")
    @ApiModelProperty(value="")
    private Integer userEmergencyNumber;

    @TableField(value = "create_name")
    @ApiModelProperty(value="")
    private String createName;

    @TableField(value = "create_time")
    @ApiModelProperty(value="")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+16")
    private Date createTime;

    @TableField(value = "update_name")
    @ApiModelProperty(value="")
    private String updateName;

    @TableField(value = "update_time")
    @ApiModelProperty(value="")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+16")
    private Date updateTime;
}