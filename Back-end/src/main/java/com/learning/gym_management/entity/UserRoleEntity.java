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
@ApiModel(description="user_role")
@Data
@TableName(value = "user_role")
public class UserRoleEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.INPUT)
    @ApiModelProperty(value="")
    private String id;

    @TableField(value = "user_id")
    @ApiModelProperty(value="")
    private String userId;

    @TableField(value = "role_id")
    @ApiModelProperty(value="")
    private String roleId;

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