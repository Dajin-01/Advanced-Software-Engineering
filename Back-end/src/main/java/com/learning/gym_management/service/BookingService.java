package com.learning.gym_management.service;

import cn.hutool.core.date.DateUtil;
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
        if (!bookingBo.getTimeIdList().isEmpty()){
            for (int i = 0; i < bookingBo.getTimeIdList().size(); i++) {
                SessionsEntity sessionsEntity = new SessionsEntity();
                sessionsEntity.setId(UUIDUtil.uuid32());
                sessionsEntity.setUserId(usersEntity.getId());
                sessionsEntity.setSession(bookingBo.getBookingDate());
                sessionsEntity.setTimeId(bookingBo.getTimeIdList().get(i));
                sessionsEntity.setCreateName(TokenUtil.getNameByToken());
                sessionsEntity.setCreateTime(date);
                sessionsEntityList.add(sessionsEntity);
            }
        }
        if (!sessionsEntityList.isEmpty()){
            result = sessionsMapper.batchInsert(sessionsEntityList);
        }

        if (result > 0) {
            StringBuilder stringBuilder = new StringBuilder();
            List<SubsessionsEntity> subsessionsEntityList = subsessionsMapper.selectList(null);
            Map<String, List<SubsessionsEntity>> map = subsessionsEntityList.stream()
                    .collect(Collectors.groupingBy(SubsessionsEntity::getId));
            for (int i = 0; i < subsessionsEntityList.size(); i++) {
                stringBuilder.append(subsessionsEntityList.get(i).getSubsession());
                if (i != subsessionsEntityList.size() - 1) {
                    stringBuilder.append(",");
                }
            }

            try {
                // send confirmation email
                EmailUtil.sendPlainTextEmail(new ArrayList<>(Arrays.asList(usersEntity.getUserEmail())),
                        "MyGym Booking Confirmed",
                        createEmailContent(usersEntity.getUserName(), stringBuilder.toString()));
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return R.ok(result);
    }

    public String createEmailContent(String userName, String date){
        StringBuilder emailContent = new StringBuilder();
        emailContent.append("Hi ").append(userName).append(",\n").append("\n")
                .append("Thank you for using the gym booking system. Here are the time slots you have booked:\n")
                .append("\n").append("Date: \n").append(userName).append("\n")
                .append("\n").append("Time: \n").append(date).append("\n")
                .append("To report any problem, please email to campusactivities-singapore@jcu.edu.au or look for us at C1-09 Campus Activities Office during office hours. Thank you.");
        return emailContent.toString();
    }

    /**
     *
     * @return
     */
    public List<AvailableTimeDto> listAvailableDate() {
        List<String> dateList = listNextSevenDays(new Date());
        List<AvailableTimeDto> result = new ArrayList<>();
        List<SessionsEntity> sessionsEntityList = sessionsMapper.selectList(null);
        Map<String, List<SessionsEntity>> map = new HashMap<>();
        if (!sessionsEntityList.isEmpty()){
            map = sessionsEntityList.stream().collect(Collectors
                    .groupingBy(SessionsEntity::getSession));
        }
        for (String date : dateList) {
            AvailableTimeDto availableTimeDto = new AvailableTimeDto();
            availableTimeDto.setAvailableTime(date);
            if (!map.isEmpty()){
                int count = map.get(date).size();
                // all slot in the days is booked
                if (count < 54) {
                    availableTimeDto.setIsAvailable(0);
                }else {
                    availableTimeDto.setIsAvailable(1);
                }
            } else {
                availableTimeDto.setIsAvailable(0);
            }
            result.add(availableTimeDto);
        }
        return result;
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
