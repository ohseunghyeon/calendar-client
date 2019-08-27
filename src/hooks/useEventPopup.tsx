import { useState, useCallback } from 'react';
import { Event } from '../types/Event';

const usePopup = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMode, setPopupMode] = useState<'new' | 'update'>('new');
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const closePopup = useCallback(() => {
    setSelectedEvent(undefined);
    setIsPopupOpen(false);
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setPopupMode('update');
    setIsPopupOpen(true);
  };

  const openPopupForNewEvent = (unixtime: number) => {
    setSelectedTime(new Date(unixtime));
    setPopupMode('new');
    setIsPopupOpen(true);
  };

  return {
    isPopupOpen,
    popupMode,
    selectedTime,
    selectedEvent,
    closePopup,
    handleEventClick,
    openPopupForNewEvent
  }
}

export default usePopup;