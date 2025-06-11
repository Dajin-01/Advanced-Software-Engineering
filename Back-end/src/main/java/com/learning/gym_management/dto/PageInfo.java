package com.learning.gym_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-10 21:20:26
 * @Version: 1.0.0
 * @Description:
 **/
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageInfo<T> {
    private long total;
    private List<T> list;
    private int pageNum;
    private int pageSize;
    private int pages;
}
