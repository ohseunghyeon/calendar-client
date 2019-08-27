import React, { useState, useCallback } from 'react';
import { Event } from '../types/Event';
import { Dim, EventPopupWrapper, Input, DatePickerWrapper, DatePickerStyled, ButtonWrapper, Button } from './EventPopup.styled';

interface EventPopupProps {
  viewType: string;
  popupMode: string;
  selectedEvent?: Event;
  closePopup: () => void;
  selectedTime: Date;
  request: Function;
}

const EventPopup: React.FC<EventPopupProps> = ({
  viewType,
  popupMode,
  selectedEvent,
  closePopup,
  selectedTime,
  request
}) => {
  const handleDimClick = useCallback((e: React.SyntheticEvent) => e.currentTarget === e.target && closePopup(), [closePopup]);

  const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : '');
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value), [setTitle]);

  let initialStart, initialEnd;
  if (popupMode === 'update' && selectedEvent) {
    initialStart = new Date(selectedEvent.start);
    initialEnd = new Date(selectedEvent.end);
  } else {
    // 월/주 보기에서, 월은 현재 시간, 주는 선택한 시간으로 팝업 시간 설정
    initialStart = selectedTime;
    if (viewType === 'month') initialStart.setHours(new Date().getHours() + 1);
    initialEnd = new Date(initialStart);
    initialEnd.setHours(initialStart.getHours() + 1);
  }

  const [startDate, setStartDate] = useState(initialStart);
  const handleStartPickerChange = useCallback((date: Date) => setStartDate(date), [setStartDate]);

  const [endDate, setEndDate] = useState(initialEnd);
  const handleEndPickerChange = useCallback((date: Date) => setEndDate(date), [setEndDate]);

  const handleRemove = () => {
    if (selectedEvent) {
      request({
        method: 'DELETE',
        body: { id: selectedEvent.id },
        callback: closePopup
      });
    }
  };

  const handleSave = () => {
    request({
      method: popupMode === 'update' ? 'PUT' : 'POST',
      body: {
        id: selectedEvent && selectedEvent.id,
        title: title || '(제목 없음)',
        start: startDate.getTime(),
        end: endDate.getTime(),
      },
      callback: closePopup
    });
  };

  return (
    <Dim data-testid="dim" onClick={handleDimClick}>
      <EventPopupWrapper>
        <Input data-testid="title" value={title} onChange={handleTitleChange} placeholder="일정의 제목을 입력해주세요" />
        <DatePickerWrapper data-testid="pickers">
          <DatePickerStyled
            selected={startDate}
            onChange={handleStartPickerChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            showTimeSelect
            timeFormat="h:mm aa"
            timeIntervals={60}
            dateFormat="yyyy-MM-dd h:mm aa"
            timeCaption="시간"
            placeholderText="시작 날짜와 시간을 선택하세요"
          />{' '}
          ~{' '}
          <DatePickerStyled
            selected={endDate}
            onChange={handleEndPickerChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            showTimeSelect
            timeFormat="h:mm aa"
            timeIntervals={60}
            dateFormat="yyyy-MM-dd h:mm aa"
            timeCaption="시간"
            placeholderText="끝나는 날짜와 시간을 선택하세요"
          />
        </DatePickerWrapper>

        <ButtonWrapper>
          <Button data-testid="cancel" onClick={closePopup}>
            취소
          </Button>
          {popupMode === 'update' && (
            <Button data-testid="remove" onClick={handleRemove}>
              삭제
            </Button>
          )}
          <Button data-testid="save" onClick={handleSave}>
            저장
          </Button>
        </ButtonWrapper>
      </EventPopupWrapper>
    </Dim>
  );
};

export default EventPopup;
