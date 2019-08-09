import styled from 'styled-components';

export const Wrapper = styled.div`
  flex: 1 1 auto;
  overflow: hidden;
  position: relative;
`;

export const CalendarWrapper = styled.div`
  border-left: var(--border) 1px solid;
  background-color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 8px;
`;

export const DaysRow = styled.div`
  margin: 0;
  align-items: stretch;
  display: flex;
  flex: none;
  height: 20px;
`;

export const Day = styled.div`
  border-right: var(--border) 1px solid;
  flex: 1 1 0%;
  text-align: center;
  font-family: Roboto, Arial, sans-serif;
  text-transform: uppercase;
  &:last-child {
    border-right: none;
  }
`;

export const DayText = styled.span`
  color: #70757a;
  font-size: 11px;
  font-weight: 500;
  line-height: 20px;
`;

export const Weeks = styled.div`
  position: relative;
  overflow: hidden;
  border-bottom: var(--border) 1px solid;
  display: flex;
  flex: 1 1 0%;
`;

export const OneWeek = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
`;

export const DateTitleWrapper = styled.div`
  font-size: 14px;
  line-height: 30px;
  border-right: var(--border) 1px solid;
  color: #70757a;
  flex: 1 1 0%;
  &:last-child {
    border-right: none;
  }
`;

export const DateTitle = styled.div`
  width: 100%;
  text-align: center;
`;

export const DateTitleText = styled.h2`
  margin-top: 8px;
  font-family: Roboto, Arial, sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.3px;
  display: inline-block;
  text-align: center;
  white-space: nowrap;
  width: max-content;
  min-width: 24px;
  line-height: 16px;
  &.this-month {
    color: var(--main-text);
  }
`;

export const EventsWrapper = styled.div`
  margin-top: 30px;
  flex: 1 1 0%;
`;

export const EventsInnerWrapper = styled.div`
  display: flex;
  position: relative;
  overflow: hidden;
  font-size: 24px;
`;

export const EventWrapper = styled.div`
  flex: 1 1 0%;
  border-right: 1px solid transparent;
`;

export const OneEventWrapper = styled.div`
  position: absolute;
  height: 24px;
  width: 14.29%;
  z-index: 2;
`;

export const OneEvent = styled.div`
  height: 22px;
  padding: 0 8px;
  line-height: 20px;
  font-size: 12px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  transition: background-color 100ms linear;
  &:hover {
    background-color: var(--secondary-bg-hover);
  }
  cursor: pointer;
`;
