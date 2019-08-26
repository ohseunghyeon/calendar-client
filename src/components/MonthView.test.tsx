import React from 'react';
import { cleanup, render, fireEvent } from '@testing-library/react';
import MonthView from './MonthView';
import moment, { Moment } from 'moment';
import { makeDatesForMonth } from './MonthView';
import transformEventForCalendar from '../util/transformEventForCalendar';
import fetchService from '../services/fetch.service';
import { Event } from '../types/Event';

describe('MonthView', () => {
  afterEach(cleanup);

  let handleEventClick: jest.Mock;
  let openPopupForNewEvent: jest.Mock;
  let setReadyToFetch: jest.Mock;
  let setIsLoading: jest.Mock;
  let events: Event[];
  let date: Moment;

  beforeEach(() => {
    handleEventClick = jest.fn();
    openPopupForNewEvent = jest.fn();
    setReadyToFetch = jest.fn();
    setIsLoading = jest.fn();
    events = [
      {
        id: 1,
        title: 'test event',
        start: new Date('2019-08-06T01:00:00').getTime(),
        end: new Date('2019-08-06T02:00:00').getTime(),
      },
    ];
    date = moment([2019, 7, 6]);
  });

  it('should render event data', () => {
    const { getByTestId } = render(
      <MonthView
        date={date}
        events={events}
        handleEventClick={handleEventClick}
        openPopupForNewEvent={openPopupForNewEvent}
        setIsLoading={setIsLoading}
        setReadyToFetch={setReadyToFetch}
      />
    );

    expect(getByTestId('7-6-0').querySelector('div[data-testid="title"]')).toHaveTextContent('am 01시 test event');
  });

  it('should invoke handleEventClick on event click', () => {
    const { getByTestId } = render(
      <MonthView
        date={date}
        events={events}
        handleEventClick={handleEventClick}
        openPopupForNewEvent={openPopupForNewEvent}
        setIsLoading={setIsLoading}
        setReadyToFetch={setReadyToFetch}
      />
    );

    fireEvent.click(getByTestId('7-6-0'));
    expect(openPopupForNewEvent).toBeCalledTimes(0);
    expect(handleEventClick).toBeCalledTimes(1);
    expect(handleEventClick).toBeCalledWith(expect.objectContaining(events[0]));
    expect(setReadyToFetch).toBeCalledTimes(0);
  });

  it('should invoke openPopupForNewEvent on date click', () => {
    const { getByTestId } = render(
      <MonthView
        date={date}
        events={events}
        handleEventClick={handleEventClick}
        openPopupForNewEvent={openPopupForNewEvent}
        setIsLoading={setIsLoading}
        setReadyToFetch={setReadyToFetch}
      />
    );

    fireEvent.click(getByTestId('TW-7-6'));
    expect(openPopupForNewEvent).toBeCalledTimes(1);
    expect(openPopupForNewEvent).toBeCalledWith(new Date(2019, 7, 6).getTime());
    expect(handleEventClick).toBeCalledTimes(0);
    expect(setReadyToFetch).toBeCalledTimes(0);
  });

  it('should drag and drop event to other date and invoke update request', () => {
    fetchService.fetch = jest.fn();

    // it has start, end which is 1 date tile added
    const changedEvent = {
      id: 1,
      title: 'test event',
      start: new Date('2019-08-07T01:00:00').getTime(),
      end: new Date('2019-08-07T02:00:00').getTime(),
    };

    const { getByTestId } = render(
      <MonthView
        date={date}
        events={events}
        handleEventClick={handleEventClick}
        openPopupForNewEvent={openPopupForNewEvent}
        setIsLoading={setIsLoading}
        setReadyToFetch={setReadyToFetch}
      />
    );

    fireEvent.dragStart(getByTestId('7-6-0'), {
      dataTransfer: {
        a: 1
      }
    });
    fireEvent.drop(getByTestId('TW-7-7'));
    expect(fetchService.fetch).toBeCalledTimes(1);
    expect(fetchService.fetch).toBeCalledWith(
      expect.objectContaining({
        method: 'PUT',
        body: changedEvent,
      })
    );
  });

  describe('function makeDates', () => {
    it('should return an array which has proper dates number by provided moment object', () => {
      const transformedEvents = transformEventForCalendar(events);

      const m = moment([2019, 8, 15]);
      const { weeks } = makeDatesForMonth(m, transformedEvents);
      expect(weeks[0][0].dateTitle).toBe('9월 1일');
      expect(weeks[4][6].dateTitle).toBe('5');

      const m2 = moment([2019, 7, 15]);
      const { weeks: weeks2, heights } = makeDatesForMonth(m2, transformedEvents);
      expect(weeks2[0][0].dateTitle).toBe('28');
      expect(weeks2[0][0].isThisMonth).toBe(false);
      expect(heights[0]).toBe(0);

      expect(weeks2[4][6].dateTitle).toBe('31');
      expect(weeks2[4][6].events.length).toBe(0);
      expect(heights[4]).toBe(0);

      expect(weeks2[1][2].dateTitle).toBe('6');
      expect(weeks2[1][2].events.length).toBe(1);
      expect(weeks2[1][2].isThisMonth).toBe(true);
      expect(heights[1]).toBe(1);
    });
  });
});
