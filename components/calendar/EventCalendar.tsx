'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface EventData {
  id: string
  title: string
  type: 'family-camp' | 'marriage-retreat' | 'ministry-event' | 'grieving-retreat' | 'family-mission-trip' | 'special-event'
  startDate: string
  endDate: string
  available: boolean
}

interface BlockedDate {
  id: string
  title: string
  startDate: string
  endDate: string
  reason: string
  isActive: boolean
}

interface EventCalendarProps {
  events?: EventData[]
  blockedDates?: BlockedDate[]
  onDateClick?: (date: Date, event?: EventData) => void
  className?: string
}

const eventTypeColors = {
  'family-camp': 'bg-blue-100 text-blue-800 border-blue-200',
  'marriage-retreat': 'bg-pink-100 text-pink-800 border-pink-200',
  'ministry-event': 'bg-purple-100 text-purple-800 border-purple-200',
  'grieving-retreat': 'bg-gray-100 text-gray-800 border-gray-200',
  'family-mission-trip': 'bg-green-100 text-green-800 border-green-200',
  'special-event': 'bg-yellow-100 text-yellow-800 border-yellow-200'
}

const eventTypeLabels = {
  'family-camp': 'Family Camp',
  'marriage-retreat': 'Marriage Retreat',
  'ministry-event': 'Ministry Event',
  'grieving-retreat': 'Grieving Retreat',
  'family-mission-trip': 'Family Mission Trip',
  'special-event': 'Special Event'
}

export default function EventCalendar({ events = [], blockedDates = [], onDateClick, className = '' }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)
      return date >= eventStart && date <= eventEnd
    })
  }

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(blocked => {
      if (!blocked.isActive) return false
      const blockedStart = new Date(blocked.startDate)
      const blockedEnd = new Date(blocked.endDate)
      return date >= blockedStart && date <= blockedEnd
    })
  }

  const getBlockedDateForDate = (date: Date) => {
    return blockedDates.find(blocked => {
      if (!blocked.isActive) return false
      const blockedStart = new Date(blocked.startDate)
      const blockedEnd = new Date(blocked.endDate)
      return date >= blockedStart && date <= blockedEnd
    })
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    const dayEvents = getEventsForDate(date)
    if (dayEvents.length > 0) {
      setSelectedEvent(dayEvents[0])
    } else {
      setSelectedEvent(null)
    }
    onDateClick?.(date, dayEvents[0])
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={goToToday}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Go to Today
          </button>
        </div>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-10" />
            }

            const dayEvents = getEventsForDate(day)
            const isToday = day.toDateString() === new Date().toDateString()
            const isSelected = selectedDate?.toDateString() === day.toDateString()
            const isBlocked = isDateBlocked(day)
            const blockedDate = getBlockedDateForDate(day)

            // Get the primary event type for this day (for color coding)
            const primaryEvent = dayEvents[0]
            const eventColor = primaryEvent ? eventTypeColors[primaryEvent.type] : ''

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                className={`
                  h-10 text-sm rounded-md transition-colors relative
                  ${isBlocked ? 'bg-red-100 text-red-800 cursor-not-allowed' : ''}
                  ${dayEvents.length > 0 && !isBlocked ? 
                    `${eventColor ? eventColor : 'bg-primary-100 text-primary-800'} hover:opacity-80` : 
                    isToday ? 'bg-primary-100 text-primary-800 font-semibold' : 
                    isSelected ? 'bg-primary-200 text-primary-900' : 
                    'hover:bg-gray-50 text-gray-700'
                  }
                `}
                disabled={isBlocked}
                title={isBlocked ? `Blocked: ${blockedDate?.title}${blockedDate?.reason ? ` - ${blockedDate.reason}` : ''}` : 
                       dayEvents.length > 0 ? `${dayEvents.map(e => e.title).join(', ')}` : undefined}
              >
                {day.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Event Legend */}
      {/* <div className="p-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Event Types</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(eventTypeLabels).map(([type, label]) => (
            <div key={type} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${eventTypeColors[type as keyof typeof eventTypeColors].split(' ')[0]}`} />
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-gray-600">Blocked/Unavailable</span>
          </div>
        </div>
      </div> */}

      {/* Selected Date Info */}
      {selectedDate && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h4>
          {isDateBlocked(selectedDate) ? (
            <div className="space-y-2">
              <div className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Blocked/Unavailable
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>{getBlockedDateForDate(selectedDate)?.title}</strong></p>
                {getBlockedDateForDate(selectedDate)?.reason && (
                  <p className="text-xs text-gray-500 mt-1">
                    {getBlockedDateForDate(selectedDate)?.reason}
                  </p>
                )}
              </div>
            </div>
          ) : selectedEvent ? (
            <div className="space-y-2">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${eventTypeColors[selectedEvent.type]}`}>
                {eventTypeLabels[selectedEvent.type]}
              </div>
              <div className="text-sm text-gray-700">
                <p><strong>{selectedEvent.title}</strong></p>
                {selectedEvent.startDate !== selectedEvent.endDate && (
                  <p className="text-xs text-gray-500">
                    {new Date(selectedEvent.startDate).toLocaleDateString()} - {new Date(selectedEvent.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Available for booking</p>
          )}
        </div>
      )}
    </div>
  )
}
