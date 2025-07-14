package com.learning.gym_management.service;

import cn.hutool.core.date.DateUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.learning.gym_management.bo.CreateMembershipBo;
import com.learning.gym_management.dto.R;
import com.learning.gym_management.entity.JcuAccountEntity;
import com.learning.gym_management.entity.MembershipsEntity;
import com.learning.gym_management.entity.UsersEntity;
import com.learning.gym_management.mapper.JcuAccountMapper;
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

    @Autowired
    private JcuAccountMapper jcuAccountMapper;

    private final String emailSubject = "Congratulations on Your Membership Approval!";


    /**
     * user's registration process
     * @param createMembershipBo
     * @return
     */
    @Transactional(rollbackFor = Exception.class)
    public R createMemberhip(CreateMembershipBo createMembershipBo) throws MessagingException, IOException {
        int i = 0;
        String userId = UUIDUtil.uuid32();
        String membershipId = UUIDUtil.uuid32();
        Date now = new Date();
        // new entity
        UsersEntity usersEntity = new UsersEntity();
        MembershipsEntity membershipsEntity = new MembershipsEntity();
        JcuAccountEntity jcuAccountEntity = new JcuAccountEntity();

        long count = jcuAccountMapper.selectCount(new QueryWrapper<JcuAccountEntity>()
                .eq("account_id", createMembershipBo.getEmail()));
        if (count > 0) {
            return R.error("Email Already Exists");
        }
        // user's data
        usersEntity.setId(userId);
        usersEntity.setUserRole(createMembershipBo.getUserRole());
        usersEntity.setUserName(createMembershipBo.getFullName());
        usersEntity.setUserGender(createMembershipBo.getGender());
        usersEntity.setUserBirth(createMembershipBo.getBirthdate());
        usersEntity.setUserEmail(createMembershipBo.getEmail());
        usersEntity.setUserTele(createMembershipBo.getMobileNumber());
        usersEntity.setUserEmergencyName(createMembershipBo.getUserEmergencyName());
        usersEntity.setUserEmergencyNumber(createMembershipBo.getUserEmergencyNumber());
        usersEntity.setCreateName(TokenUtil.getNameByToken());
        usersEntity.setCreateTime(now);

        // new membership data
        membershipsEntity.setId(membershipId);
        membershipsEntity.setAccountId(createMembershipBo.getEmail());
        membershipsEntity.setType(createMembershipBo.getTerm());
        membershipsEntity.setExpiryDate(getExpiryDate(createMembershipBo.getTerm(), now));
        membershipsEntity.setIsExpiry(0); // new membership won't be expired
        membershipsEntity.setCreateTime(now);
        membershipsEntity.setCreateName(TokenUtil.getNameByToken());

        // new account data
        jcuAccountEntity.setAccountId(createMembershipBo.getEmail());
        jcuAccountEntity.setAccountPassword(createMembershipBo.getPassword());

        i = usersMapper.insert(usersEntity);
        if (i > 0) {
            // insert membership info into database
            membershipsMapper.insert(membershipsEntity);
            // insert user's account into database
            jcuAccountMapper.insert(jcuAccountEntity);
            // send confirmation email
            EmailUtil.sendPlainTextEmail(new ArrayList<>(Arrays.asList(createMembershipBo.getEmail())),
                    emailSubject, createEmailContent(createMembershipBo.getFullName()));
        }
        return R.ok(i);
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
