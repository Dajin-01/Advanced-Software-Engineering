package com.learning.gym_management.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/** 
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-09 21:04:28
 * @Version: 1.0.0
 * @Description: TODO
 **/
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
     * 0-trial, 1-one trimester, 2-three trimester
     */
    @TableField(value = "user_terms")
    @ApiModelProperty(value="0-trial, 1-one trimester, 2-three trimester")
    private Integer userTerms;

    /**
     * 0-male, 1-female
     */
    @TableField(value = "user_gender")
    @ApiModelProperty(value="0-male, 1-female")
    private Integer userGender;

    @TableField(value = "user_birth")
    @ApiModelProperty(value="")
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
    private Date createTime;

    @TableField(value = "update_name")
    @ApiModelProperty(value="")
    private String updateName;

    @TableField(value = "update_time")
    @ApiModelProperty(value="")
    private Date updateTime;
}