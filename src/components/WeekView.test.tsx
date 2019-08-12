import React from 'react';
import { cleanup, render, fireEvent } from '@testing-library/react';
import WeekView, { makeDatesForWeek } from './WeekView';
import moment, { Moment } from 'moment';
import 'moment/locale/ko';
import fetchService from '../services/fetch.service';
import { Event } from '../types/Event';
import { ONE_HOUR_HEIGHT_PIXELS } from '../constants';
import transformEventForCalendar from '../util/transformEventForCalendar';

describe('WeekView', () => {
  afterEach(cleanup);

  let handleEventClick: jest.Mock;
  let openPopupForNewEvent: jest.Mock;
  let setReadyToFetch: jest.Mock;
  let events: Event[];
  let date: Moment;

  beforeEach(() => {
    handleEventClick = jest.fn();
    openPopupForNewEvent = jest.fn();
    setReadyToFetch = jest.fn();
    events = [
      {
        id: 1,
        title: 'test event',
        start: new Date('2019-08-06T10:00:00').getTime(),
        end: new Date('2019-08-06T11:00:00').getTime(),
      },
    ];
    date = moment([2019, 7, 6]);
  });

  it('should render event data', () => {
    const { container, getByTestId } = render(
      <WeekView
        date={date}
        events={events}
        handleEventClick={handleEventClick}
        openPopupForNewEvent={openPopupForNewEvent}
        setReadyToFetch={setReadyToFetch}
      />
    );

    expect(getByTestId('6-0').querySelector('span[data-testid="title"]')).toHaveTextContent('test event');
    expect(getByTestId('6-0').querySelector('div[data-testid="time"]')).toHaveTextContent('오전 10시~오전 11시');
  });

  it('should invoke handleEventClick on event click', () => {
    const { getByTestId } = render(
      <WeekView
        date={date}
        events={events}
        handleEventClick={handleEventClick}
        openPopupForNewEvent={openPopupForNewEvent}
        setReadyToFetch={setReadyToFetch}
      />
    );

    fireEvent.click(getByTestId('6-0'));
    expect(openPopupForNewEvent).toBeCalledTimes(0);
    expect(handleEventClick).toBeCalledTimes(1);
    expect(handleEventClick).toBeCalledWith(expect.objectContaining(events[0]));
    expect(setReadyToFetch).toBeCalledTimes(0);
  });

  it('should invoke openPopupForNewEvent on date click', () => {
    const { getByTestId } = render(
      <WeekView
        date={date}
        events={events}
        handleEventClick={handleEventClick}
        openPopupForNewEvent={openPopupForNewEvent}
        setReadyToFetch={setReadyToFetch}
      />
    );

    const RANDOM_OFFSET_X = 20;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(event, 'offsetX', { get: () => RANDOM_OFFSET_X });
    Object.defineProperty(event, 'offsetY', { get: () => ONE_HOUR_HEIGHT_PIXELS * 15 }); // 720 = 15 * 48(one hour of height pixels)

    fireEvent(getByTestId('Date-6'), event);

    expect(openPopupForNewEvent).toBeCalledTimes(1);
    expect(openPopupForNewEvent).toBeCalledWith(new Date(2019, 7, 6, 15).getTime());
    expect(handleEventClick).toBeCalledTimes(0);
    expect(setReadyToFetch).toBeCalledTimes(0);
  });

  it('should drag and drop event to other date and invoke update request', () => {
    fetchService.fetch = jest.fn();

    // it has start, end which is 1 date tile added
    const changedEvent = {
      id: 1,
      title: 'test event',
      start: new Date('2019-08-07T15:00:00').getTime(),
      end: new Date('2019-08-07T16:00:00').getTime(),
    };

    const { getByTestId } = render(
      <WeekView
        date={date}
        events={events}
        handleEventClick={handleEventClick}
        openPopupForNewEvent={openPopupForNewEvent}
        setReadyToFetch={setReadyToFetch}
      />
    );

    fireEvent.dragStart(getByTestId('6-0'));

    const RANDOM_OFFSET_X = 20;
    const event = new MouseEvent('dragover', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(event, 'offsetX', { get: () => RANDOM_OFFSET_X });
    Object.defineProperty(event, 'offsetY', { get: () => ONE_HOUR_HEIGHT_PIXELS * 15 }); // 720 = 15 * 48(one hour of height pixels)
    fireEvent(getByTestId('Date-7'), event);

    fireEvent.dragEnd(getByTestId('6-0'));
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
      const week = makeDatesForWeek(m, transformedEvents);
      expect(week[0].date).toBe('15');
      expect(week[6].date).toBe('21');

      const m2 = moment([2019, 7, 15]);
      const week2 = makeDatesForWeek(m2, transformedEvents);
      expect(week2[0].date).toBe('11');
      expect(week2[1].date).toBe('12');
    });
  });
});
