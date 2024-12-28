import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function UserCalendar({ history }) {
  const [events, setEvents] = useState([]);  // Ensure events is an empty array by default
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (history && typeof history === "object") {
      // Convert the history object into an array
      const eventsArray = Object.values(history);
      setEvents(eventsArray);
    } else {
      // If history is not an object, log the actual data format
      console.error("History data is not in the expected format:", history);
      setEvents([]);  // Reset events to an empty array
    }
  }, [history]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Format selected date for comparison
  const formattedDate = selectedDate.toISOString().split("T")[0];

  // Find event matching selected date dynamically
  const eventForDate = events.find((event) => event.timestamp.startsWith(formattedDate));
  useEffect(() => {
    setSelectedEvent(eventForDate);
  }, [formattedDate, events]);

  const renderEventDetails = (event) => {
    if (!event || !event.mental_health_data) return null;

    // Dynamically render the mental health data fields
    return Object.keys(event.mental_health_data).map((key) => (
      <p key={key} className="text-blue-700">
        {`${capitalize(key)}: ${event.mental_health_data[key]}`}
      </p>
    ));
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="p-6 text-center w-full mx-auto bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Mental Health Calendar</h2>
      <div className="rounded-lg shadow">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileClassName={({ date }) => {
            const formatted = date.toISOString().split("T")[0];
            // Highlight dates with events
            let classes = '';
            if (events.some((event) => event.timestamp.startsWith(formatted))) {
              classes = "highlighted-date";
            }
            // Add class to highlight selected date
            if (date.toISOString().split("T")[0] === formattedDate) {
              classes += " selected-date";
            }
            return classes;
          }}
          className="mx-auto text-gray-700"
        />
      </div>
      {selectedEvent ? (
        <div className="mt-6 p-4 bg-blue-100 rounded-lg border border-blue-200">
          <h3 className="text-xl font-semibold text-blue-800">Mental Health Data</h3>
          {renderEventDetails(selectedEvent)}
        </div>
      ) : (
        <p className="mt-6 text-gray-600">No data for this day.</p>
      )}
      <style>
        {`
        .react-calendar__tile.highlighted-date {
          background: #3b82f6;
          color: white;
          font-weight: bold;
        }
        .react-calendar__tile.selected-date {
          background: #6366f1;
          color: white;
          font-weight: bold;
        }
        `}
      </style>
    </div>
  );
}

export default UserCalendar;
