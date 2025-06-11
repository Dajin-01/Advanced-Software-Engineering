package com.learning.gym_management.util;

import lombok.extern.slf4j.Slf4j;
import com.learning.gym_management.constant.DateUnit;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

/**
 * @Description: 时间工具类
 * @Author: wugangzhi
 * @CreateDate: 2021/9/30 10:37
 * @Version: 1.0
 * Copyright (c) 2021,武汉中地云申科技有限公司
 * All rights reserved.
 **/
@Slf4j
public class DateFormatUtil {

    /**
     * 锁对象
     */
    private static final Object lockObj = new Object();

    /**
     * 存放不同的日期模板格式的sdf的Map
     */
    private static Map<String, ThreadLocal<SimpleDateFormat>> sdfMap = new HashMap<String, ThreadLocal<SimpleDateFormat>>();

    /**
     *
     */
    private static String PATTERN_1 = "yyyy-MM-dd HH:mm:ss";

    /**
     *
     */
    private static String PATTERN_2 = "yyyy-MM-dd";

    /**
     *
     */
    private static String PATTERN_3 =  "yyyy-MM-dd'T'HH:mm:ss";

    /**
     *
     */
    private static String PATTERN_4 =  "yyyy-MM-dd'T'HH:mm:ss.SSS";

    /**
     *
     */
    private static String PATTERN_5 = "yyyy-MM-dd'T'HH:mm:ss'Z'";

    /**
     *
     */
    private static String PATTERN_6 = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

    /**
     * 返回一个ThreadLocal的sdf,每个线程只会new一次sdf
     * @param pattern
     * @return
     */
    private static SimpleDateFormat getSdf(final String pattern) {
        ThreadLocal<SimpleDateFormat> tl = sdfMap.get(pattern);

        // 此处的双重判断和同步是为了防止sdfMap这个单例被多次put重复的sdf
        if (tl == null) {
            synchronized (lockObj) {
                tl = sdfMap.get(pattern);
                if (tl == null) {
                    // 只有Map中还没有这个pattern的sdf才会生成新的sdf并放入map
                    System.out.println("put new sdf of pattern " + pattern + " to map");

                    // 这里是关键,使用ThreadLocal<SimpleDateFormat>替代原来直接new SimpleDateFormat
                    tl = ThreadLocal.withInitial(() -> {
                        System.out.println("thread: " + Thread.currentThread() + " init pattern: " + pattern);
                        return new SimpleDateFormat(pattern);
                    });
                    sdfMap.put(pattern, tl);
                }
            }
        }

        return tl.get();
    }

    /**
     * 使用ThreadLocal<SimpleDateFormat>来获取SimpleDateFormat,这样每个线程只会有一个SimpleDateFormat
     * 如果新的线程中没有SimpleDateFormat，才会new一个
     *
     * @param date
     * @param pattern
     * @return
     */
    public static String format(Date date, String pattern) {
        return getSdf(pattern).format(date);
    }

    public static String format(Date date) {
        return getSdf(PATTERN_1).format(date);
    }

    public static String format1(Date date) {
        return getSdf(PATTERN_2).format(date);
    }

    public static Date parse(String dateStr, String pattern) throws ParseException {
        return getSdf(pattern).parse(dateStr);
    }

    /**
     * parse
     * @param dateStr
     * @return
     */
    public static Date parse(String dateStr) {
        Date date = null;
        try{
            SimpleDateFormat sdf = getSdf(PATTERN_6);
            sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
            date = sdf.parse(dateStr);
        }
        catch(ParseException e6) {
            try {
                SimpleDateFormat sdf = getSdf(PATTERN_5);
                sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
                date = sdf.parse(dateStr);

            } catch (ParseException e5) {
                try {
                    date = getSdf(PATTERN_4).parse(dateStr);

                } catch (ParseException e4) {
                    try {
                        date = getSdf(PATTERN_3).parse(dateStr);
                    } catch (ParseException e3) {
                        try {
                            date = getSdf(PATTERN_2).parse(dateStr);
                        } catch (ParseException e2) {
                            try{
                                date = getSdf(PATTERN_1).parse(dateStr);
                            }catch (ParseException e1){
                                log.error("时间转换异常：" + dateStr);
                            }
                        }
                    }
                }
            }
        }
        return date;
    }

    /**
     * getBeforeOrAfterDate
     * @param date
     * @param num
     * @return
     */
    public static List<String> getBeforeOrAfterDate(Date date, int num) {
        List<String> list = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        for (int i = num; i <= 0; i++) {
            Calendar calendar = Calendar.getInstance();//获取日历
            calendar.setTime(date);//当date的值是当前时间，则可以不用写这段代码。
            calendar.add(Calendar.DATE, num);
            Date d = calendar.getTime();//把日历转换为Date
            list.add(sdf.format(d));
            num++;
        }
        return list;
    }

    /**
     * 获取时间所在月第一天和最后一天
     *
     * @param start_time
     * @param num        0-第一天  1-最后一天
     * @return
     */
    public static int getEndDayOrOneDay(Date start_time, int num) {
        String time;
        Calendar cale;
        SimpleDateFormat format = new SimpleDateFormat("dd");
        if (num == 0) {
            // 获取前月的第一天
            cale = Calendar.getInstance();
            cale.setTime(start_time);
            cale.add(Calendar.MONTH, 0);
            cale.set(Calendar.DAY_OF_MONTH, 1);
            time = format.format(cale.getTime());
        } else {
            // 获取前月的最后一天
            cale = Calendar.getInstance();
            cale.setTime(start_time);
            cale.add(Calendar.MONTH, 1);
            cale.set(Calendar.DAY_OF_MONTH, 0);
            time = format.format(cale.getTime());
        }
        return Integer.parseInt(time);
    }


    /**
     * 获取日期为当年第几周
     * @param date
     * @return
     */
    public static int getWeekOfYear(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setFirstDayOfWeek(Calendar.MONDAY);
        calendar.setTime(date);
        return calendar.get(Calendar.WEEK_OF_YEAR);
    }

    /**
     * 获取某年某月到某年某月按天的切片日期集合(间隔天数的集合)
     * @param beginYear
     * @param beginMonth
     * @param endYear
     * @param endMonth
     * @param k
     * @return
     */
    public static List getTimeList(int beginYear, int beginMonth, int endYear,
                                   int endMonth, int k) {
        List list = new ArrayList();
        if (beginYear == endYear) {
            for (int j = beginMonth; j <= endMonth; j++) {
                list.add(getTimeList(beginYear, j, k));
            }
        } else {
            {
                for (int j = beginMonth; j < 12; j++) {
                    list.add(getTimeList(beginYear, j, k));
                }
                for (int i = beginYear + 1; i < endYear; i++) {
                    for (int j = 0; j < 12; j++) {
                        list.add(getTimeList(i, j, k));
                    }
                }
                for (int j = 0; j <= endMonth; j++) {
                    list.add(getTimeList(endYear, j, k));
                }
            }
        }
        return list;
    }

    /**
     * 获取某年某月按天切片日期集合(某个月间隔多少天的日期集合)
     * @param beginYear
     * @param beginMonth
     * @param k
     * @return
     */
    public static List getTimeList(int beginYear, int beginMonth, int k) {
        List list = new ArrayList();
        Calendar begincal = new GregorianCalendar(beginYear, beginMonth, 1);
        int max = begincal.getActualMaximum(Calendar.DATE);
        for (int i = 1; i < max; i = i + k) {
            list.add(begincal.getTime());
            begincal.add(Calendar.DATE, k);
        }
        begincal = new GregorianCalendar(beginYear, beginMonth, max);
        list.add(begincal.getTime());
        return list;
    }

    /**
     * getTimeList
     * @param startTime
     * @param endTime
     * @param dateUnit
     * @return
     */
    public static List<LocalDateTime> getTimeList(LocalDateTime startTime, LocalDateTime endTime, DateUnit dateUnit) {
        List<LocalDateTime> times = new ArrayList<>();
        while(startTime.isBefore(endTime)||startTime.toLocalDate().isEqual(endTime.toLocalDate())){
            times.add(startTime);
            switch (dateUnit){
                case day:
                    startTime=startTime.plusDays(1);
                    break;
                case hour:
                    startTime=startTime.plusHours(1);
                    break;
                default:
                    break;
            }
        }
        return times;
    }


}
