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
@ApiModel(description="sessions")
@Data
@TableName(value = "sessions")
public class SessionsEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.INPUT)
    @ApiModelProperty(value="")
    private String id;

    @TableField(value = "`session`")
    @ApiModelProperty(value="")
    private Date session;

    @TableField(value = "time_id")
    @ApiModelProperty(value="")
    private Integer timeId;

    @TableField(value = "is_full")
    @ApiModelProperty(value="")
    private Integer isFull;

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