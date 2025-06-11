package com.learning.gym_management.exception;

import com.learning.gym_management.constant.CodeEnum;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

/**
 * 业务通用异常
 * @author ys
 * @date 2020/5/15 18:27
 * @since 1.0.1
 */
@Getter
@Slf4j
public class BusinessCommonException extends RuntimeException {


    /**
     * 本异常错误代码
     */
    private String errorCode;
    /**
     * 附加描述信息
     */
    private String additionMessage;


    /**
     * 异常消息，异常对象 构造器,code默认为SYS_ERROR
     * @author qipengpai
     * @param additionMessage 异常消息
     * @date 2019/8/13 15:18
     */
    public BusinessCommonException(String additionMessage) {
        this.errorCode = CodeEnum.SYS_ERROR.getRetCode();
        this.additionMessage = additionMessage;
    }

    /**
     * 异常状态码、异常消息 构造器
     * @author qipengpai
     * @param errCode 异常状态码
     * @param additionMessage  异常消息
     * @date 2019/8/13 15:14
     */
    public BusinessCommonException(String errCode, String additionMessage) {
        super(additionMessage);
        this.errorCode = errCode;
        this.additionMessage = additionMessage;
    }



    /**
     * 异常状态码，消息，异常对象 构造器
     * @author qipengpai
     * @param errCode 异常状态码
     * @param cause   异常对象
     * @date 2019/8/13 15:17
     */
    public BusinessCommonException(String errCode, String additionMessage, Throwable cause) {
        super(cause);
        this.errorCode = errCode;
        this.additionMessage = additionMessage;
    }


    /**
     * 异常消息，异常对象 构造器
     * @author qipengpai
     * @param additionMessage 异常消息
     * @param cause           异常对象
     * @date 2019/8/13 15:18
     */
    public BusinessCommonException(String additionMessage, Throwable cause) {
        super(cause);
        this.errorCode = CodeEnum.SYS_ERROR.getRetCode();
        this.additionMessage = additionMessage;
    }

    /**
     * 获取异常消息
     * @inheritDoc
     * @author qipengpai
     * @date 2019/8/13 15:16
     * @return java.lang.String
     */
    @Override
    public String getMessage() {
        return this.additionMessage;
    }

}
