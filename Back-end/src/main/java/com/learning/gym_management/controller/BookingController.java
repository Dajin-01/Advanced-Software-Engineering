package com.learning.gym_management.controller;

import com.learning.gym_management.service.BookingService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-09 21:44:52
 * @Version: 1.0.0
 * @Description: TODO
 **/
@RestController
@RequestMapping("/api/booking")
@Api(tags = "Session Booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

}
