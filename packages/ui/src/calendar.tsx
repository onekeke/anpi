'use client'

import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { tv } from 'tailwind-variants';
import './calendar.css';

interface CalendarProps {
  onChange?: (date: Date) => void;
  className?: string;
  style?: React.CSSProperties;
  dateExtraRender?: (date: Date) => React.ReactNode;
}

type ViewType = 'week' | 'month';

// 定义样式变体
const calendarStyles = tv({
  slots: {
    base: "w-full max-w-4xl mx-auto dark:bg-gray-800",
    header: "flex justify-between items-center mb-4",
    navButton: "px-3 py-1 border rounded transition-colors",
    viewButton: [
      "px-3 py-1 border rounded transition-colors",
      "dark:border-gray-600 dark:hover:bg-gray-700"
    ],
    gridHeader: "grid grid-cols-7 dark:bg-gray-700",
    dayCell: `
      min-h-[100px] p-2 border-t border-l first:border-l-0 
      hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer
      transition-colors
    `,
    todayBadge: [
      "inline-flex items-center justify-center w-8 h-8 rounded-full",
      "dark:text-gray-100"
    ],
    gridContainer: "grid grid-cols-7"
  },
  variants: {
    viewType: {
      month: { gridContainer: "grid-rows-6" },
      week: { gridContainer: "grid-rows-1" }
    },
    isToday: {
      true: { 
        dayCell: "bg-blue-50 dark:bg-blue-900"
      }
    },
    isCurrentMonth: {
      false: { 
        dayCell: "text-gray-400 dark:text-gray-500"
      }
    },
    viewActive: {
      true: { 
        viewButton: "bg-blue-500 text-white dark:bg-blue-600"
      }
    },
    todayHighlight: {
      true: { 
        todayBadge: "bg-blue-500 text-white dark:bg-blue-600"
      }
    }
  }
});

export const Calendar: React.FC<CalendarProps> = ({ 
  onChange,
  className,
  style,
  dateExtraRender
}) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [viewType, setViewType] = useState<ViewType>('month');
  
  // 生成日历头部（周一到周日）
  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];
  
  // 获取当月的所有日期
  const getDaysInMonth = () => {
    const firstDayOfMonth = currentDate.startOf('month');
    const firstDayOfWeek = firstDayOfMonth.startOf('week');
    const days: dayjs.Dayjs[] = [];
    
    // 生成6周的日期（确保月视图完整）
    for (let i = 0; i < 42; i++) {
      days.push(firstDayOfWeek.add(i, 'day'));
    }
    return days;
  };
  
  // 获取当前周的日期
  const getDaysInWeek = () => {
    const firstDayOfWeek = currentDate.startOf('week');
    const days: dayjs.Dayjs[] = [];
    
    for (let i = 0; i < 7; i++) {
      days.push(firstDayOfWeek.add(i, 'day'));
    }
    return days;
  };

  // 切换月份
  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(currentDate.add(direction === 'next' ? 1 : -1, 'month'));
  };

  // 切换周
  const changeWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(currentDate.add(direction === 'next' ? 1 : -1, 'week'));
  };

  const days = viewType === 'month' ? getDaysInMonth() : getDaysInWeek();

  const styles = calendarStyles();

  return (
    <div 
      className={styles.base({ class: className })}
      style={style}
    >
      <div className={styles.header()}>
        <div className="flex gap-2">
          <button
            onClick={() => viewType === 'month' ? changeMonth('prev') : changeWeek('prev')}
            className={styles.navButton()}
          >
            上一{viewType === 'month' ? '月' : '周'}
          </button>
          <button
            onClick={() => viewType === 'month' ? changeMonth('next') : changeWeek('next')}
            className={styles.navButton()}
          >
            下一{viewType === 'month' ? '月' : '周'}
          </button>
        </div>
        
        <h2 className="text-xl font-bold">
          {currentDate.format('YYYY年MM月')}
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewType('month')}
            className={styles.viewButton({
              viewActive: viewType === 'month'
            })}
          >
            月视图
          </button>
          <button
            onClick={() => setViewType('week')}
            className={styles.viewButton({
              viewActive: viewType === 'week'
            })}
          >
            周视图
          </button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden dark:border-gray-600">
        <div className={styles.gridHeader()}>
          {weekDays.map((day) => (
            <div key={day} className="p-2 text-center font-medium">
              周{day}
            </div>
          ))}
        </div>

        <div className={styles.gridContainer({ viewType })}>
          {days.map((day, index) => {
            const isToday = day.isSame(dayjs(), 'day');
            const isCurrentMonth = day.isSame(currentDate, 'month');
            
            return (
              <div
                key={index}
                onClick={() => onChange?.(day.toDate())}
                className={styles.dayCell({
                  isToday,
                  isCurrentMonth
                })}
              >
                <div className={styles.todayBadge({ 
                  todayHighlight: isToday 
                })}>
                  {day.format('D')}
                </div>
                {typeof dateExtraRender === 'function' ? dateExtraRender(day.toDate()) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
