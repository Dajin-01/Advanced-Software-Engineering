package com.learning.gym_management.service;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.learning.gym_management.bo.BookingBo;
import com.learning.gym_management.dto.AvailableHourDto;
import com.learning.gym_management.dto.AvailableTimeDto;
import com.learning.gym_management.dto.R;
import com.learning.gym_management.entity.SessionsEntity;
import com.learning.gym_management.entity.SubsessionsEntity;
import com.learning.gym_management.entity.UsersEntity;
import com.learning.gym_management.mapper.SessionsMapper;
import com.learning.gym_management.mapper.SubsessionsMapper;
import com.learning.gym_management.mapper.UsersMapper;
import com.learning.gym_management.util.DateFormatUtil;
import com.learning.gym_management.util.EmailUtil;
import com.learning.gym_management.util.TokenUtil;
import com.learning.gym_management.util.UUIDUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-09 21:44:35
 * @Version: 1.0.0
 * @Description:
 **/
@Service
public class BookingService {

    @Autowired
    private SessionsMapper sessionsMapper;

    @Autowired
    private SubsessionsMapper subsessionsMapper;

    @Autowired
    private UsersMapper usersMapper;

    /**
     *
     * @param bookingBo
     * @return
     */
    @Transactional(rollbackFor = Exception.class)
    public R createNewBooking(BookingBo bookingBo) {
        int result = 0;
        Date date = new Date();
        List<SessionsEntity> sessionsEntityList = new ArrayList<>();
        UsersEntity usersEntity = usersMapper.selectOne(new QueryWrapper<UsersEntity>()
                .eq("id", bookingBo.getUserId()));
        long count = sessionsMapper.selectCount(new QueryWrapper<SessionsEntity>()
                .eq("id", bookingBo.getUserId())
                .eq("session", bookingBo.getBookingDate()));
        if (count > 0) {
            return R.ok("This date has already been booked");
        }

        // insert booking data
        SessionsEntity sessionsEntity = new SessionsEntity();
        sessionsEntity.setId(UUIDUtil.uuid32());
        sessionsEntity.setUserId(usersEntity.getId());
        sessionsEntity.setSession(bookingBo.getBookingDate());
        sessionsEntity.setTimeId(bookingBo.getChosenTimeId());
        sessionsEntity.setCreateName(TokenUtil.getNameByToken());
        sessionsEntity.setCreateTime(date);
        if (!ObjectUtil.isEmpty(sessionsEntity)){
            result = sessionsMapper.insert(sessionsEntity);
        }

        // create email content
        if (result > 0) {
            SubsessionsEntity subsessionsEntity = new SubsessionsEntity();
            subsessionsEntity = subsessionsMapper.selectOne(new QueryWrapper<SubsessionsEntity>()
                    .eq("id", bookingBo.getChosenTimeId()));

            try {
                // send confirmation email
                EmailUtil.sendPlainTextEmail(new ArrayList<>(Arrays.asList(usersEntity.getUserEmail())),
                        "MyGym Booking Confirmed",
                        createEmailContent(usersEntity.getUserName(), bookingBo.getBookingDate()
                        , subsessionsEntity.getSubsession()));
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return R.ok(result);
    }

    public String createEmailContent(String userName, String date, String time){
        StringBuilder emailContent = new StringBuilder();
        emailContent.append("Hi ").append(userName).append(",\n").append("\n")
                .append("Thank you for using the gym booking system. Here are the time slots you have booked:\n")
                .append("\n").append("Date: \n").append(date).append("\n")
                .append("\n").append("Time: \n").append(time).append("\n")
                .append("To report any problem, please email to campusactivities-singapore@jcu.edu.au or look for us at C1-09 Campus Activities Office during office hours. Thank you.");
        return emailContent.toString();
    }

    @Transactional(rollbackFor = Exception.class)
    public int deleteBookingById(String id){
        int result = 0;
        result = sessionsMapper.deleteById(id);
        return result;
    }

    /**
     *
     * @return
     */
    public List<Map<String, String>> listAvailableDate() {
        List<Map<String, String>> availableDateList = new ArrayList<>();
        List<String> dayList = new ArrayList<>();
        dayList = listNextSevenDays(new Date());
        for (String day : dayList) {
            Map<String, String> map = new HashMap<>();
            map.put("date", day);
            availableDateList.add(map);
        }
        return availableDateList;
    }

    /**
     *
     * @param date
     * @return
     */
    public List<AvailableHourDto> listAvailableHour(String date) {
        List<SubsessionsEntity> subsessionsEntityList = subsessionsMapper.selectList(null);
        List<SessionsEntity> sessionsEntityList = sessionsMapper
                .selectList(new QueryWrapper<SessionsEntity>().eq("session", date));
        Map<String, List<SessionsEntity>> map = new HashMap<>();
        if (!sessionsEntityList.isEmpty()){
            map = sessionsEntityList.stream().collect(Collectors.groupingBy(SessionsEntity::getSession));
        }
        List<AvailableHourDto> result = new ArrayList<>();

        for (SubsessionsEntity subsessionsEntity : subsessionsEntityList) {
            AvailableHourDto availableHourDto = new AvailableHourDto();
            availableHourDto.setSubSessionId(subsessionsEntity.getId());
            availableHourDto.setAvailableHour(subsessionsEntity.getSubsession());

            if (!map.isEmpty()){
                int count = map.get(subsessionsEntity.getSubsession()).size();
                if (count < 6) {
                    availableHourDto.setIsAvailable(0);
                }else {
                    availableHourDto.setIsAvailable(1);
                }
            } else {
                availableHourDto.setIsAvailable(0);
            }
            result.add(availableHourDto);
        }
        return result;
    }
    /**
     *
     * @param date
     * @return
     */
    private List<String> listNextSevenDays(Date date) {
        List<String> dateList = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            if (i == 0){
                dateList.add(DateUtil.format(date, "yyyy-MM-dd"));
            }else {
                dateList.add(DateFormatUtil.format1(DateUtil.offsetDay(date, i)));
            }
        }
        return dateList;
    }

}
