import React from 'react';
import moment, { Moment } from 'moment';
import { Event } from '../types/Event';

interface Props {
  dates: Moment;
  events: Event[];
}

const MonthView: React.FC<Props> = ({ dates, events }) => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];

  // 몇 개의 주가 되는지 계산
  const weeks = [];

  return (
    <div>
      <div>
        {days.map(day => (
          <div key={day}>
            <span>{day}</span>
          </div>
        ))}
      </div>
      {events.map(event => (
        <div key={event.id}>
          <div data-testid="title">title: {event.title}</div>
          <div data-testid="start">
            start: {moment(event.start).format('YYYY-MM-DD HH:mm')}
          </div>
          <div data-testid="end">
            end: {moment(event.end).format('YYYY-MM-DD HH:mm')}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonthView;
