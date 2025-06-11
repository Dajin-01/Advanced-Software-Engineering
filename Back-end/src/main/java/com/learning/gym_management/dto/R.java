package com.learning.gym_management.dto;


import cn.hutool.json.JSONUtil;
import com.learning.gym_management.constant.CodeEnum;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-09 21:44:52
 * @Version: 1.0.0
 * @Description: TODO
 **/
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("结果集")
public class R<T> {

    /**
     * 返回结果
     */
    @ApiModelProperty("返回结果")
    private T data;

    /**
     * 状态码
     */
    @ApiModelProperty("状态码")
    private String respCode;

    /**
     * 消息
     */
    @ApiModelProperty("消息")
    private String message;

    /**
     * 条件
     */
    @ApiModelProperty("条件")
    private transient Map<String, Object> params;

    /**
     * 无结果成功返回常用返回构造器
     *
     * @return R<T>
     * @author ys
     * @date 2019/6/15 20:33
     */
    public static <T> R<T> ok() {
        return succeedWith(null, CodeEnum.SUCCESS.getRetCode(), CodeEnum.SUCCESS.getRetMsg());
    }


    /**
     * 返回结果常用返回构造器
     *
     * @param model 返回结果
     * @return R<T>
     * @author ys
     * @date 2019/6/15 20:33
     */
    public static <T> R<T> ok(T model) {
        return succeedWith(model, CodeEnum.SUCCESS.getRetCode(), CodeEnum.SUCCESS.getRetMsg());
    }

    /**
     * 结果集，成功消息常用返回构造器
     *
     * @param model 返回结果
     * @param msg   附带消息
     * @return R<T>
     * @author ys
     * @date 2019/6/24 14:12
     */
    public static <T> R<T> ok(T model, String msg) {
        return succeedWith(model, CodeEnum.SUCCESS.getRetCode(), msg);
    }

    /**
     * 成功返回构造器
     *
     * @param data 返回结果
     * @param code 状态码
     * @param msg  附带消息
     * @return R<T>
     * @author ys
     * @date 2019/6/24 14:12
     */
    private static <T> R<T> succeedWith(T data, String code, String msg) {
        return new R<T>(data, code, msg, null);
    }

    /**
     * 错误消息（系统控制器用）
     *
     * @param msg 附带消息
     * @return R<T>
     * @author ys
     * @date 2019/6/24 14:11
     */
    public static <T> R<T> error(String msg) {
        return failedWith(null, CodeEnum.ERROR.getRetCode(), msg);
    }


    /**
     * 错误消息
     *
     * @param
     * @return R<T>
     * @author ys
     * @date 2019/6/24 14:11
     */
    public static <T> R<T> error() {
        return failedWith(null, CodeEnum.ERROR.getRetCode(),CodeEnum.ERROR.getRetMsg() );
    }

    /**
     * 错误结果、错误消息
     *
     * @param model 返回结果
     * @param msg   附带消息
     * @return R<T>
     * @author ys
     * @date 2019/6/24 14:09
     */
    public static <T> R<T> error(T model, String msg) {
        return failedWith(model, CodeEnum.ERROR.getRetCode(), msg);
    }

    /**
     * 返回错误码、错误信息（RestControllerAdvice使用）
     *
     * @param code 状态码
     * @param msg  附带消息
     * @return R<T>
     * @author ys
     * @date 2019/6/24 14:08
     */
    public static <T> R<T> error(String code, String msg) {
        return new R<T>(null, code, msg, null);
    }

    /**
     * 错误返回构造器
     *
     * @param data 返回结果
     * @param code 状态码
     * @param msg  附带消息
     * @return R<T>
     * @author ys
     * @date 2019/6/24 14:09
     */
    private static <T> R<T> failedWith(T data, String code, String msg) {
        return new R<T>(data, code, msg, null);
    }

    /**
     * 请求是否成功
     * <p> 结构体增加success字段 </p>
     * @return boolean
     * @author ys
     * @date 2020/4/29 12:51
     */
    public boolean isSuccess() {
        return this.respCode.equals(CodeEnum.SUCCESS.getRetCode());
    }

    /**
     * 转化为JSON字符串
     * @return java.lang.String
     * @author ys
     * @date 2020/5/2 20:24
     */
    public String toJsonString() {
        return JSONUtil.toJsonStr(this);
    }


    public static <T> R<T> ok( int rows) {
        if(rows>0){
            return R.ok();
        }else{
            return R.error();
        }
    }


    public static <T> R<T> ok( int rows,String successMessage , String errorMessage) {
        if(rows>0){
            return R.ok(null,successMessage);
        }else{
            return R.error(errorMessage);
        }
    }


}
