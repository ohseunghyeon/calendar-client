import { useEffect, useState, useCallback } from 'react';
import fetchService, { fetchWrapperProps } from '../services/fetch.service';
import { Event } from '../types/Event';
import moment, { Moment } from 'moment';
import transformEventForCalendar from '../util/transformEventForCalendar';

const useEventService = (dates: Moment, viewType: 'month' | 'week') => {
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState({});
  const [readyToFetch, setReadyToFetch] = useState(true);

  const request = useCallback(
    (props: fetchWrapperProps) => {
      setIsLoading(true);
      props.finalCb = () => {
        if (props.method !== 'GET') setReadyToFetch(true);
        if (props.method === 'GET') setIsLoading(false);
      }
      fetchService.fetchWrapper(props);
    },
    []
  );

  const firstDate = moment(dates).startOf(viewType);
  const lastDate = moment(dates).endOf(viewType);
  if (viewType === 'month') {
    // ex) when we fetch August, fetch July's late days and September's early days
    firstDate.startOf('week');
    lastDate.endOf('week');
  }

  const start = firstDate.unix() * 1000;
  const end = lastDate.unix() * 1000;

  useEffect(() => setReadyToFetch(true), [start, end]);

  useEffect(() => {
    if (readyToFetch) {
      request({
        method: 'GET',
        callback: (events: Event[]) => {
          const eventObj = transformEventForCalendar(events);
          setEvents(eventObj);
        },
        qs: {
          start,
          end,
        },
      });
      setReadyToFetch(false);
    }
  }, [readyToFetch, request, start, end]);

  return {
    isLoading,
    events,
    request
  };
};

export default useEventService;
