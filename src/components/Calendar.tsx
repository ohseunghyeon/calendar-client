import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import moment, { Moment } from 'moment';
import { Event } from '../types/Event';
import MonthView from './MonthView';
import WeekView from './WeekView';
import useEventService from '../hooks/useEventService';
import Controller from './Controller';
import EventPopup from './EventPopup';

interface CalendarProps {
  mode?: 'month' | 'week';
  year?: string;
  month?: string;
  date?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Calendar: React.FC<RouteComponentProps<CalendarProps>> = ({ match }) => {
  // month || week
  const mode = match.params.mode || 'month';

  // dates which user is looking
  const initialDate: any = {};
  if (match.params.date) {
    // only for initilization of dates when it's the first open of this app
    const { year, month, date } = match.params;
    initialDate.y = Number(year);
    initialDate.M = Number(month) - 1;
    initialDate.d = Number(date);
  }
  const [date, setDate] = useState<Moment>(moment(initialDate));

  // events
  const { events, setReadyToFetch } = useEventService(date, mode);

  // popups
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState(''); // new-month, new-week, update
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const closePopup = useCallback(() => {
    setSelectedEvent(undefined);
    setIsPopupOpen(false);
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setPopupType('update');
    setIsPopupOpen(true);
  };

  const openPopupForNewEvent = (unixtime: number) => {
    setSelectedTime(new Date(unixtime));
    setPopupType('new');
    setIsPopupOpen(true);
  };

  return (
    <Container>
      <Controller mode={mode} setDate={setDate} date={date} />

      {mode === 'month' ? (
        <MonthView
          date={date}
          events={events}
          handleEventClick={handleEventClick}
          openPopupForNewEvent={openPopupForNewEvent}
        />
      ) : (
          <WeekView
            date={date}
            events={events}
            handleEventClick={handleEventClick}
            openPopupForNewEvent={openPopupForNewEvent}
          />
        )
      }

      {isPopupOpen && (
        <EventPopup
          mode={mode}
          selectedEvent={selectedEvent}
          type={popupType}
          closePopup={closePopup}
          setReadyToFetch={setReadyToFetch}
          selectedTime={selectedTime}
        />
      )}
    </Container>
  );
};

export default Calendar;
