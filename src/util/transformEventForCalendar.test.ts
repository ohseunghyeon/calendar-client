import { cleanup } from '@testing-library/react';
import transformEventForCalendar from './transformEventForCalendar';

describe('function transformEventForCalendar', () => {
  afterEach(cleanup);

  it('should transform array of event to object', () => {
    const eventsObj = transformEventForCalendar([
      {
        id: 1,
        title: 'meeting friends',
        start: new Date('2019-08-06T08:00:00Z').getTime(),
        end: new Date('2019-08-06T09:00:00Z').getTime(),
      },
      {
        id: 2,
        title: 'watching movie',
        start: new Date('2019-08-07T05:00:00').getTime(),
        end: new Date('2019-08-07T07:00:00').getTime(),
      },
      {
        id: 3,
        title: 'reading a book',
        start: new Date('2019-08-06T03:00:00').getTime(),
        end: new Date('2019-08-06T04:00:00').getTime(),
      },
      {
        id: 4,
        title: 'listening songs',
        start: new Date('2019-08-08T02:00:00').getTime(),
        end: new Date('2019-08-08T03:00:00').getTime(),
      },
    ]);

    expect(JSON.stringify(eventsObj)).toBe(
      '{"7":{"6":[{"id":3,"title":"reading a book","start":1565028000000,"end":1565031600000,"startTimeString":"am 03시","endTimeString":"am 04시","top":144,"height":44},{"id":1,"title":"meeting friends","start":1565078400000,"end":1565082000000,"startTimeString":"pm 05시","endTimeString":"pm 06시","top":816,"height":44}],"7":[{"id":2,"title":"watching movie","start":1565121600000,"end":1565128800000,"startTimeString":"am 05시","endTimeString":"am 07시","top":240,"height":92}],"8":[{"id":4,"title":"listening songs","start":1565197200000,"end":1565200800000,"startTimeString":"am 02시","endTimeString":"am 03시","top":96,"height":44}]}}'
    );
  });
});
