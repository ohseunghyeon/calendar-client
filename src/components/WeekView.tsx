import React, { Dispatch, SetStateAction, useState } from 'react';
import moment, { Moment } from 'moment';
import { Event } from '../types/Event';
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
import { HOUR, DAYS, TIMES, ONE_HOUR_HEIGHT_PIXELS } from '../constants';
import fetchService from '../services/fetch.service';

interface Props {
  date: Moment;
  events: Event[];
  handleEventClick: (e: Event) => void;
  openPopupForNewEvent: (unixtime: number) => void;
  setReadyToFetch: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

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

const WeekView: React.FC<Props> = ({ date, events, handleEventClick, openPopupForNewEvent, setReadyToFetch, setIsLoading }) => {
  const eventsObj = transformEventForCalendar(events);
  const week = makeDatesForWeek(date, eventsObj);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingEvent, setDraggingEvent] = useState<any>(); // event object
  const [draggingDayIndex, setDraggingDayIndex] = useState(-1);
  const [draggingTop, setDraggingTop] = useState(0);

  const handleDateClick = (e: React.MouseEvent, unixtime: number) => {
    if (e.currentTarget === e.target) {
      openPopupForNewEvent(unixtime + HOUR * Math.floor(e.nativeEvent.offsetY / ONE_HOUR_HEIGHT_PIXELS));
    }
  };

  const handleDragStart = (event: Event) => {
    setDraggingEvent(event);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent, dayIndex: number) => {
    e.preventDefault();
    if (timeout === undefined && e.target === e.currentTarget) {
      setDraggingDayIndex(dayIndex);
      setDraggingTop(Math.floor(e.nativeEvent.offsetY / ONE_HOUR_HEIGHT_PIXELS) * ONE_HOUR_HEIGHT_PIXELS);

      timeout = setTimeout(() => (timeout = undefined), 100);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    if (draggingDayIndex === -1) {
      return;
    }

    const event = draggingEvent;
    const differenceStartEnd = event.end - event.start;

    const startDate = moment(event.start);
    startDate.day(draggingDayIndex);
    startDate.hour(draggingTop / ONE_HOUR_HEIGHT_PIXELS);

    setDraggingDayIndex(-1);
    setDraggingEvent(undefined);
    setDraggingTop(0);

    setIsLoading(true);
    fetchService.fetch({
      method: 'PUT',
      body: {
        id: event.id,
        title: event.title,
        start: startDate.unix() * 1000,
        end: startDate.unix() * 1000 + differenceStartEnd,
      },
      callback: () => setReadyToFetch(true),
    });
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
                    <DateAndNumberRowPresentationColumnDay>{day}</DateAndNumberRowPresentationColumnDay>
                    <DateAndNumberRowPresentationColumnNumber>{week[index].date}</DateAndNumberRowPresentationColumnNumber>
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
                    data-testid={`Date-${date.date}`}
                    onDragOver={e => handleDragOver(e, dayIndex)}
                    onClick={mouseEvent => handleDateClick(mouseEvent, date.unixtime)}
                  />
                  <EventColumnPresentation
                    onDragOver={e => handleDragOver(e, dayIndex)}
                    onClick={mouseEvent => handleDateClick(mouseEvent, date.unixtime)}>
                    {date.events.map((event, eventIndex) => (
                      <EventButton
                        data-testid={`${date.date}-${eventIndex}`}
                        onDragStart={() => handleDragStart(event)}
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
                            <EventButtonContentTitleText data-testid="title">{event.title}</EventButtonContentTitleText>
                            <EventButtonContentTime data-testid="time">
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
                          height: `${draggingEvent.height}px`,
                          opacity: 0.7,
                        }}>
                        <EventButtonContent>
                          <EventButtonContentTitle>
                            <EventButtonContentTitleText>{draggingEvent.title}</EventButtonContentTitleText>
                            <EventButtonContentTime>{`${draggingEvent.startTimeString}~${draggingEvent.endTimeString}`}</EventButtonContentTime>
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
