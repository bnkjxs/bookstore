package com.cht.bookstore.util;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * 
 * 获取SpringBean的工具类
 * 
 * @author 创建作者 : XS
 * @date 创建时间 ：2018年7月5日
 */
@Component
public class CtxUtil implements ApplicationContextAware {
	
	private static ApplicationContext ctx;
	
	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		ctx=applicationContext;
	}
	
	/**
     * 根据类型获得bean
     */
    public static <T> T getBean(Class<T> clazz){
        return ctx.getBean(clazz);
    }
    
    /**
     * 根据名称名称获得bean
     */
    public static Object getBean(String name){
        return ctx.getBean(name);
    }
}
