package com.learning.gym_management.job;

import com.learning.gym_management.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-11 10:13:04
 * @Version: 1.0.0
 * @Description: TODO
 **/
@Component
public class ScheduledTasks {

    @Autowired
    private RegistrationService registrationService;

    @Scheduled(cron = "0 0 0 * * ?")
    public void updateUserStatusTask() {
        registrationService.checkMembershipIsExpiry();
    }
}
