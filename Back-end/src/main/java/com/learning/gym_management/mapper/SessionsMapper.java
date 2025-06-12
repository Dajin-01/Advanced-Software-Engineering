package com.learning.gym_management.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.learning.gym_management.entity.MembershipsEntity;
import com.learning.gym_management.entity.SessionsEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** 
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-09 21:04:28
 * @Version: 1.0.0
 * @Description: TODO
 **/
@Mapper
public interface SessionsMapper extends BaseMapper<SessionsEntity> {

    int batchInsert(@Param("list") List<SessionsEntity> list);

}