import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './DateRangeFilter.css';
import { format } from 'date-fns';
import { FaRegCalendarAlt } from "react-icons/fa";

const DateRangeFilter = ({ onChange }) => {
  const [selectedRange, setSelectedRange] = useState({ from: undefined, to: undefined });
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef();

  const handleSelect = (range) => {
    console.log('Date range selected:', range); // Debug log
    setSelectedRange(range);
    if (range.from && range.to) {
      setIsPickerOpen(false); 
    }
  };

  const handleClear = () => {
    const range = { from: undefined, to: undefined };
    setSelectedRange(range);
    onChange(range);
  };

  const handleFilter = () => {
    onChange(selectedRange);
  };

  const togglePicker = () => {
    console.log('Toggling Picker:', !isPickerOpen); // Debug log
    setIsPickerOpen(!isPickerOpen);
  };

  const formatDate = (date) => {
    return date ? format(date, 'MM/dd/yyyy') : '';
  };

  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setIsPickerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <small className="helper-text text-secondary">Please select a date range to filter.</small>
      <div className="date-range-filter">
        <div className="input-container" onClick={togglePicker}>
          <input
            type="text"
            id="range-picker"
            name="range-picker"
            readOnly
            value={`${formatDate(selectedRange.from)} - ${formatDate(selectedRange.to)}`}
          />
          <FaRegCalendarAlt className="calendar-icon" />
        </div>
        {isPickerOpen && (
          <div className="date-picker-popup" ref={pickerRef}>
            <div className="date-picker-wrapper">
              <DayPicker
                mode="range"
                selected={selectedRange}
                onSelect={handleSelect}
                numberOfMonths={1}
                className="day-picker"
                captionLayout="dropdown"
                fromYear={2010}
                toYear={2050}
              />
            </div>
          </div>
        )}
      </div>
      <div className="buttons mt-2 mb-4">
        <button onClick={handleFilter} className="filter-button">Filter</button>
        <button onClick={handleClear} className="clear-button">Clear</button>
      </div>
    </>
  );
};

export default DateRangeFilter;
