import React from 'react';
import { Router } from 'react-router-dom';
import { cleanup, render, fireEvent } from '@testing-library/react';
import Controller, { makeTitle } from './Controller';
import moment, { Moment } from 'moment';
import { createMemoryHistory } from 'history';

describe('Controller', () => {
  afterEach(cleanup);

  describe('left, right arrows', () => {
    const setDate = jest.fn();
    let date: Moment;

    beforeEach(() => {
      date = moment([2019, 7, 8]);
    });

    it('should add 1 month from dates on right arrow click with month view', () => {
      const { getByTestId, history } = renderWithRouter(<Controller setDate={setDate} date={date} viewType="month" />, {
        route: '/calendar/month',
      });

      fireEvent.click(getByTestId('right-arrow'));

      const newDate = moment(date);
      newDate.add(1, 'month').startOf('month');

      expect(setDate).toBeCalledWith(newDate);
      expect(history.location.pathname).toBe('/calendar/month/2019/9/1');
    });

    it('should subtract 1 month from dates on left arrow click with month view', () => {
      const { getByTestId, history } = renderWithRouter(<Controller setDate={setDate} date={date} viewType="month" />, {
        route: '/calendar/month',
      });

      fireEvent.click(getByTestId('left-arrow'));

      const newDate = moment(date);
      newDate.subtract(1, 'month').startOf('month');

      expect(setDate).toBeCalledWith(newDate);
      expect(history.location.pathname).toBe('/calendar/month/2019/7/1');
    });

    it('should add 1 week from dates on right arrow click with week view', () => {
      const { getByTestId, history } = renderWithRouter(<Controller setDate={setDate} date={date} viewType="week" />, {
        route: '/calendar/week',
      });

      fireEvent.click(getByTestId('right-arrow'));

      const newDate = moment(date);
      newDate.add(1, 'week');

      expect(setDate).toBeCalledWith(newDate);
      expect(history.location.pathname).toBe('/calendar/week/2019/8/15');
    });

    it('should subtrack 1 week from dates on left arrow click with week view', () => {
      const { getByTestId, history } = renderWithRouter(<Controller setDate={setDate} date={date} viewType="week" />, {
        route: '/calendar/week',
      });

      fireEvent.click(getByTestId('left-arrow'));

      const newDate = moment(date);
      newDate.subtract(1, 'week');

      expect(setDate).toBeCalledWith(newDate);
      expect(history.location.pathname).toBe('/calendar/week/2019/8/1');
    });
  });

  describe('function makeTitle', () => {
    it('should make proper title for a month', () => {
      const title = makeTitle({
        viewType: 'month',
        date: moment([2019, 7, 8]),
      });
      expect(title).toBe('2019년 8월');
    });
    it('should make proper title for a week', () => {
      const title = makeTitle({ viewType: 'week', date: moment([2019, 7, 8]) });
      expect(title).toBe('2019년 8월');
    });
    it('should make proper title for a week between two months', () => {
      const title = makeTitle({ viewType: 'week', date: moment([2019, 7, 1]) });
      expect(title).toBe('2019년 7월 - 8월');
    });
  });

  describe('month/week view change button', () => {
    it('should change month to week and week to month with proper url', async () => {
      const date = moment([2019, 7, 8]);
      const { getByTestId, history } = renderWithRouter(<Controller setDate={() => {}} date={date} viewType="month" />, {
        route: '/calendar/week',
      });

      expect(history.location.pathname).toBe('/calendar/week');

      fireEvent.click(getByTestId('week-view'));
      expect(history.location.pathname).toBe('/calendar/week/2019/8/8');
      fireEvent.click(getByTestId('month-view'));
      expect(history.location.pathname).toBe('/calendar/month/2019/8/8');
    });
  });
});

function renderWithRouter(ui: JSX.Element, { route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {}) {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  };
}
