import React from 'react';
import { FiberManualRecord } from '@material-ui/icons'
import moment, { Moment } from 'moment';
import { Event } from '../types/Event';
import transformEventForCalendar from '../util/transformEventForCalendar';
import {
  CalendarWrapper,
  DayText,
  Day,
  DaysRow,
  Wrapper,
  Weeks,
  OneWeek,
  DateTitle,
  DateTitleWrapper,
  DateTitleText,
  EventsWrapper,
  EventsInnerWrapper,
  EventWrapper,
  OneEventWrapper,
  OneEvent
} from './MonthView.styled';

interface Props {
  dates: Moment;
  events: Event[];
}

// TODO: 얘 나중에 쪼개야겠다.
/**
 * 캘린더에 쓸 Week [], dates [] 생성.
 * ex) 4주면 [['1', '2'...], [...], [..], [..]]
 */
export const makeDates = (dates: Moment, eventsObj: any) => {
  const weeks: {
    dateTitle: string; // 몇 월 몇 일인지
    isThisMonth: boolean; // 이 날이 보고 있는 달인지 지난 달 말인지 다음 달 초인지
    events: []; // 이 날의 이벤트들
  }[][] = [];

  const heights: number[] = [];

  const firstDate = moment(dates)
    .startOf('month')
    .startOf('week');
  const lastDate = moment(dates)
    .endOf('month')
    .endOf('week');

  let week = 0;
  while (firstDate.isSameOrBefore(lastDate)) {
    const m = firstDate.month();
    const d = firstDate.date();
    let isThisMonth = false;

    // 전 달 혹은 다음 달인 경우 week을 계산하지 않음
    // 현재 8월인데 7월 마지막 주를 계산에 넣게 되면 0 번째 week이어야 하는데
    // 5번째 week으로 계산함
    if (m === dates.month()) {
      week =
        firstDate.week() -
        moment(firstDate)
          .startOf('month')
          .week();
      isThisMonth = true;
    }

    // 주 생성
    if (!weeks[week]) {
      weeks[week] = [];
      heights[week] = 0;
    }

    // 해당 날짜 이벤트 찾아오기
    const events = (eventsObj[m] && eventsObj[m][d]) || [];

    // 일 오브젝트 생성
    const date = {
      dateTitle: firstDate.date() === 1
        ? `${m + 1}월 ${firstDate.date()}일`
        : `${firstDate.date()}`,
      isThisMonth,
      events
    };

    // 수동으로 element에 height em을 주기 위함
    if (events.length && heights[week] < events.length) {
      heights[week] = events.length;
    }

    // 주에 일 추가
    weeks[week][firstDate.day()] = date;

    firstDate.add(1, 'day');
  }

  return { weeks, heights };
};

const days = ['일', '월', '화', '수', '목', '금', '토'];

const MonthView: React.FC<Props> = ({ dates, events }) => {

  // events 들을 object에 날짜로 구분해서 넣자. 그리고 이게 첫인지 중간인지 끝인지 확인하는 플래그도.
  const eventsObj = transformEventForCalendar(events);

  const { weeks, heights } = makeDates(dates, eventsObj);

  return (
    <Wrapper>
      <CalendarWrapper>
        <DaysRow>
          {days.map(day => (
            <Day key={day}>
              <DayText>{day}</DayText>
            </Day>
          ))}
        </DaysRow>
        {weeks.map((week, index) => (
          <Weeks>

            <OneWeek>
              {week.map((date, index) => (
                <DateTitleWrapper key={index}>
                  <DateTitle>
                    <DateTitleText
                      className={date.isThisMonth ? 'this-month' : ''}>
                      {date.dateTitle}
                    </DateTitleText>
                  </DateTitle>
                </DateTitleWrapper>
              ))}
            </OneWeek>

            <EventsWrapper>
              <EventsInnerWrapper style={{ height: `${heights[index]}em` }}>
                {week.map(date => (
                  <EventWrapper>
                    {date.events.map((e: any, index) => (
                      <OneEventWrapper style={{ top: `${index}em` }}>
                        <OneEvent>
                          <FiberManualRecord fontSize="small" color="secondary" />{e.startTimeString} {e.title}
                        </OneEvent>
                      </OneEventWrapper>
                    ))}
                  </EventWrapper>
                ))}
              </EventsInnerWrapper>
            </EventsWrapper>

          </Weeks>
        ))}
      </CalendarWrapper>
    </Wrapper>
  );
};

/*
{events.map(event => (
  <div key={event.id}>
    <div data-testid="title">title: {event.title}</div>
    <div data-testid="start">
      start: {moment(event.start).format('YYYY-MM-DD HH:mm')}
    </div>
    <div data-testid="end">
      end: {moment(event.end).format('YYYY-MM-DD HH:mm')}
    </div>
  </div>
))}
*/
export default MonthView;
