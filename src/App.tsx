import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import './index.css';
import { useControllableValue } from 'ahooks';

interface CalendarProps {
  value?: Date,
  defaultValue?: Date,
  onChange?: (date: Date) => void
}

interface CalendarRef {
  getDate: () => Date,
  setDate: (date: Date) => void,
}

const InternalCalendar: React.ForwardRefRenderFunction<CalendarRef, CalendarProps> = (props, ref) => {
  /* const {
    defaultValue = new Date(),
    onChange,
  } = props; */

  // const [date, setDate] = useState(defaultValue);

  // 同时兼容受控和非受控
  const [date, setDate] = useControllableValue(props, {
    defaultValue: new Date()
  })

  useImperativeHandle(ref, () => {
    return {
      getDate() {
        return date;
      },
      setDate(date: Date) {
        setDate(date)
      }
    }
  });

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const monthNames = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ];

  const daysOfMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderDates = () => {
    const days = [];

    const daysCount = daysOfMonth(date.getFullYear(), date.getMonth());
    const firstDay = firstDayOfMonth(date.getFullYear(), date.getMonth());

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="empty"></div>);
    }

    for (let i = 1; i <= daysCount; i++) {
      const clickHandler = () => {
        const curDate = new Date(date.getFullYear(), date.getMonth(), i);
        setDate(curDate);
        // onChange?.(curDate); 使用useControllableValue就无需调用onChange
      }
      days.push(<div key={i} className={`day ${i === date.getDate() ? 'selected' : ''}`} onClick={() => clickHandler()}>{i}</div>);
    }

    return days;
  };

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <div>{date.getFullYear()}年{monthNames[date.getMonth()]}</div>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="days">
        <div className="day">日</div>
        <div className="day">一</div>
        <div className="day">二</div>
        <div className="day">三</div>
        <div className="day">四</div>
        <div className="day">五</div>
        <div className="day">六</div>
        {renderDates()}
      </div>
    </div>
  );
}

const Calendar = forwardRef(InternalCalendar);

// 非受控模式
/* 
function Test() {
  const calendarRef = useRef<CalendarRef>(null);

  useEffect(() => {
    console.log(calendarRef.current?.getDate().toLocaleDateString());

  }, []);

  return <div>
    <Calendar ref={calendarRef} defaultValue={new Date()} onChange={(newDate) => { alert(newDate.toLocaleDateString()) }}></Calendar>
  </div>

}
*/

// 受控模式
function Test() {
  const [date, setDate] = useState(new Date());

  return <Calendar value={date} onChange={(newDate) => {
    setDate(newDate);
    alert(newDate.toLocaleDateString())
  }}></Calendar>
}
export default Test;