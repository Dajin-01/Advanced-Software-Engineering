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
 * @Description:
 **/
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("result set")
public class R<T> {

    /**
     * returned result
     */
    @ApiModelProperty("returned result")
    private T data;

    /**
     * response code
     */
    @ApiModelProperty("response code")
    private String respCode;

    /**
     * message
     */
    @ApiModelProperty("message")
    private String message;

    /**
     * params
     */
    @ApiModelProperty("params")
    private transient Map<String, Object> params;

    /**
     * Common response constructors for successful no-result returns
     *
     * @return R<T>
     * @author Chen Xingjian
     * @date 2025-06-09 21:44:52
     */
    public static <T> R<T> ok() {
        return succeedWith(null, CodeEnum.SUCCESS.getRetCode(), CodeEnum.SUCCESS.getRetMsg());
    }


    /**
     * Common response constructors for return results
     *
     * @param model returned result
     * @return R<T>
     * @author Chen Xingjian
     * @date 2025-06-09 21:44:52
     */
    public static <T> R<T> ok(T model) {
        return succeedWith(model, CodeEnum.SUCCESS.getRetCode(), CodeEnum.SUCCESS.getRetMsg());
    }

    /**
     * Common response constructors for result sets and success messages
     *
     * @param model returned result
     * @param msg   attached message
     * @return R<T>
     * @author Chen Xingjian
     * @date 2025-06-09 21:44:52
     */
    public static <T> R<T> ok(T model, String msg) {
        return succeedWith(model, CodeEnum.SUCCESS.getRetCode(), msg);
    }

    /**
     * Constructor for successful responses
     *
     * @param data returned result
     * @param code respCode
     * @param msg  attached message
     * @return R<T>
     * @author Chen Xingjian
     * @date 2025-06-09 21:44:52
     */
    private static <T> R<T> succeedWith(T data, String code, String msg) {
        return new R<T>(data, code, msg, null);
    }

    /**
     * Error messages (for s Chen Xingjiantem controllers)
     *
     * @param msg attached message
     * @return R<T>
     * @author Chen Xingjian
     * @date 2025-06-09 21:44:52
     */
    public static <T> R<T> error(String msg) {
        return failedWith(null, CodeEnum.ERROR.getRetCode(), msg);
    }


    /**
     * Error messages
     *
     * @param
     * @return R<T>
     * @author Chen Xingjian
     * @date 2025-06-09 21:44:52
     */
    public static <T> R<T> error() {
        return failedWith(null, CodeEnum.ERROR.getRetCode(),CodeEnum.ERROR.getRetMsg() );
    }

    /**
     * Error result, error messages
     *
     * @param model returned result
     * @param msg   attached message
     * @return R<T>
     * @author Chen Xingjian
     * @date 2025-06-09 21:44:52
     */
    public static <T> R<T> error(T model, String msg) {
        return failedWith(model, CodeEnum.ERROR.getRetCode(), msg);
    }

    /**
     * Return error codes and messages (used in RestControllerAdvice)
     *
     * @param code respCode
     * @param msg  attached message
     * @return R<T>
     * @author Chen Xingjian
     * @date 2025-06-09 21:44:52
     */
    public static <T> R<T> error(String code, String msg) {
        return new R<T>(null, code, msg, null);
    }

    /**
     * Constructor for error responses
     *
     * @param data returned result
     * @param code respCode
     * @param msg  attached message
     * @return R<T>
     * @author Chen Xingjian
     * @date 2025-06-09 21:44:52
     */
    private static <T> R<T> failedWith(T data, String code, String msg) {
        return new R<T>(data, code, msg, null);
    }

    /**
     * Whether the request was successful
     * <p> add a 'success' field into the structure</p>
     * @return boolean
     * @author Chen Xingjian
     * @date 2025-06-09 21:44:52
     */
    public boolean isSuccess() {
        return this.respCode.equals(CodeEnum.SUCCESS.getRetCode());
    }

    /**
     * Convert to JSON string
     * @return java.lang.String
     * @author Chen Xingjian
     * @date 2025-06-09 21:44:52
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
