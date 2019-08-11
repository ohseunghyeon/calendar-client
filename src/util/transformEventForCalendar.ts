import moment from 'moment';
import { Event } from '../types/Event';

const PIXELS_OF_ONE_EVENT_IN_WEEK_VIEW = 48;

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

      eventWithMoreInfo.startTimeString = start.format('a hh시');
      eventWithMoreInfo.endTimeString = end.format('a hh시');

      // for week view
      eventWithMoreInfo.top = (start.hour() + start.minute() / 60) * PIXELS_OF_ONE_EVENT_IN_WEEK_VIEW;
      eventWithMoreInfo.height =
        (end.hour() + end.minute() / 60 - (start.hour() + start.minute() / 60)) * PIXELS_OF_ONE_EVENT_IN_WEEK_VIEW - 4;
      // this number 4 makes an event's bottom to have a little buffer space

      start.add(1, 'day');
    });

  return eventsObj;
};

export default transformEventForCalendar;
