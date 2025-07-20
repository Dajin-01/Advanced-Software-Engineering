package com.learning.gym_management.controller;

import com.learning.gym_management.bo.CreateMembershipBo;
import com.learning.gym_management.dto.R;
import com.learning.gym_management.service.RegistrationService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.MessagingException;
import java.io.IOException;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-09 21:41:01
 * @Version: 1.0.0
 * @Description: Online Registration
 **/
@RestController
@RequestMapping("/api/registration")
@Api(tags = "Online Registration")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @ApiOperation("create new membership")
    @PostMapping("/createMembership")
    public R createMembership(@RequestBody @Validated CreateMembershipBo createMembershipBo) throws MessagingException, IOException {
        return registrationService.createMemberhip(createMembershipBo);
    }

}
