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

@ApiModel(description = "memberships")
@Data
@TableName(value = "memberships")
public class MembershipsEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.INPUT)
    @ApiModelProperty(value = "")
    private String id;

    @TableField(value = "account_id")
    @ApiModelProperty(value = "")
    private String accountId;

    @TableField(value = "`type`")
    @ApiModelProperty(value = "")
    private Integer type;

    @TableField(value = "expiry_date")
    @ApiModelProperty(value = "")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+16")
    private String expiryDate;

    @TableField(value = "is_expiry")
    @ApiModelProperty(value = "")
    private Integer isExpiry;

    @TableField(value = "create_name")
    @ApiModelProperty(value = "")
    private String createName;

    @TableField(value = "create_time")
    @ApiModelProperty(value = "")
    private Date createTime;

    @TableField(value = "update_name")
    @ApiModelProperty(value = "")
    private String updateName;

    @TableField(value = "update_time")
    @ApiModelProperty(value = "")
    private Date updateTime;
}