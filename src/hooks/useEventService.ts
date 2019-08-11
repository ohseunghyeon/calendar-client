import { useEffect, useState } from 'react';
import fetchService from '../services/fetch.service';
import { Event } from '../types/Event';
import moment, { Moment } from 'moment';

const useEventService = (dates: Moment, mode: 'month' | 'week') => {
  const [events, setEvents] = useState<Event[]>([]);
  const [readyToFetch, setReadyToFetch] = useState(true);

  const firstDate = moment(dates).startOf(mode);
  const lastDate = moment(dates).endOf(mode);
  if (mode === 'month') {
    // ex) when we fetch August, fetch July's late days and September's early days
    firstDate.startOf('week');
    lastDate.endOf('week');
  }

  const start = firstDate.unix() * 1000;
  const end = lastDate.unix() * 1000;

  useEffect(() => setReadyToFetch(true), [start, end]);

  useEffect(() => {
    if (readyToFetch) {
      fetchService.fetch({
        method: 'GET',
        callback: setEvents,
        qs: {
          start,
          end,
        },
      });
      setReadyToFetch(false);
    }
  }, [readyToFetch]);

  return {
    events,
    setReadyToFetch,
  };
};

export default useEventService;
