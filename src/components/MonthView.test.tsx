import React from 'react';
import { cleanup, render, waitForDomChange } from '@testing-library/react';
import MonthView from './MonthView';
import moment from 'moment';

describe('MonthView', () => {
  afterEach(cleanup);

  it('should render events data', () => {
    const events = [
      {
        id: 1,
        title: 'test event',
        start: new Date('2019-08-06T01:00:00').getTime(),
        end: new Date('2019-08-06T01:59:59').getTime(),
      },
    ];
    const dates = moment([2019, 8, 6]);

    const { container, getByTestId } = render(
      <MonthView dates={dates} events={events} />
    );

    expect(getByTestId('title')).toHaveTextContent('test event');
    expect(getByTestId('start')).toHaveTextContent('2019-08-06 01:00');
    expect(getByTestId('end')).toHaveTextContent('2019-08-06 01:59');
  });

  it('should render a month properly', () => {
    const events = [
      {
        id: 1,
        title: 'test event',
        start: new Date('2019-08-06T01:00:00').getTime(),
        end: new Date('2019-08-06T01:59:59').getTime(),
      },
    ];
    const dates = moment([2019, 8, 6]);

    const { container, getByTestId } = render(
      <MonthView dates={dates} events={events} />
    );
  });
});
