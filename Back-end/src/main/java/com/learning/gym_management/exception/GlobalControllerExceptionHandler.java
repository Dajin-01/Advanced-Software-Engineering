package com.learning.gym_management.exception;

import com.learning.gym_management.constant.CodeEnum;
import com.learning.gym_management.dto.R;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolationException;

/**
 * 全局异常处理
 * @author ys
 * @date 2017/9/24 12:42
 * @since 1.0.1
 */
@Slf4j
@Component
@ControllerAdvice
@SuppressWarnings("all")
public class GlobalControllerExceptionHandler {

	/**
	 * 系统异常处理
	 * @see ExceptionHandler
	 * @author ys
	 * @date 2019/6/18 9:31
	 * @param  e 异常对象
	 */
	@ExceptionHandler({ Exception.class, Throwable.class })
	@ResponseBody
    public R errorHandler(HttpServletRequest request, HttpServletResponse response, Exception e) {

        log.error(e.getMessage());
        // 获取请求URI
        this.getRequestURI(request);
        return  R.error(e.getMessage());
    }

	/**
	 * 运行时异常处理
	 * @see ExceptionHandler
	 * @author ys
	 * @date 2019/6/18 9:31
	 * @param  e 异常对象
	 */
	@ExceptionHandler(RuntimeException.class)
	@ResponseBody
	public R runtimeExceptionHandler(HttpServletRequest request, HttpServletResponse response, Exception e) {
		R result = R.error(CodeEnum.ERROR.getRetCode(), CodeEnum.ERROR.getRetMsg() + e.getMessage());
		log.error(result.toJsonString(),e);
		// 获取请求URI
		this.getRequestURI(request);
		return result;
	}
	

	/**
	 * 参数校验异常
	 * <p> 表单提交时发生的参数绑定一场</p>
	 * @see javax.validation.constraints.NotBlank
	 * @see javax.validation.constraints.NotNull
     * @date 2019/7/18 9:32
     * @author ys
     * @param e 异常对象
     * @return Result   返回类型
     * @throws
     */
    @ExceptionHandler(BindException.class)
    @ResponseBody
    public R errorBindHandler(BindException e) {
        log.error("BindException -> 参数校验异常", e);
        return wrapperBindingResult(e.getBindingResult());
    }


	/**
	 * 系统自定义异常处理
	 * @param e 异常对象
	 * @return org.ys.oauth2common.model.Result
	 * @author ys
	 * @date 2020/5/15 14:25
	 */
	@ExceptionHandler(BusinessCommonException.class)
	@ResponseBody
	public R businessCommonExceptionHandler(HttpServletRequest request, HttpServletResponse response, BusinessCommonException e) {
		// 获取请求URI
		this.getRequestURI(request);
		return  R.error(e.getErrorCode(), e.getAdditionMessage());
	}

	/**
	 * IllegalArgumentException（非法参数）异常处理返回json 状态码:400
	 * @author ys
	 * @date 2019/6/24 14:10
	 * @param exception 异常对象
	 * @return com.bccv.nmg.result.Result
	 */
	@ExceptionHandler({ IllegalArgumentException.class })
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public R badRequestExceptionHandler(HttpServletRequest request,IllegalArgumentException exception) {
		log.error("IllegalArgumentException -> 400",exception);
		// 获取请求URI
		this.getRequestURI(request);
		return R.error(CodeEnum.BAD_REQUEST.getRetCode(),exception.getMessage());
	}


	/**
	 * MethodArgumentNotValidException（非法参数）状态码:400
	 * @author ys
	 * @date 2019/6/24 14:10
	 * @param exception 异常对象
	 * @return com.bccv.nmg.result.Result
	 */
	@ExceptionHandler({ MethodArgumentNotValidException.class })
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public R methodArgumentNotValidExceptionHandler(HttpServletRequest request,MethodArgumentNotValidException exception) {
		log.error("MethodArgumentNotValidException -> 400",exception);
		// 获取请求URI
		this.getRequestURI(request);
		return R.error(CodeEnum.BAD_REQUEST.getRetCode(),exception.getMessage());
	}


	/**
	 * ConstraintViolationException（非法参数） 状态码:400
	 * @author ys
	 * @date 2019/6/24 14:10
	 * @param exception 异常对象
	 * @return com.bccv.nmg.result.Result
	 */
	@ExceptionHandler({ ConstraintViolationException.class })
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public R constraintViolationExceptionHandler(HttpServletRequest request,ConstraintViolationException exception) {
		log.error("ConstraintViolationException -> 400",exception);
		// 获取请求URI
		this.getRequestURI(request);
		return R.error(CodeEnum.BAD_REQUEST.getRetCode(),exception.getMessage());
	}





	/**
	 * 获取请求URI
	 * @param request
	 * @return void
	 * @author ys
	 * @date 2020/5/2 21:32
	 */
	private void getRequestURI(HttpServletRequest request){
		// 获取请求路径
		String requestUrl = request.getRequestURI();
		log.error("获取请求URI -> {}",requestUrl);
	}

	/**
	 * 包装绑定异常结果
	 * @author ys
	 * @date 2019/6/18 9:31
	 * @param bindingResult 绑定结果
	 * @return Result 异常结果
	 */
	private R wrapperBindingResult(BindingResult bindingResult) {
		// 构建返回消息
		StringBuilder msg = new StringBuilder();
		for (ObjectError error : bindingResult.getAllErrors()) {
			msg.append(", ");
			if (error instanceof FieldError) {
				msg.append(((FieldError) error).getField()).append(": ");
			}
			msg.append(error.getDefaultMessage() == null ? "" : error.getDefaultMessage());
		}
		return R.error(CodeEnum.ERROR.getRetCode(), msg.substring(2));
	}
}
