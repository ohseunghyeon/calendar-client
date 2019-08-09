import moment from 'moment';
import { Event } from '../types/Event';

const transformEventForCalendar = (events: Event[]) => {
  const eventsObj: any = {};
  events
    .sort((a, b) => a.start - b.start) // 시간 정렬
    .forEach(event => {
      const start = moment(event.start);
      const end = moment(event.end);

      const month = start.month();
      const date = start.date();

      const eventWithMoreInfo: any = { ...event };

      if (!eventsObj[month]) {
        eventsObj[month] = {};
      }
      if (!eventsObj[month][date]) {
        eventsObj[month][date] = [];
      }
      eventsObj[month][date].push(eventWithMoreInfo);

      eventWithMoreInfo.timeString = moment(event.start).format('HH시 mm분')

      if (start.date() === end.date()) {
        eventWithMoreInfo.isLast = true;
      }

      start.add(1, 'day');
    });

  return eventsObj;
};

export default transformEventForCalendar;
