import React from 'react';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import { Moment } from 'moment';
import { History } from 'history';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';

interface ControllerProps {
  mode: 'month' | 'week';
  dates: Moment;
  setDates: Function;
  history: History;
}

const Container = styled.div`
  display: flex;
  height: 50px;
  justify-content: space-around;
  align-items: center;
  border-bottom: var(--border) 1px solid;
`;

const TitleWrapper = styled.div`
  display: flex;
  min-width: 200px;
`;

const Title = styled.div`
  color: var(--main-text);
`;

const ArrowWrapper = styled.div`
  margin-right: 20px;
`;

const MonthWeekButton = styled(Link)`
  color: var(--main-text);
  border: #000 1px solid;
  text-decoration: none;
  padding: 5px;
  &:first-child {
    border-right: none;
  }
  &.selected {
    background-color: var(--primary-bg);
    color: var(--primary-text);
  }
`;

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
        <Title>{makeTitle(mode, dates)}</Title>
      </TitleWrapper>

      <div>
        <MonthWeekButton
          className={mode === 'month' ? 'selected' : ''}
          data-testid="month-view"
          to={`/calendar/month/${dates.year()}/${dates.month() +
            1}/${dates.date()}`}>
          Month
        </MonthWeekButton>
        <MonthWeekButton
          className={mode === 'week' ? 'selected' : ''}
          data-testid="week-view"
          to={`/calendar/week/${dates.year()}/${dates.month() +
            1}/${dates.date()}`}>
          Week
        </MonthWeekButton>
      </div>
    </Container>
  );
};

export default withRouter(Controller);
