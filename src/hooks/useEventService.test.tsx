import React from 'react';
import { cleanup, render } from '@testing-library/react';
import useEventService from './useEventService';
import moment, { Moment } from 'moment';
import fetchService from '../services/fetch.service';

interface TestProps {
  date: Moment;
  viewType: 'month' | 'week';
}

const Test: React.FC<TestProps> = ({ date, viewType }) => {
  useEventService(date, viewType);

  return <div></div>;
};

describe('useEventService', () => {
  afterEach(cleanup);

  it('should invoke get fetch once, properly on month type', () => {
    fetchService.fetch = jest.fn();
    const {} = render(<Test date={moment([2019, 7, 11])} viewType="month" />);
    expect(fetchService.fetch).toBeCalledTimes(1);
    expect(fetchService.fetch).toBeCalledWith(
      expect.objectContaining({
        method: 'GET',
        qs: {
          start: 1564239600000,
          end: 1567263599000,
        },
      })
    );
  });

  it('should invoke get fetch once', () => {
    fetchService.fetch = jest.fn();
    const {} = render(<Test date={moment([2019, 7, 11])} viewType="week" />);
    expect(fetchService.fetch).toBeCalledTimes(1);
    expect(fetchService.fetch).toBeCalledWith(
      expect.objectContaining({
        method: 'GET',
        qs: {
          start: 1565449200000,
          end: 1566053999000,
        },
      })
    );
  });

  it('should invoke get fetch when date is changed', () => {
    fetchService.fetch = jest.fn();
    const { rerender } = render(<Test date={moment([2019, 7, 11])} viewType="week" />);

    rerender(<Test date={moment([2019, 7, 18])} viewType="week" />);

    expect(fetchService.fetch).toBeCalledTimes(2);
  });
});
