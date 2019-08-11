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
import Portal from '../util/Portal';

interface CalendarProps {
  viewType: 'month' | 'week';
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
  const viewType = match.params.viewType || 'month';

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
  const { events, setReadyToFetch } = useEventService(date, viewType);

  // popups
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMode, setPopupMode] = useState<'new' | 'update'>('new');
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const closePopup = useCallback(() => {
    setSelectedEvent(undefined);
    setIsPopupOpen(false);
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setPopupMode('update');
    setIsPopupOpen(true);
  };

  const openPopupForNewEvent = (unixtime: number) => {
    setSelectedTime(new Date(unixtime));
    setPopupMode('new');
    setIsPopupOpen(true);
  };

  return (
    <Container>
      <Controller viewType={viewType} setDate={setDate} date={date} />

      {viewType === 'month' ? (
        <MonthView
          date={date}
          events={events}
          handleEventClick={handleEventClick}
          openPopupForNewEvent={openPopupForNewEvent}
          setReadyToFetch={setReadyToFetch}
        />
      ) : (
        <WeekView
          date={date}
          events={events}
          handleEventClick={handleEventClick}
          openPopupForNewEvent={openPopupForNewEvent}
          setReadyToFetch={setReadyToFetch}
        />
      )}

      {isPopupOpen && (
        <Portal>
          <EventPopup
            viewType={viewType}
            selectedEvent={selectedEvent}
            popupMode={popupMode}
            closePopup={closePopup}
            setReadyToFetch={setReadyToFetch}
            selectedTime={selectedTime}
          />
        </Portal>
      )}
    </Container>
  );
};

export default Calendar;
