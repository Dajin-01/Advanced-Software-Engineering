package com.learning.gym_management.bo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-10 12:57:28
 * @Version: 1.0.0
 * @Description:
 **/
@Data
public class UpdateMemberInfoBo {

    @ApiModelProperty(value = "user id")
    private String userId;

    private String userName;

    private String userEmail;
}
