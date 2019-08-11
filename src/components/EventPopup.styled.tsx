import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const EventPopupWrapper = styled.div`
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

export const Input = styled.input`
  width: 100%;
  padding: 5px;
`;

export const DatePickerWrapper = styled.div`
  display: flex;
  margin-top: 10px;
`;

export const DatePickerStyled = styled(DatePicker)`
  border: none;
  border-bottom: #000 1px solid;
  padding: 5px;
  margin: 0 5px;
  text-align: center;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 10px;
`;

export const Button = styled.button`
  margin-left: 10px;
  color: var(--main-text);
  background-color: #fff;
  border: #000 1px solid;
  padding: 5px;
  cursor: pointer;
`;

export const Dim = styled.div`
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;
