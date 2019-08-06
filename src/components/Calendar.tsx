import React, { useState } from 'react';
import Controller from './Controller';
import EventsMonthView from './MonthView';
import EventsWeekView from './WeekView';
import { events } from '../db';

const Calendar: React.FC = () => {
  const [isTypeMonth, setIsTypeMonth] = useState('month');
  const [selectedDate, setSelectedDate] = useState({
    year: 2019,
    month: 7,
    date: 6,
  });

  return (
    <div>
      <Controller
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isTypeMonth={isTypeMonth}
        setIsTypeMonth={setIsTypeMonth}
      />
      {isTypeMonth === 'month' ? (
        <EventsMonthView events={events} />
      ) : (
        <EventsWeekView events={events} />
      )}
    </div>
  );
};

export default Calendar;
