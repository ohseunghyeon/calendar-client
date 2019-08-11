import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

export const UpperWrapper = styled.div`
  display: flex;
  flex: none;
`;

export const LeftEmpty = styled.div`
  white-space: nowrap;
  display: flex;
  flex: none;
  flex-direction: column;
`;

export const LeftEmptyInner = styled.div`
  flex: 1;
  margin-left: 1px;
  min-width: 52px;
`;

export const DateAndNumberWrapper = styled.div`
  margin-left: -1px;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  // overflow: hidden;
  position: relative;
`;

export const DateAndNumberEmpty = styled.div`
  position: absolute;
  top: 80px;
  left: 0;
  bottom: 0;
  right: 0;
  flex: none;
  pointer-events: none;
`;

export const DateAndNumberEmptyTwo = styled.div`
  display: flex;
  padding-right: 8px;
  height: 100%;
  overflow: hidden;
  overflow-x: scroll;
`;

export const DateAndNumberEmptyShort = styled.div`
  width: 9px;
  min-width: 9px;
`;

export const DateAndNumberEmptyLong = styled.div`
  min-width: calc(100% - 18px);
  flex: none;
  display: inline-flex;
  vertical-align: top;
  padding-right: 8px;
`;

export const DateAndNumberEmptyLongContent = styled.div`
  flex: 1 0 68px;
  min-width: 68px;
  padding-right: 13px;
  position: relative;
  overflow: visible;
  display: flex;
  z-index: 1;
`;

export const DateAndNumberRow = styled.div`
  height: 84px;
  display: flex;
  flex: none;
  overflow: hidden;
`;

export const DateAndNumberRowPresentation = styled.div`
  flex: 1 1 auto;
  display: flex;
  overflow: hidden;
  // overflow-x: scroll;
`;

export const DateAndNumberRowPresentationEmpty = styled.div`
  width: 9px;
  min-width: 9px;
`;

export const DateAndNumberRowPresentationColumn = styled.div`
  width: 81px;
  min-width: 81px;
  flex: 1 0 auto;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
`;

export const DateAndNumberRowPresentationColumnEmpty = styled.div`
  // border-left: #dadce0 1px solid;
  bottom: 0;
  height: 20px;
  margin-left: -1px;
  position: absolute;
`;

export const DateAndNumberRowPresentationColumnH2 = styled.h2`
  font-weight: 400;
  margin: 0;
  text-align: center;
  width: 100%;
  font-size: 1.5em;
`;

export const DateAndNumberRowPresentationColumnDay = styled.div`
  line-height: 32px;
  position: relative;
  z-index: 2;
  color: #70757a;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.8px;
  margin-left: 0;
  margin-top: 8px;
  text-indent: 0.8px;
  text-transform: uppercase;
`;

export const DateAndNumberRowPresentationColumnNumber = styled.div`
  position: relative;
  outline: none;
  color: #3c4043;
  z-index: 2;
  font-size: 26px;
  letter-spacing: -2.6px;
  text-indent: -2.6px;
  font-variant: tabular-nums;
  font-feature-settings: 'tnum' 1;
  border-radius: 100%;
  line-height: 46px;
  height: 46px;
  margin-left: auto;
  margin-right: auto;
  margin-top: -8px;
  width: 46px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const DateAndNumberRowPresentationColumnEmptyEnd = styled.div`
overflow: scroll
visibility: hidden;
flex: none;
`;

export const LowerWrapper = styled.div`
  flex: 1 1 60%;
  position: relative;
  display: flex;
  flex-direction: column;
  // overflow: hidden;
`;

export const LowerInnerWrppaer = styled.div`
  // overflow: hidden;
  align-items: stretch;
  display: flex;
  flex: 1 1 auto;
`;

export const TimeWrapper = styled.div`
  height: auto;
  // overflow-y: hidden;
  flex: none;
  display: flex;
  align-items: flex-start;
  min-width: 40px;
`;

export const TimeInnner = styled.div`
  position: relative;
  background-color: #fff;
  box-sizing: border-box;
  margin-left: auto;
`;

export const TimeInnerEmpty = styled.div`
  height: 20px;
  display: block;
  visibility: hidden;
  overflow-y: hidden;
  max-width: 80px;
`;

export const Time = styled.div`
  position: relative;
  height: 48px;
  padding-right: 8px;
  text-align: right;
`;

export const TimeString = styled.span`
  display: block;
  position: relative;
  top: -6px;
  color: #70757a;
  font-size: 10px;
  text-align: right;
`;

export const EventWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex: 1 1 auto;
`;

export const EventInner = styled.div`
  min-width: 100%;
  flex: none;
  display: inline-flex;
  vertical-align: top;
  // overflow: hidden;
  position: relative;
`;

export const EventHorizontalLineWrapper = styled.div`
  border-top: #dadce0 apx solid;
`;

export const EventHorizontalLine = styled.div`
  height: 48px;

  &::after {
    content: '';
    border-bottom: #dadce0 1px solid;
    position: absolute;
    width: 100%;
    margin-top: -1px;
    z-index: 3;
    pointer-events: none;
  }
`;

export const EventInnerEmptyLeft = styled.div`
  width: 8px;
  border-right: #dadce0 1px solid;
`;

export const EventColumnWrapper = styled.div`
  width: 81px;
  min-width: 81px;
  flex: 1 0 auto;
  border-right: #dadce0 1px solid;
  position: relative;
  padding-right: 12px;
  box-sizing: border-box;
  outline: none;
  &:last-child {
    border-right: white 1px solid;
    overflow: visible;
  }
`;

export const EventColumnBox = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;

export const EventColumnPresentation = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

export const EventButton = styled.div`
  position: absolute;
  border-radius: 4px;
  margin-left: -1px;
  margin-top: 1px;
  outline: none;
  cursor: pointer;
  left: 0%;
  width: 100%;
  z-index: 4;
  background-color: rgb(66, 133, 244);
  border-color: rgb(66, 133, 244);

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: '';
    box-sizing: border-box;
    border-radius: 4px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 100ms linear;
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.2);
  }

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100 %;
    height: 100%;
    content: '';
    box-sizing: border-box;
    border-radius: 4px;
    pointer-events: none;
  }
`;

export const EventButtonContent = styled.div`
  max-height: 100%;
  overflow: hidden;
  padding-left: 8px;
  text-align: left;
  user-select: none;
`;

export const EventButtonContentTitle = styled.div`
  font-weight: 400;
  letter-spacing: 0.4px;
  padding-top: 4px;
  white-space: normal;
  overflow-wrap: break-word;
  word-wrap: break-word;
  color: #fff;
  font-size: 12px;
  line-height: 15px;
  overflow: hidden;
  text-align: left;
`;

export const EventButtonContentTitleText = styled.span`
  font-weight: 400;
  letter-spacing: 0.4px;
  white-space: normal;
  overflow-wrap: break-word;
`;

export const EventButtonContentTime = styled.div`
  max-width: 100%;
  white-space: nowrap;
  display: flex;
  align-items: center;
  font-size: 12px;
  letter-spacing: 0.1px;
  line-height: 15px;
  overflow: hidden;
`;

export const EventButtonContentEnd = styled.div`
  bottom: 0;
  position: absolute;
  left: 0;
  right: 0;
  height: 50%;
  max-height: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5004;
  user-select: none;
`;
