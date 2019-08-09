import React, { useState } from 'react';
import styled from 'styled-components';
import moment, { Moment } from 'moment';
import { RouteComponentProps } from 'react-router-dom';
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
  const initialDate: any = {};
  if (match.params.date) {
    // only for initilization of dates
    initialDate.y = Number(match.params.year);
    initialDate.M = Number(match.params.month) - 1;
    initialDate.d = Number(match.params.date);
  }

  const [dates, setDates] = useState<Moment>(moment(initialDate));

  const mode = match.params.mode || 'month';

  const { events } = useEventService(dates, mode);

  return (
    <Container>
      <Controller mode={mode} setDates={setDates} dates={dates} />

      {mode === 'month' ? (
        <MonthView dates={dates} events={events} />
      ) : (
        <WeekView events={events} />
      )}

      {/* {status === 'loading' && <div>Loading...</div>}
      {status === 'error' && (
        <div>Error, the backend moved to the dark side.</div>
      )} */}
    </Container>
  );
};

export default Calendar;
