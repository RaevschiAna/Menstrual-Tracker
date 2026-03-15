import './Calendar.css'
import React, { useState } from 'react'
import ReactCalendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const Calendar = () => {
  const [date, setDate] = useState(new Date())

  const handleDateChange = newDate => {
    setDate(newDate)
  }

  return (
    <div className='calendar-container'>
      <h1>Calendar</h1>
      <div className='calendar-wrapper'>
        <ReactCalendar
          onChange={handleDateChange}
          value={date}
          className='calendar'
        />
      </div>
      <div className='selected-date-info'>
        <h2>Selected Date</h2>
        <p>{date.toDateString()}</p>
        <p className='formatted-date'>
          {date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    </div>
  )
}

export default Calendar
