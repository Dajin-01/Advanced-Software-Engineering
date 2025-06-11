package com.learning.gym_management.service;

import cn.hutool.core.date.DateUtil;
import com.learning.gym_management.bo.CreateMembershipBo;
import com.learning.gym_management.entity.MembershipsEntity;
import com.learning.gym_management.entity.UsersEntity;
import com.learning.gym_management.mapper.MembershipsMapper;
import com.learning.gym_management.mapper.UsersMapper;
import com.learning.gym_management.util.DateFormatUtil;
import com.learning.gym_management.util.EmailUtil;
import com.learning.gym_management.util.TokenUtil;
import com.learning.gym_management.util.UUIDUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.MessagingException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-09 21:27:31
 * @Version: 1.0.0
 * @Description: Online Registration Service
 **/
@Service
public class RegistrationService {

    @Autowired
    private UsersMapper usersMapper;

    @Autowired
    private MembershipsMapper membershipsMapper;

    private final String emailSubject = "Congratulations on Your Membership Approval!";


    /**
     * user's registration process
     * @param createMembershipBo
     * @return
     */
    @Transactional(rollbackFor = Exception.class)
    public int createMemberhip(CreateMembershipBo createMembershipBo) throws MessagingException, IOException {
        int i = 0;
        //
        String userId = UUIDUtil.uuid32();
        String membershipId = UUIDUtil.uuid32();
        Date now = new Date();
        //
        UsersEntity usersEntity = new UsersEntity();
        MembershipsEntity membershipsEntity = new MembershipsEntity();

        BeanUtils.copyProperties(createMembershipBo, usersEntity);
        usersEntity.setId(userId);
        usersEntity.setUserTerms(createMembershipBo.getMemberType());
        usersEntity.setCreateName(TokenUtil.getNameByToken());
        usersEntity.setCreateTime(now);

        //
        membershipsEntity.setId(membershipId);
        membershipsEntity.setUserId(userId);
        membershipsEntity.setType(createMembershipBo.getMemberType());
        membershipsEntity.setExpiryDate(getExpiryDate(createMembershipBo.getMemberType(), now));
        //new membership won't be expired
        membershipsEntity.setIsExpiry(0);
        membershipsEntity.setCreateTime(now);
        membershipsEntity.setCreateName(TokenUtil.getNameByToken());

        i = usersMapper.insert(usersEntity);
        if (i > 0) {
            // insert membership info into database
            membershipsMapper.insert(membershipsEntity);
            // send confirmation email
            EmailUtil.sendPlainTextEmail(new ArrayList<>(Arrays.asList(createMembershipBo.getUserEmail())),
                    emailSubject, createEmailContent(createMembershipBo.getUserName()));
        }
        return i;
    }

    /**
     * getExpiryDate
     * @param memberType
     * @param now
     * @return
     */
    private String getExpiryDate(int memberType, Date now){
        String expiryDate = null;
        if (memberType == 0){
            expiryDate = DateFormatUtil.format1(DateUtil.offsetDay(now, 7));
        }else if (memberType == 1){
            expiryDate = DateFormatUtil.format1(DateUtil.offsetMonth(now, 4));
        }else if (memberType == 2){
            expiryDate = DateFormatUtil.format1(DateUtil.offsetMonth(now, 12));
        }
        return expiryDate;
    }

    public String createEmailContent(String userName){
        StringBuilder emailContent = new StringBuilder();
        emailContent.append("Dear ").append(userName).append(",\n").append("\n")
                .append("Congratulations on your successful application for school membership! We’re delighted to welcome you aboard and look forward to your active participation in our community.\n")
                .append("\n").append("Best regards,\n").append("Chen Xingjian\n")
                .append("MyGym");
        return emailContent.toString();
    }

    @Transactional(rollbackFor = Exception.class)
    public void checkMembershipIsExpiry(){
        Date now = new Date();
        List<MembershipsEntity> resultList = new ArrayList<>();

        List<MembershipsEntity> membershipsEntityList =
                membershipsMapper.selectList(null);
        if (membershipsEntityList != null || !membershipsEntityList.isEmpty()){
            for (MembershipsEntity membershipsEntity : membershipsEntityList) {
                if (now.after(membershipsEntity.getCreateTime())){
                    membershipsEntity.setIsExpiry(1);
                }
                resultList.add(membershipsEntity);
            }
        }
        if (!resultList.isEmpty()){
            membershipsMapper.updateBatch(resultList);
        }
    }
}
