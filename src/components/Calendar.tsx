import React, { useState } from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import moment, { Moment } from 'moment';
import MonthView from './MonthView';
import WeekView from './WeekView';
import useEvent from '../hooks/useEvent';
import Controller from './Controller';
import EventPopup from './EventPopup';
import Portal from '../util/Portal';
import Loading from '../util/Loading';
import useEventPopup from '../hooks/useEventPopup';

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
  user-select: none;
`;

const Calendar: React.FC<RouteComponentProps<CalendarProps>> = (props) => {
  const viewType = props.match.params.viewType || 'month';

  const [date, setDate] = useState<Moment>(getInitialDate(props));

  // events
  const { events, isLoading, request } = useEvent(date, viewType);

  // popup
  const {
    isPopupOpen,
    popupMode,
    selectedTime,
    selectedEvent,
    closePopup,
    handleEventClick,
    openPopupForNewEvent
  } = useEventPopup();

  return (
    <Container>
      <Controller viewType={viewType} setDate={setDate} date={date} />

      {viewType === 'month' ? (
        <MonthView
          date={date}
          events={events}
          handleEventClick={handleEventClick}
          openPopupForNewEvent={openPopupForNewEvent}
          request={request}
        />
      ) : (
          <WeekView
            date={date}
            events={events}
            handleEventClick={handleEventClick}
            openPopupForNewEvent={openPopupForNewEvent}
            request={request}
          />
        )}

      {isPopupOpen && (
        <Portal>
          <EventPopup
            viewType={viewType}
            selectedEvent={selectedEvent}
            popupMode={popupMode}
            closePopup={closePopup}
            selectedTime={selectedTime}
            request={request}
          />
        </Portal>
      )}

      {isLoading && <Loading />}
    </Container>
  );
};

function getInitialDate({ match }: RouteComponentProps<CalendarProps>) {
  // a date which user is looking
  const initialDate: any = {};
  if (match.params.date) {
    // only for initilization of dates when it's the first open of this app
    const { year, month, date } = match.params;
    initialDate.y = Number(year);
    initialDate.M = Number(month) - 1;
    initialDate.d = Number(date);
  }

  return moment(initialDate);
}

export default Calendar;
