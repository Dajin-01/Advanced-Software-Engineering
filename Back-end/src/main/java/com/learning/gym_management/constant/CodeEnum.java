package com.learning.gym_management.constant;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-09 21:44:52
 * @Version: 1.0.0
 * @Description:
 **/
public enum CodeEnum {

    /**
     * 请求成功
     */
    SUCCESS("200", "SUCCESS"),

    /**
     * 请求参数有误
     */
    BAD_REQUEST("400","BAD REQUEST"),

    /**
     * 请求失败
     */
    ERROR("500", "ERROR"),

    /**
     * 请求超时
     */
    REQUEST_TIMED_OUT_ERROR("502", "REQUEST TIMED OUT"),

    /**
     * 系统错误请求失败
     */
    SYS_ERROR("9999", "SYSTEM ERROR"),

    /**
     * 业务错误
     */
    BUSINESS_ERROR("10000", "BUSINESS ERROR");


    private final String retCode;

    private final String retMsg;

    CodeEnum(String retCode, String retMsg) {
        this.retCode = retCode;
        this.retMsg = retMsg;
    }

    public String getRetCode() {
        return retCode;
    }

    public String getRetMsg() {
        return retMsg;
    }

    public static String getRetMsg(String retCode) {
        CodeEnum[] responseConstants = CodeEnum.values();
        for (CodeEnum ret : responseConstants) {
            if (ret.getRetCode().equals(retCode)) {
                return ret.getRetMsg();
            }
        }
        return "";
    }
}
