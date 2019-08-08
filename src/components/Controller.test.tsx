import React from 'react';
import { Router } from 'react-router-dom';
import { cleanup, render, fireEvent } from '@testing-library/react';
import Controller, { makeTitle } from './Controller';
import moment, { Moment } from 'moment';
import { createMemoryHistory } from 'history';

describe('Controller', () => {
  afterEach(cleanup);

  describe('left, right arrows', () => {
    const setDates = jest.fn();
    let dates: Moment;

    beforeEach(() => {
      dates = moment([2019, 7, 8]);
    });

    it('should add 1 month from dates on right arrow click with month view', () => {
      const { getByTestId, history } = renderWithRouter(
        <Controller setDates={setDates} dates={dates} mode="month" />,
        { route: '/calendar/month' }
      );

      fireEvent.click(getByTestId('right-arrow'));

      const newDate = moment(dates);
      newDate.add(1, 'month').startOf('month');

      expect(setDates).toBeCalledWith(newDate);
      expect(history.location.pathname).toBe('/calendar/month/2019/9/1');
    });

    it('should subtract 1 month from dates on left arrow click with month view', () => {
      const dates = moment([2019, 7, 8]);
      const { getByTestId, history } = renderWithRouter(
        <Controller setDates={setDates} dates={dates} mode="month" />,
        { route: '/calendar/month' }
      );

      fireEvent.click(getByTestId('left-arrow'));

      const newDate = moment(dates);
      newDate.subtract(1, 'month').startOf('month');

      expect(setDates).toBeCalledWith(newDate);
      expect(history.location.pathname).toBe('/calendar/month/2019/7/1');
    });

    it('should add 1 week from dates on right arrow click with week view', () => {
      const dates = moment([2019, 7, 8]);
      const { getByTestId, history } = renderWithRouter(
        <Controller setDates={setDates} dates={dates} mode="week" />,
        { route: '/calendar/week' }
      );

      fireEvent.click(getByTestId('right-arrow'));

      const newDate = moment(dates);
      newDate.add(1, 'week');

      expect(setDates).toBeCalledWith(newDate);
      expect(history.location.pathname).toBe('/calendar/week/2019/8/15');
    });

    it('should subtrack 1 week from dates on left arrow click with week view', () => {
      const dates = moment([2019, 7, 8]);
      const { getByTestId, history } = renderWithRouter(
        <Controller setDates={setDates} dates={dates} mode="week" />,
        { route: '/calendar/week' }
      );

      fireEvent.click(getByTestId('left-arrow'));

      const newDate = moment(dates);
      newDate.subtract(1, 'week');

      expect(setDates).toBeCalledWith(newDate);
      expect(history.location.pathname).toBe('/calendar/week/2019/8/1');
    });
  });

  describe('function makeTitle', () => {
    it('should make proper title for a month', () => {
      const title = makeTitle('month', moment([2019, 7, 8]));
      expect(title).toBe('2019년 8월');
    });
    it('should make proper title for a week', () => {
      const title = makeTitle('week', moment([2019, 7, 8]));
      expect(title).toBe('2019년 8월');
    });
    it('should make proper title for a week between two months', () => {
      const title = makeTitle('week', moment([2019, 7, 1]));
      expect(title).toBe('2019년 7월 - 8월');
    });
  });

  describe('month/week view change button', () => {
    it('should change month to week and week to month with proper url', async () => {
      const dates = moment([2019, 7, 8]);
      const setDates = () => {};
      const { getByTestId, history } = renderWithRouter(
        <Controller setDates={setDates} dates={dates} mode="month" />,
        { route: '/calendar/week' }
      );

      expect(history.location.pathname).toBe('/calendar/week');

      fireEvent.click(getByTestId('week-view'));
      expect(history.location.pathname).toBe('/calendar/week/2019/8/8');
      fireEvent.click(getByTestId('month-view'));
      expect(history.location.pathname).toBe('/calendar/month/2019/8/8');
    });
  });
});

function renderWithRouter(
  ui: JSX.Element,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {}
) {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  };
}
