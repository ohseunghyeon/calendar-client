import React from 'react';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import { Moment } from 'moment';
import { History } from 'history';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import moment from 'moment';

interface ControllerProps {
  mode: 'month' | 'week';
  dates: Moment;
  setDates: Function;
  history: History;
}

export const makeTitle = (mode: 'month' | 'week', dates: Moment) => {
  let title = `${dates.year()}년 ${dates.month() + 1}월`;
  if (mode === 'week') {
    const startMonth = moment(dates)
      .startOf('week')
      .month();
    const endMonth = moment(dates)
      .endOf('week')
      .month();
    if (startMonth !== endMonth) {
      title = `${dates.year()}년 ${startMonth + 1}월 - ${endMonth + 1}월`;
    }
  }
  return title;
};

const Controller: React.FC<RouteComponentProps & ControllerProps> = ({
  mode,
  dates,
  setDates,
  history,
}) => {
  const handleArrowClick = (arrow: 'add' | 'subtract') => () => {
    const newDate = moment(dates);
    // month 또는 week에 1을 더하거나 빼기
    newDate[arrow](1, mode === 'month' ? 'M' : 'w');

    // month 이동 후 그 달의 첫 날로
    if (mode === 'month') {
      newDate.startOf('month');
    }
    setDates(newDate);
    history.push(
      `/calendar/${mode}/${newDate.year()}/${newDate.month() +
        1}/${newDate.date()}`
    );
  };

  return (
    <div>
      <ArrowBackIos
        data-testid="left-arrow"
        onClick={handleArrowClick('subtract')}
      />
      {makeTitle(mode, dates)}
      <ArrowForwardIos
        data-testid="right-arrow"
        onClick={handleArrowClick('add')}
      />

      <Link
        data-testid="month-view"
        to={`/calendar/month/${dates.year()}/${dates.month() +
          1}/${dates.date()}`}>
        Month
      </Link>
      <Link
        data-testid="week-view"
        to={`/calendar/week/${dates.year()}/${dates.month() +
          1}/${dates.date()}`}>
        Week
      </Link>
    </div>
  );
};

export default withRouter(Controller);
