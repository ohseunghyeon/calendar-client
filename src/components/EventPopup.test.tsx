import React from 'react';
import { cleanup, render, fireEvent } from '@testing-library/react';
import EventPopup from './EventPopup';
import moment from 'moment';
import { Event } from '../types/Event';
import { HOUR } from '../constants';

describe('EventPopup', () => {
  afterEach(cleanup);

  let date: Date;
  let closePopup: jest.Mock;
  let request: jest.Mock;

  beforeEach(() => {
    date = new Date();
    closePopup = jest.fn();
    request = jest.fn();
  });

  it('should render title, start time, end time with provided event', () => {
    const selectedEvent: Event = {
      id: 1,
      title: '타이틀',
      start: date.getTime(),
      end: date.getTime() + HOUR,
    };

    const { getByTestId } = render(
      <EventPopup
        viewType="month"
        selectedEvent={selectedEvent}
        popupMode="update"
        closePopup={closePopup}
        selectedTime={date}
        request={request}
      />
    );

    expect(getByTestId('title').getAttribute('value')).toBe('타이틀');
    const inputs = getByTestId('pickers').querySelectorAll('input');
    const start = inputs[0];
    const end = inputs[1];
    expect(start.value).toBe(
      moment(date)
        .format('YYYY-MM-DD h:mm a')
        .toUpperCase()
    );
    expect(end.value).toBe(
      moment(date.getTime() + HOUR)
        .format('YYYY-MM-DD h:mm a')
        .toUpperCase()
    );
  });

  it('should render empty title, current start time, end time which is one hour later of start time on new mode', () => {
    const { getByTestId } = render(
      <EventPopup
        viewType="week"
        popupMode="new"
        closePopup={closePopup}
        selectedTime={date}
        request={request}
      />
    );

    expect(getByTestId('title').getAttribute('value')).toBe('');
    const inputs = getByTestId('pickers').querySelectorAll('input');
    const start = inputs[0];
    const end = inputs[1];
    expect(start.value).toBe(
      moment(date)
        .format('YYYY-MM-DD h:mm a')
        .toUpperCase()
    );
    expect(end.value).toBe(
      moment(date.getTime() + HOUR)
        .format('YYYY-MM-DD h:mm a')
        .toUpperCase()
    );
  });

  it('should invoke closePopup function on Dim click', () => {
    const { getByTestId } = render(
      <EventPopup
        viewType="month"
        popupMode="new"
        closePopup={closePopup}
        selectedTime={date}
        request={request}
      />
    );
    fireEvent.click(getByTestId('dim'));
    expect(closePopup).toBeCalledTimes(1);
  });

  it('should invoke closePopup function on cancle button click', () => {
    const selectedEvent: Event = {
      id: 1,
      title: '타이틀',
      start: date.getTime(),
      end: date.getTime() + HOUR,
    };

    const { getByTestId } = render(
      <EventPopup
        viewType="month"
        selectedEvent={selectedEvent}
        popupMode="update"
        closePopup={closePopup}
        selectedTime={date}
        request={request}
      />
    );
    fireEvent.click(getByTestId('cancel'));
    expect(closePopup).toBeCalledTimes(1);
  });

  it('should invoke put fetcher with body on save click', () => {
    const selectedEvent: Event = {
      id: 1,
      title: '타이틀',
      start: date.getTime(),
      end: date.getTime() + HOUR,
    };

    const { getByTestId } = render(
      <EventPopup
        viewType="month"
        selectedEvent={selectedEvent}
        popupMode="update"
        closePopup={closePopup}
        selectedTime={date}
        request={request}
      />
    );
    fireEvent.click(getByTestId('save'));
    expect(request).toBeCalledTimes(1);
    expect(request).toBeCalledWith(
      expect.objectContaining({
        method: 'PUT',
        body: selectedEvent,
      })
    );
  });

  it('should invoke delete fetcher with id on remove click', () => {
    const selectedEvent: Event = {
      id: 1,
      title: '타이틀',
      start: date.getTime(),
      end: date.getTime() + HOUR,
    };

    const { getByTestId } = render(
      <EventPopup
        viewType="month"
        selectedEvent={selectedEvent}
        popupMode="update"
        closePopup={closePopup}
        selectedTime={date}
        request={request}
      />
    );
    fireEvent.click(getByTestId('remove'));
    expect(request).toBeCalledTimes(1);
    expect(request).toBeCalledWith(
      expect.objectContaining({
        method: 'DELETE',
        body: { id: 1 },
      })
    );
  });
});
