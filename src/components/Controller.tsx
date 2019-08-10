import React, { Dispatch, SetStateAction } from 'react';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import { Moment } from 'moment';
import { History } from 'history';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import moment from 'moment';
import {
  Container,
  TitleWrapper,
  ArrowWrapper,
  Title,
  MonthWeekButton,
} from './Controller.styled';

interface ControllerProps {
  mode: 'month' | 'week';
  date: Moment;
  setDate: Dispatch<SetStateAction<Moment>>;
  history: History;
}

export const makeTitle = (mode: 'month' | 'week', date: Moment) => {
  let title = `${date.year()}년 ${date.month() + 1}월`;
  if (mode === 'week') {
    const startMonth = moment(date)
      .startOf('week')
      .month();
    const endMonth = moment(date)
      .endOf('week')
      .month();
    if (startMonth !== endMonth) {
      title = `${date.year()}년 ${startMonth + 1}월 - ${endMonth + 1}월`;
    }
  }
  return title;
};

const Controller: React.FC<RouteComponentProps & ControllerProps> = ({
  mode,
  date,
  setDate,
  history,
}) => {
  const handleArrowClick = (arrow: 'add' | 'subtract') => () => {
    const newDate = moment(date);
    // month 또는 week에 1을 더하거나 빼기
    newDate[arrow](1, mode === 'month' ? 'M' : 'w');

    // month 이동 후 그 달의 첫 날로
    if (mode === 'month') {
      newDate.startOf('month');
    }
    setDate(newDate);
    history.push(
      `/calendar/${mode}/${newDate.year()}/${newDate.month() +
        1}/${newDate.date()}`
    );
  };

  return (
    <Container>
      <TitleWrapper>
        <ArrowWrapper>
          <ArrowBackIos
            data-testid="left-arrow"
            style={{ cursor: 'pointer' }}
            onClick={handleArrowClick('subtract')}
          />
          <ArrowForwardIos
            data-testid="right-arrow"
            style={{ cursor: 'pointer' }}
            onClick={handleArrowClick('add')}
          />
        </ArrowWrapper>
        <Title>{makeTitle(mode, date)}</Title>
      </TitleWrapper>

      <div>
        <MonthWeekButton
          className={mode === 'month' ? 'selected' : ''}
          data-testid="month-view"
          to={`/calendar/month/${date.year()}/${date.month() +
            1}/${date.date()}`}>
          Month
        </MonthWeekButton>
        <MonthWeekButton
          className={mode === 'week' ? 'selected' : ''}
          data-testid="week-view"
          to={`/calendar/week/${date.year()}/${date.month() +
            1}/${date.date()}`}>
          Week
        </MonthWeekButton>
      </div>
    </Container>
  );
};

export default withRouter(Controller);
