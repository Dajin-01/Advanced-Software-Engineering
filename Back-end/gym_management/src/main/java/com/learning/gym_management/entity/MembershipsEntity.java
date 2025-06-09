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
 * @CreateDate: 2025-06-09 21:04:08
 * @Version: 1.0.0
 * @Description: TODO
 **/
@ApiModel(description="memberships")
@Data
@TableName(value = "memberships")
public class MembershipsEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.INPUT)
    @ApiModelProperty(value="")
    private String id;

    @TableField(value = "user_id")
    @ApiModelProperty(value="")
    private Integer userId;

    @TableField(value = "`type`")
    @ApiModelProperty(value="")
    private Integer type;

    @TableField(value = "expiry_date")
    @ApiModelProperty(value="")
    private Date expiryDate;

    @TableField(value = "is_expiry")
    @ApiModelProperty(value="")
    private Integer isExpiry;

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