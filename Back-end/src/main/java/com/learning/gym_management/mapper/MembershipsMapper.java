package com.learning.gym_management.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.learning.gym_management.entity.MembershipsEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** 
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-11 11:17:04
 * @Version: 1.0.0
 * @Description: TODO
 **/
@Mapper
public interface MembershipsMapper extends BaseMapper<MembershipsEntity> {
    int updateBatch(@Param("list") List<MembershipsEntity> list);

    int batchInsert(@Param("list") List<MembershipsEntity> list);
}