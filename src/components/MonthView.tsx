import React, { Dispatch, SetStateAction, useState, useCallback } from 'react';
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
import { DAYS } from '../constants';
import fetchService from '../services/fetch.service';

interface Props {
  date: Moment;
  events: Event[];
  handleEventClick: (e: Event) => void;
  openPopupForNewEvent: (unixtime: number) => void;
  setReadyToFetch: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

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
      if (week === -48) week = 49; // 12월 마지막 주 예외처리
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
      dateTitle: firstDate.date() === 1 ? `${m + 1}월 ${firstDate.date()}일` : `${firstDate.date()}`,
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

const MonthView: React.FC<Props> = ({ date, events, handleEventClick, openPopupForNewEvent, setReadyToFetch, setIsLoading }) => {
  const eventsObj = transformEventForCalendar(events);
  const { weeks, heights } = makeDatesForMonth(date, eventsObj);
  const [draggingEvent, setDraggingEvent] = useState<any>(); // event object

  const handleDateClick = useCallback((e: React.SyntheticEvent, unixtime: number) => {
    if (e.currentTarget === e.target) {
      openPopupForNewEvent(unixtime);
    }
  }, [openPopupForNewEvent]);

  const handleDragStart = useCallback((e: React.DragEvent, event: Event) => {
    // e.dataTransfer.setData('text', '');
    setDraggingEvent(event);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('droppable');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('droppable');
  }, []);

  const handleDrop = (e: React.DragEvent, droppedDateUnixtime: number) => {
    e.currentTarget.classList.remove('droppable');

    const date = new Date(droppedDateUnixtime);
    const event = draggingEvent;
    const differenceStartEnd = event.end - event.start;

    const start = new Date(event.start);
    start.setFullYear(date.getFullYear());
    start.setMonth(date.getMonth());
    start.setDate(date.getDate());
    setIsLoading(true);
    fetchService.fetch({
      method: 'PUT',
      body: {
        id: event.id,
        title: event.title,
        start: start.getTime(),
        end: start.getTime() + differenceStartEnd,
      },
      callback: () => setReadyToFetch(true),
    });
  }

  return (
    <Wrapper>
      <CalendarWrapper>
        <DaysRow>
          {DAYS.map(day => (
            <Day key={day}>
              <DayText>{day}</DayText>
            </Day>
          ))}
        </DaysRow>
        {weeks.map((week, weekIndex) => (
          <Weeks key={weekIndex}>
            <OneWeek>
              {week.map((date, index) => (
                <DateTitleWrapper
                  data-testid={`TW-${new Date(date.unixtime).getMonth()}-${new Date(date.unixtime).getDate()}`}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => handleDrop(e, date.unixtime)}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onClick={mouseEvent => handleDateClick(mouseEvent, date.unixtime)}
                  key={index}>
                  <DateTitle>
                    <DateTitleText className={date.isThisMonth ? 'this-month' : ''}>{date.dateTitle}</DateTitleText>
                  </DateTitle>
                </DateTitleWrapper>
              ))}
            </OneWeek>

            <EventsWrapper>
              <EventsInnerWrapper style={{ height: `${heights[weekIndex]}em` }}>
                {week.map((date, index) => (
                  <EventWrapper onClick={mouseEvent => handleDateClick(mouseEvent, date.unixtime)} key={index}>
                    {date.events.map((event: any, index) => (
                      <OneEventWrapper
                        data-testid={`${new Date(date.unixtime).getMonth()}-${new Date(date.unixtime).getDate()}-${index}`}
                        onDragStart={e => handleDragStart(e, event)}
                        draggable
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        style={{ top: `${index}em` }}>
                        <OneEvent data-testid="title">
                          <FiberManualRecord fontSize="small" color="secondary" />
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
