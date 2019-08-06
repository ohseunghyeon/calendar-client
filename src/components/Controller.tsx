import React, { Dispatch, SetStateAction } from 'react';
import { Toolbar, Select, MenuItem } from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';

const Controller: React.FC<{
  selectedDate: {
    year: number;
    month: number;
    date: number;
  };
  setSelectedDate: React.Dispatch<
    React.SetStateAction<{
      year: number;
      month: number;
      date: number;
    }>
  >;
  isTypeMonth: string;
  setIsTypeMonth: Dispatch<SetStateAction<string>>;
}> = ({ selectedDate, isTypeMonth, setIsTypeMonth }) => {
  function handleChange(
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) {
    if (typeof event.target.value === 'string') {
      setIsTypeMonth(event.target.value);
    }
  }

  return (
    <Toolbar>
      <div>
        <ArrowBackIos />
        {selectedDate.year}년 {selectedDate.month}월
        <ArrowForwardIos />
      </div>

      <Select
        value={isTypeMonth}
        onChange={handleChange}
        inputProps={{ name: '월/주', id: 'view-type' }}>
        <MenuItem value={'month'}>월</MenuItem>
        <MenuItem value={'week'}>주</MenuItem>
      </Select>
    </Toolbar>
  );
};

export default Controller;
