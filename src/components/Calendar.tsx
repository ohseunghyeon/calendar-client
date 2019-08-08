import React, { useState, useMemo } from 'react';
import Controller from './Controller';
import EventsMonthView from './MonthView';
import EventsWeekView from './WeekView';
import { getEvents } from '../services/request-service';

export interface Event {
  id: string;
  title: string;
  start: number;
  end: number;
}

const Calendar: React.FC = () => {
  const [isTypeMonth, setIsTypeMonth] = useState<string>('month');
  const [selectedDate, setSelectedDate] = useState<any>({
    year: 2019,
    month: 7,
    date: 6,
  });

  const [events, setEvents] = useState<Event[]>([]);

  useMemo(async () => {
    const events = await getEvents();
    setEvents(events);
  }, [])

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
