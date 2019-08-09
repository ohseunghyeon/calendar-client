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


      eventWithMoreInfo.startTimeString = start.format('HH시 mm분');
      eventWithMoreInfo.endTimeString = end.format('HH시 mm분');

      // for week view
      // top, height, left, width, z-index, background-color, border-color;
      eventWithMoreInfo.top = (start.hour() + (start.minute() / 60)) * 48;
      // TODO: height는 브라우저 바닥을 못 뚫게...
      eventWithMoreInfo.height = ((end.hour() + (end.minute() / 60))
        - (start.hour() + (start.minute() / 60))) * 48 - 4;

      if (start.date() === end.date()) {
        eventWithMoreInfo.isLast = true;
      }

      start.add(1, 'day');
    });

  return eventsObj;
};

export default transformEventForCalendar;
