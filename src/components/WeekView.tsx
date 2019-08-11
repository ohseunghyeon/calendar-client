import React, { Dispatch, SetStateAction, useState } from 'react';
import moment, { Moment } from 'moment';
import { Event } from '../types/Event';
import styled from 'styled-components';
import {
  Container,
  UpperWrapper,
  LeftEmpty,
  LeftEmptyInner,
  DateAndNumberWrapper,
  DateAndNumberEmpty,
  DateAndNumberEmptyTwo,
  DateAndNumberEmptyShort,
  DateAndNumberEmptyLong,
  DateAndNumberRow,
  DateAndNumberEmptyLongContent,
  DateAndNumberRowPresentationEmpty,
  DateAndNumberRowPresentation,
  DateAndNumberRowPresentationColumn,
  DateAndNumberRowPresentationColumnEmpty,
  DateAndNumberRowPresentationColumnH2,
  DateAndNumberRowPresentationColumnNumber,
  DateAndNumberRowPresentationColumnEmptyEnd,
  DateAndNumberRowPresentationColumnDay,
  LowerWrapper,
  LowerInnerWrppaer,
  TimeWrapper,
  TimeInnner,
  Time,
  TimeString,
  TimeInnerEmpty,
  EventWrapper,
  EventInner,
  EventHorizontalLineWrapper,
  EventHorizontalLine,
  EventInnerEmptyLeft,
  EventColumnWrapper,
  EventColumnBox,
  EventColumnPresentation,
  EventButton,
  EventButtonContent,
  EventButtonContentTitle,
  EventButtonContentTitleText,
  EventButtonContentTime,
  EventButtonContentEnd,
} from './WeekView.styled';
import transformEventForCalendar from '../util/transformEventForCalendar';

interface Props {
  date: Moment;
  events: Event[];
  handleEventClick: (e: Event) => void;
  openPopupForNewEvent: (unixtime: number) => void;
  setReadyToFetch: Dispatch<SetStateAction<boolean>>;
}

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const TIMES = [
  '',
  '오전 1시',
  '오전 2시',
  '오전 3시',
  '오전 4시',
  '오전 5시',
  '오전 6시',
  '오전 7시',
  '오전 8시',
  '오전 9시',
  '오전 10시',
  '오전 11시',
  '오후 12시',
  '오후 1시',
  '오후 2시',
  '오후 3시',
  '오후 4시',
  '오후 5시',
  '오후 6시',
  '오후 7시',
  '오후 8시',
  '오후 9시',
  '오후 10시',
  '오후 11시',
];
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

export const makeDatesForWeek = (date: Moment, eventsObj: any) => {
  // 일자 구하기
  const week: {
    date: string;
    events: any[];
    unixtime: number;
  }[] = [];

  // 주 시작 날짜
  const firstDate = moment(date).startOf('week');

  // 각 요일에 날짜, 이벤트 담기
  for (let i = 0; i < 7; i++) {
    const m = firstDate.month();
    const d = firstDate.date();

    // 해당 날짜 이벤트 찾아오기
    const events = (eventsObj[m] && eventsObj[m][d]) || [];

    week.push({
      date: `${firstDate.date()}`,
      events,
      unixtime: firstDate.unix() * 1000,
    });

    firstDate.add(1, 'day');
  }

  return week;
};

let timeout: number | undefined;

const WeekView: React.FC<Props> = ({
  date,
  events,
  handleEventClick,
  openPopupForNewEvent,
  setReadyToFetch,
}) => {
  const eventsObj = transformEventForCalendar(events);
  const week = makeDatesForWeek(date, eventsObj);
  const [isDragging, setIsDragging] = useState(false);
  const [dragging, setDragging] = useState<any>(); // event object
  const [draggingDayIndex, setDraggingDayIndex] = useState(-1);
  const [draggingTop, setDraggingTop] = useState(0);

  const handleDateClick = (e: React.MouseEvent, unixtime: number) => {
    if (e.currentTarget === e.target) {
      openPopupForNewEvent(
        unixtime + HOUR * Math.floor(e.nativeEvent.offsetY / 48)
      );
    }
  };

  const handleDragStart = (e: React.DragEvent, event: Event) => {
    if (event.id !== undefined) {
      setDragging(event);
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: React.DragEvent, dayIndex: number) => {
    e.preventDefault();
    if (timeout === undefined && e.target === e.currentTarget) {
      setDraggingDayIndex(dayIndex);
      setDraggingTop(Math.floor(e.nativeEvent.offsetY / 48) * 48);

      timeout = setTimeout(() => {
        timeout = undefined;
      }, 100);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    if (draggingDayIndex === -1) {
      return;
    }

    const event = dragging;
    const day = draggingDayIndex;
    const hour = draggingTop / 48;
    const differenceStartEnd = event.end - event.start;

    const startDate = moment(event.start);
    startDate.day(day);
    startDate.hour(hour);
    const start = startDate.unix() * 1000;
    const end = start + differenceStartEnd;

    setDraggingDayIndex(-1);
    setDragging(undefined);
    setDraggingTop(0);

    fetch(`${process.env.REACT_APP_SERVER_URL}/events`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: event.id,
        title: event.title,
        start,
        end,
      }),
    })
      .then(response => response.json())
      .then(body => {
        if (body.error) {
          alert(body.error);
        } else {
          setReadyToFetch(true);
        }
      })
      .catch(error => alert(error.message));
  };

  return (
    <Container>
      <UpperWrapper>
        <LeftEmpty>
          <LeftEmptyInner></LeftEmptyInner>
        </LeftEmpty>
        <DateAndNumberWrapper>
          <DateAndNumberEmpty>
            <DateAndNumberEmptyTwo>
              <DateAndNumberEmptyShort />
              <DateAndNumberEmptyLong>
                {DAYS.map((_, index) => (
                  <DateAndNumberEmptyLongContent key={index} />
                ))}
              </DateAndNumberEmptyLong>
            </DateAndNumberEmptyTwo>
          </DateAndNumberEmpty>
          <DateAndNumberRow>
            <DateAndNumberRowPresentation>
              <DateAndNumberRowPresentationEmpty />
              {DAYS.map((day, index) => (
                <DateAndNumberRowPresentationColumn key={index}>
                  <DateAndNumberRowPresentationColumnEmpty />
                  <DateAndNumberRowPresentationColumnH2>
                    <DateAndNumberRowPresentationColumnDay>
                      {day}
                    </DateAndNumberRowPresentationColumnDay>
                    <DateAndNumberRowPresentationColumnNumber>
                      {week[index].date}
                    </DateAndNumberRowPresentationColumnNumber>
                  </DateAndNumberRowPresentationColumnH2>
                </DateAndNumberRowPresentationColumn>
              ))}
              <DateAndNumberRowPresentationColumnEmptyEnd />
            </DateAndNumberRowPresentation>
          </DateAndNumberRow>
        </DateAndNumberWrapper>
      </UpperWrapper>

      <LowerWrapper>
        <LowerInnerWrppaer>
          <TimeWrapper>
            <TimeInnner>
              {TIMES.map(time => (
                <Time key={time}>
                  <TimeString>{time}</TimeString>
                </Time>
              ))}
              <TimeInnerEmpty />
            </TimeInnner>
          </TimeWrapper>

          <EventWrapper>
            <EventInner>
              <EventHorizontalLineWrapper>
                {TIMES.map((time, index) => (
                  <EventHorizontalLine key={index} />
                ))}
              </EventHorizontalLineWrapper>
              <EventInnerEmptyLeft />

              {week.map((date, dayIndex) => (
                <EventColumnWrapper key={dayIndex}>
                  <EventColumnBox
                    onDragOver={e => handleDragOver(e, dayIndex)}
                    onClick={mouseEvent =>
                      handleDateClick(mouseEvent, date.unixtime)
                    }
                  />
                  <EventColumnPresentation
                    onDragOver={e => handleDragOver(e, dayIndex)}
                    onClick={mouseEvent =>
                      handleDateClick(mouseEvent, date.unixtime)
                    }>
                    {date.events.map(event => (
                      <EventButton
                        onDragStart={e => handleDragStart(e, event)}
                        onDragEnd={handleDragEnd}
                        draggable
                        key={event.id}
                        style={{
                          top: `${event.top}px`,
                          height: `${event.height}px`,
                        }}
                        onClick={() => handleEventClick(event)}>
                        <EventButtonContent>
                          <EventButtonContentTitle>
                            <EventButtonContentTitleText>
                              {event.title}
                            </EventButtonContentTitleText>
                            <EventButtonContentTime>
                              {`${event.startTimeString}~${event.endTimeString}`}
                            </EventButtonContentTime>
                            <EventButtonContentEnd />
                          </EventButtonContentTitle>
                        </EventButtonContent>
                      </EventButton>
                    ))}

                    {isDragging && dayIndex === draggingDayIndex && (
                      <EventButton
                        style={{
                          top: `${draggingTop}px`,
                          height: `${dragging.height}px`,
                          opacity: 0.7,
                        }}>
                        <EventButtonContent>
                          <EventButtonContentTitle>
                            <EventButtonContentTitleText>
                              {dragging.title}
                            </EventButtonContentTitleText>
                            <EventButtonContentTime>
                              {`${dragging.startTimeString}~${dragging.endTimeString}`}
                            </EventButtonContentTime>
                            <EventButtonContentEnd />
                          </EventButtonContentTitle>
                        </EventButtonContent>
                      </EventButton>
                    )}
                  </EventColumnPresentation>
                </EventColumnWrapper>
              ))}
            </EventInner>
          </EventWrapper>
        </LowerInnerWrppaer>
      </LowerWrapper>
    </Container>
  );
};

export default WeekView;
