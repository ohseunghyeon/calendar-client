import { useEffect, useState } from 'react';
import { Event } from '../types/Event';
import moment, { Moment } from 'moment';

const useEventService = (dates: Moment, mode: 'month' | 'week') => {
  // const [status, setStatus] = useState<string>('loading');
  const [events, setEvents] = useState<Event[]>([]);
  const [readyToFetch, setReadyToFetch] = useState(true);

  const firstDate = moment(dates).startOf(mode);
  const lastDate = moment(dates).endOf(mode);
  if (mode === 'month') {
    // 첫 번째 주에 있는 지난 달 마지막 날들도 가져오기
    // 마지막 주에 있는 다음 달 처음 날들도 가져오기
    firstDate.startOf('week');
    lastDate.endOf('week');
  }

  const start = firstDate.unix() * 1000;
  const end = lastDate.unix() * 1000;

  // firstDate나 lastDate 변경 시에 readyToFetch 변경하고
  useEffect(() => {
    setReadyToFetch(true);
  }, [start, end]);

  // readytofetch 변경됐을 때 fetch 하는지 보고
  useEffect(() => {
    if (readyToFetch) {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/events?start=${start}&end=${end}`
      )
        .then(response => response.json())
        .then(body => {
          // setStatus('loaded');
          setReadyToFetch(false);
          if (body.error) {
            errorHandler(body.error);
          } else {
            setEvents(body);
          }
        })
        .catch(error => errorHandler(error.message));
    }
  }, [readyToFetch]);

  return {
    events,
    // status,
    setReadyToFetch,
  };
};

// error return 했을 때 errorHandler 작동하는지 보고
const errorHandler = (message: string) => {
  console.log(message);
};

export default useEventService;
