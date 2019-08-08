import React from 'react';
import moment from 'moment';
import { Event } from './Calendar';

const MonthView: React.FC<{
  events: Event[];
}> = ({ events }) => {
  console.log(events);
  return (
    <div>
      {events.map(event => (
        <div key={event.id}>
          <div data-testid="title">title: {event.title}</div>
          <div data-testid="start">start: {moment(event.start).format('YYYY-MM-DD HH:mm')}</div>
          <div data-testid="end">end: {moment(event.end).format('YYYY-MM-DD HH:mm')}</div>
        </div>
      ))}
    </div>
  );
};

export default MonthView;
