import React from 'react';
import moment from 'moment';

const MonthView: React.FC<{
  events: {
    id: string;
    title: string;
    start: number;
    end: number;
  }[];
}> = ({ events }) => {
  return (
    <div>
      {events.map(event => (
        <div key={event.id}>
          <div>name: {event.title}</div>
          <div>start: {moment(event.start).format('YYYY-MM-DD HH:mm')}</div>
          <div>end: {moment(event.end).format('HH:mm')}</div>
        </div>
      ))}
    </div>
  );
};

export default MonthView;
