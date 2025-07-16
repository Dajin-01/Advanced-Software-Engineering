package com.learning.gym_management.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import lombok.Data;

@ApiModel(description="jcu_account")
@Data
@TableName(value = "jcu_account")
public class JcuAccountEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(value = "account_id", type = IdType.INPUT)
    @ApiModelProperty(value="")
    private String accountId;

    @TableField(value = "account_password")
    @ApiModelProperty(value="")
    private String accountPassword;
}