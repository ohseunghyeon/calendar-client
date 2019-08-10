import React from 'react';
import { FiberManualRecord } from '@material-ui/icons';
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
  OneEvent,
} from './MonthView.styled';

interface Props {
  date: Moment;
  events: Event[];
  handleEventClick: (e: Event) => void;
  openPopupForNewEvent: (unixtime: number) => void;
}

// TODO: 얘 나중에 쪼개야겠다.
/**
 * 캘린더에 쓸 Week [], dates [] 생성.
 * ex) 4주면 [['1', '2'...], [...], [..], [..]]
 */
export const makeDatesForMonth = (date: Moment, eventsObj: any) => {
  const weeks: {
    dateTitle: string; // 몇 월 몇 일인지
    unixtime: number;
    isThisMonth: boolean; // 이 날이 보고 있는 달인지 지난 달 말인지 다음 달 초인지
    events: []; // 이 날의 이벤트들
  }[][] = [];

  const heights: number[] = [];

  const firstDate = moment(date)
    .startOf('month')
    .startOf('week');
  const lastDate = moment(date)
    .endOf('month')
    .endOf('week');

  let week = 0;
  while (firstDate.isSameOrBefore(lastDate)) {
    const y = firstDate.year();
    const m = firstDate.month();
    const d = firstDate.date();
    let isThisMonth = false;

    // 전 달 혹은 다음 달인 경우 week을 계산하지 않음
    // 현재 8월인데 7월 마지막 주를 계산에 넣게 되면 0 번째 week이어야 하는데
    // 5번째 week으로 계산함
    if (m === date.month()) {
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
    const oneDate = {
      dateTitle:
        firstDate.date() === 1
          ? `${m + 1}월 ${firstDate.date()}일`
          : `${firstDate.date()}`,
      isThisMonth,
      events,
      unixtime: firstDate.unix() * 1000,
    };

    // 수동으로 element에 height em을 주기 위함
    if (events.length && heights[week] < events.length) {
      heights[week] = events.length;
    }

    // 주에 일 추가
    weeks[week][firstDate.day()] = oneDate;

    firstDate.add(1, 'day');
  }

  return { weeks, heights };
};

const days = ['일', '월', '화', '수', '목', '금', '토'];

const MonthView: React.FC<Props> = ({
  date,
  events,
  handleEventClick,
  openPopupForNewEvent,
}) => {
  // events 들을 object에 날짜로 구분해서 넣자. 그리고 이게 첫인지 중간인지 끝인지 확인하는 플래그도.
  const eventsObj = transformEventForCalendar(events);

  const { weeks, heights } = makeDatesForMonth(date, eventsObj);

  const handleDateClick = (
    e: React.SyntheticEvent<HTMLDivElement>,
    unixtime: number
  ) => {
    if (e.currentTarget === e.target) {
      openPopupForNewEvent(unixtime);
    }
  };

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
          <Weeks key={index}>
            <OneWeek>
              {week.map((date, index) => (
                <DateTitleWrapper
                  onClick={mouseEvent => handleDateClick(mouseEvent, date.unixtime)}
                  key={index}>
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
                {week.map((date, index) => (
                  <EventWrapper
                    onClick={mouseEvent => handleDateClick(mouseEvent, date.unixtime)}
                    key={index}>
                    {date.events.map((event: any, index) => (
                      <OneEventWrapper
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        style={{ top: `${index}em` }}>
                        <OneEvent>
                          <FiberManualRecord
                            fontSize="small"
                            color="secondary"
                          />
                          {event.startTimeString} {event.title}
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

export default MonthView;
