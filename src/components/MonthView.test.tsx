import React from 'react';
import ReactDOM from 'react-dom';
import { cleanup, render, waitForDomChange } from '@testing-library/react';
import MonthView from './MonthView';
import { getEvents } from '../services/request-service';

describe('MonthView', () => {
  afterEach(cleanup);

  it('renders fetched events data', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([
          {
            id: 1,
            title: 'test event',
            start: new Date('2019-08-06T01:00:00').getTime(),
            end: new Date('2019-08-06T01:59:59').getTime()
          }
        ])
    );

    {
      const events = await getEvents();
      const { container, getByTestId } = render(<MonthView events={events} />);

      // await waitForDomChange({ container });

      expect(getByTestId('title')).toHaveTextContent('test event');
      expect(getByTestId('start')).toHaveTextContent('2019-08-06 01:00');
      expect(getByTestId('end')).toHaveTextContent('2019-08-06 01:59');
    }
  })
});