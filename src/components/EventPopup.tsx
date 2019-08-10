import React, { useState, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Event } from '../types/Event';
import Portal from '../util/Portal';
import Dim from '../util/Dim';

interface EventPopupProps {
  mode: string;
  type: string;
  events?: Event[];
  selectedEvent?: Event;
  closePopup: () => void;
  setReadyToFetch: Dispatch<SetStateAction<boolean>>;
  selectedTime: Date;
}

const EventPopupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 2rem 1rem;
  // width: 70%;
  align-items: center;
  border-radius: 10px;
  animation: showup 0.5s;
  border: #000 1px solid;

  @keyframes showup {
    from {
      opacity: 0;
      visibility: hidden;
    }
    to {
      visibility: visible;
      opacity: 1;
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 5px;
`;

const DatePickerWrapper = styled.div`
  display: flex;
  margin-top: 10px;
`;

const DatePickerStyled = styled(DatePicker)`
  border: none;
  border-bottom: #000 1px solid;
  padding: 5px;
  margin: 0 5px;
  text-align: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 10px;
`;

const Button = styled.button`
  margin-left: 10px;
  color: var(--main-text);
  background-color: #fff;
  border: #000 1px solid;
  padding: 5px;
  cursor: pointer;
`;

const getinitialStartEnd = ({
  mode,
  type,
  selectedEvent,
  selectedTime,
}: {
  mode: string;
  type: string;
  selectedEvent?: Event;
  selectedTime: Date;
}) => {
  let initialStart, initialEnd;

  if (type === 'update' && selectedEvent) {
    // 기존 일정 선택
    initialStart = new Date(selectedEvent.start);
    initialEnd = new Date(selectedEvent.end);
  } else {
    if (mode === 'month') {
      initialStart = selectedTime;
      const now = new Date();
      initialStart.setHours(now.getHours() + 1);
      initialEnd = new Date(initialStart);
      initialEnd.setHours(initialStart.getHours() + 1);
    } else {
      initialStart = selectedTime;
      initialEnd = new Date(initialStart);
      initialEnd.setHours(initialStart.getHours() + 1);
    }
  }
  return { initialStart, initialEnd };
};

const EventPopup: React.FC<EventPopupProps> = ({
  mode,
  type,
  selectedEvent,
  closePopup,
  setReadyToFetch,
  selectedTime,
}) => {
  // 시작 시간 가져오기
  const { initialStart, initialEnd } = getinitialStartEnd({
    mode,
    type,
    selectedEvent,
    selectedTime,
  });
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setendDate] = useState(initialEnd);

  // 일정 제목
  const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : '');
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  // 시간 변경 핸들러
  const handleStartPickerChange = (date: Date) => setStartDate(date);
  const handleEndPickerChange = (date: Date) => setendDate(date);

  // 딤 클릭 시 취소 버튼과 돌일
  const handleDimClick = (e: React.SyntheticEvent) => {
    if (e.currentTarget === e.target) {
      closePopup();
    }
  };

  const handleRemove = () => {
    if (selectedEvent) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/events`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedEvent.id }),
      })
        .then(response => response.json())
        .then(body => {
          // setStatus('loaded');
          if (body.error) {
            alert(body.error);
          } else {
            setReadyToFetch(true);
            closePopup();
          }
        })
        .catch(error => alert(error.message));
    }
  };

  const handleSave = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/events`, {
      method: type === 'update' ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: selectedEvent && selectedEvent.id,
        title: title || '(제목 없음)',
        start: startDate.getTime(),
        end: endDate.getTime(),
      }),
    })
      .then(response => response.json())
      .then(body => {
        if (body.error) {
          alert(body.error);
        } else {
          setReadyToFetch(true);
          closePopup();
        }
      })
      .catch(error => alert(error.message));
  };

  return (
    <Portal>
      <Dim onClick={handleDimClick}>
        <EventPopupWrapper>
          <Input
            value={title}
            onChange={handleTitleChange}
            placeholder="일정의 제목을 입력해주세요"
          />
          <DatePickerWrapper>
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
            <Button onClick={closePopup}>취소</Button>
            {type === 'update' && <Button onClick={handleRemove}>삭제</Button>}
            <Button onClick={handleSave}>저장</Button>
          </ButtonWrapper>
        </EventPopupWrapper>
      </Dim>
    </Portal>
  );
};

export default EventPopup;
