import React from 'react';
import moment, { Moment } from 'moment';
import { Event } from '../types/Event';
import styled from 'styled-components';
import { Container, UpperWrapper, LeftEmpty, LeftEmptyInner, DateAndNumberWrapper, DateAndNumberEmpty, DateAndNumberEmptyTwo, DateAndNumberEmptyShort, DateAndNumberEmptyLong, DateAndNumberRow, DateAndNumberEmptyLongContent, DateAndNumberRowPresentationEmpty, DateAndNumberRowPresentation, DateAndNumberRowPresentationColumn, DateAndNumberRowPresentationColumnEmpty, DateAndNumberRowPresentationColumnH2, DateAndNumberRowPresentationColumnNumber, DateAndNumberRowPresentationColumnEmptyEnd, DateAndNumberRowPresentationColumnDay, LowerWrapper, LowerInnerWrppaer, TimeWrapper, TimeInnner, Time, TimeString, TimeInnerEmpty, EventWrapper, EventInner, EventHorizontalLineWrapper, EventHorizontalLine, EventInnerEmptyLeft, EventColumnWrapper, EventColumnBox, EventColumnPresentation, EventButton, EventButtonContent, EventButtonContentTitle, EventButtonContentTitleText, EventButtonContentTime, EventButtonContentEnd } from './WeekView.styled';
import transformEventForCalendar from '../util/transformEventForCalendar';

interface Props {
  dates: Moment;
  events: Event[];
}

const days = ['일', '월', '화', '수', '목', '금', '토'];
const times = ['', '오전 1시', '오전 2시', '오전 3시', '오전 4시', '오전 5시', '오전 6시', '오전 7시', '오전 8시', '오전 9시', '오전 10시', '오전 11시', '오후 12시', '오후 1시', '오후 2시', '오후 3시', '오후 4시', '오후 5시', '오후 6시', '오후 7시', '오후 8시', '오후 9시', '오후 10시', '오후 11시'];

const WeekView: React.FC<Props> = ({ dates, events }) => {

  // events 들을 object에 날짜로 구분해서 넣자. 그리고 이게 첫인지 중간인지 끝인지 확인하는 플래그도.
  const eventsObj = transformEventForCalendar(events);

  // 일자 구하기
  const week: {
    date: string,
    events: any[]
  }[] = [];

  // 주 시작 날짜
  const firstDate = moment(dates).startOf('week');

  // 각 요일에 날짜, 이벤트 담기
  for (let i = 0; i < 7; i++) {
    const m = firstDate.month();
    const d = firstDate.date();

    // 해당 날짜 이벤트 찾아오기
    const events = (eventsObj[m] && eventsObj[m][d]) || [];

    week.push({
      date: `${firstDate.date()}`,
      events
    });

    firstDate.add(1, 'day');
  }

  // 일자 별

  return (
    <Container>
      <UpperWrapper>
        <LeftEmpty>
          <LeftEmptyInner>
          </LeftEmptyInner>
        </LeftEmpty>
        <DateAndNumberWrapper>
          <DateAndNumberEmpty>
            <DateAndNumberEmptyTwo>
              <DateAndNumberEmptyShort />
              <DateAndNumberEmptyLong>
                {days.map((_, index) => (<DateAndNumberEmptyLongContent key={index} />))}
              </DateAndNumberEmptyLong>
            </DateAndNumberEmptyTwo>
          </DateAndNumberEmpty>
          <DateAndNumberRow>
            <DateAndNumberRowPresentation>
              <DateAndNumberRowPresentationEmpty />
              {days.map((day, index) => (
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
              {times.map(time => (
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
                {times.map((time, index) => (<EventHorizontalLine key={index} />))}
              </EventHorizontalLineWrapper>
              <EventInnerEmptyLeft />

              {/* 얘가 7개 */}
              {week.map((date, index) => (
                <EventColumnWrapper key={index}>
                  <EventColumnBox />
                  <EventColumnPresentation>
                    {date.events.map(event => (
                      <EventButton
                        style={{
                          top: `${event.top}px`,
                          height: `${event.height}px`,
                          left: '0%',
                          width: '100%',
                          zIndex: 4,
                          backgroundColor: 'rgb(66, 133, 244)',
                          borderColor: 'rgb(66, 133, 244)',
                        }}
                      >
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
                  </EventColumnPresentation>
                </EventColumnWrapper>
              ))}
            </EventInner>
          </EventWrapper>

        </LowerInnerWrppaer>
      </LowerWrapper>
    </Container>
  )
};

export default WeekView;
