package com.learning.gym_management.controller;

import com.learning.gym_management.service.UserMonitoringService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-09 21:46:55
 * @Version: 1.0.0
 * @Description: TODO
 **/
@RestController
@RequestMapping("/api/userMonitoring")
@Api(tags = "User Monitoring")
public class UserMonitoringController {

    @Autowired
    private UserMonitoringService userMonitoringService;

}
