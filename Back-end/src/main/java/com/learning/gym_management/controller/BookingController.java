package com.learning.gym_management.controller;

import com.learning.gym_management.bo.BookingBo;
import com.learning.gym_management.dto.AvailableHourDto;
import com.learning.gym_management.dto.R;
import com.learning.gym_management.service.BookingService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @ApiOperation(value = "create new booking")
    @PostMapping("/createNewBooking")
    public R createNewBooking(@RequestBody BookingBo bookingBo){
        return R.ok(bookingService.createNewBooking(bookingBo));
    }

    @ApiOperation(value = "delete booking by id")
    @GetMapping("/deleteBookingById")
    public R deleteBookingById(@RequestParam @Validated String id){
        return R.ok(bookingService.deleteBookingById(id));
    }

    @ApiOperation(value = "List the available date")
    @GetMapping("/listAvailableDate")
    public R listAvailableDate(){
        return R.ok(bookingService.listAvailableDate());
    }

    @ApiOperation(value = "list the available hour at certain day")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "date", value = "certain day", dataType = "String", required = true)
    })
    @GetMapping("/listAvailableHour")
    public R<List<AvailableHourDto>> listAvailableHour(@RequestParam @Validated String date){
        return R.ok(bookingService.listAvailableHour(date));
    }
}
