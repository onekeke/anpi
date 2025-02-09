'use client'

import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

interface CalendarProps {
  onChange?: (date: Date) => void;
}

type ViewType = 'week' | 'month';

export const Calendar: React.FC<CalendarProps> = ({ onChange }) => {
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => viewType === 'month' ? changeMonth('prev') : changeWeek('prev')}
            className="px-3 py-1 border rounded"
          >
            上一{viewType === 'month' ? '月' : '周'}
          </button>
          <button
            onClick={() => viewType === 'month' ? changeMonth('next') : changeWeek('next')}
            className="px-3 py-1 border rounded"
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
            className={`px-3 py-1 border rounded ${viewType === 'month' ? 'bg-blue-500 text-white' : ''}`}
          >
            月视图
          </button>
          <button
            onClick={() => setViewType('week')}
            className={`px-3 py-1 border rounded ${viewType === 'week' ? 'bg-blue-500 text-white' : ''}`}
          >
            周视图
          </button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {/* 星期头部 */}
        <div className="grid grid-cols-7 bg-gray-100">
          {weekDays.map((day) => (
            <div key={day} className="p-2 text-center font-medium">
              周{day}
            </div>
          ))}
        </div>

        {/* 日期网格 */}
        <div className={`grid grid-cols-7 ${viewType === 'month' ? 'grid-rows-6' : 'grid-rows-1'}`}>
          {days.map((day, index) => {
            const isToday = day.isSame(dayjs(), 'day');
            const isCurrentMonth = day.isSame(currentDate, 'month');
            
            return (
              <div
                key={index}
                onClick={() => onChange?.(day.toDate())}
                className={`
                  min-h-[100px] p-2 border-t border-l first:border-l-0
                  ${isToday ? 'bg-blue-50' : ''}
                  ${!isCurrentMonth ? 'text-gray-400' : ''}
                  hover:bg-gray-50 cursor-pointer
                `}
              >
                <div className={`
                  inline-flex items-center justify-center w-8 h-8 rounded-full
                  ${isToday ? 'bg-blue-500 text-white' : ''}
                `}>
                  {day.format('D')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
