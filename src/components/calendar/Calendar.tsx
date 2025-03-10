'use client';
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg, EventContentArg } from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { useTranslations } from "next-intl";
interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const t = useTranslations();

  const calendarsEvents = {
    Danger: "Danger",
    Success: "Success",
    Primary: "Primary",
    Warning: "Warning",
  };

  const token = sessionStorage.getItem("auth-token");
  const fetchEvents = async () => {
    try {
      const response = await fetch("https://server.capital-trust.eu/api/events-admin", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        // Map events to FullCalendar format
        const formattedEvents = data.map((event: CalendarEvent) => ({
          id: event.id,
          title: event.title,
          start: event.start_date, // Correct format
          end: event.end_date, // Correct format
          extendedProps: {
            calendar: event.level, // Event level
          },
        }));
        setEvents(formattedEvents); // Set formatted events
      } else {
        console.error("Error fetching events:", data.error);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };
  // Fetch events from the API when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setEventEndDate(event.end?.toISOString().split("T")[0] || "");
    setEventLevel(event.extendedProps.calendar);
    openModal();
  };

  const handleAddOrUpdateEvent = async () => {
    const validLevels = ["Danger", "Success", "Primary", "Warning"];
    if (!validLevels.includes(eventLevel)) {
      alert("Please select a valid event level.");
      return;
    }
  
    if (selectedEvent) {
      // Update existing event
      try {
        const response = await fetch(`https://server.capital-trust.eu/api/events-admin`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedEvent.id, // Adding id in the body (optional, not typically needed)
            title: eventTitle,
            start_date: eventStartDate,
            end_date: eventEndDate,
            level: eventLevel,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.id === data.id ? { ...event, ...data } : event
            )
            
          );
        } else {
          console.error("Error updating event:", data.error);
        }
      } catch (err) {
        console.error("Error updating event:", err);
      }
    } else {
      // Add new event
      try {
        const response = await fetch("https://server.capital-trust.eu/api/events-admin", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: eventTitle,
            start_date: eventStartDate,
            end_date: eventEndDate,
            level: eventLevel,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setEvents((prevEvents) => [
            ...prevEvents,
            { ...data, id: data.id },
          ]);
          fetchEvents();

        } else {
          console.error("Error saving event:", data.error);
        }
      } catch (err) {
        console.error("Error saving event:", err);
      }
    }
    closeModal();
    resetModalFields();
  };
  
  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        const response = await fetch("https://server.capital-trust.eu/api/events-admin", {
          method: "DELETE", // Still using DELETE method
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedEvent.id, // Send the ID in the body
          }),
        });
  
        const data = await response.json();
        if (response.ok) {
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== selectedEvent.id)
          );
          closeModal();
          fetchEvents();

        } else {
          console.error("Error deleting event:", data.error);
        }
      } catch (err) {
        console.error("Error deleting event:", err);
      }
    }
  };
  

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedEvent(null);
  };

  // Render event content with dynamic background color based on 'level'
  const renderEventContent = (eventContent: EventContentArg) => {
    const level = eventContent.event.extendedProps.calendar;
    let backgroundColor = "#00ff00"; // Default color

    // Define colors based on event level
    switch (level) {
      case "Danger":
        backgroundColor = "#ff3b3b"; // Red
        break;
      case "Success":
        backgroundColor = "#4caf50"; // Green
        break;
      case "Primary":
        backgroundColor = "#2196f3"; // Blue
        break;
      case "Warning":
        backgroundColor = "#ff9800"; // Orange
        break;
      default:
        backgroundColor = "#9e9e9e"; // Gray
    }

    return (
      <div className="fc-event-main">
        <div className="event-fc-color flex fc-event-main fc-bg-primary p-1 rounded-sm">
          <div className="fc-daygrid-event-dot"  style={{ backgroundColor }}></div>
          <div className="fc-event-time"></div>
          <div className="fc-event-title">
            <strong>{eventContent.event.title}</strong>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events} // Pass formatted events to FullCalendar
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          customButtons={{
            addEventButton: {
              text: `${t("addevent")} +`,
              click: openModal,
            },
          }}
        />
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10">
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {selectedEvent ? "Edit Event" : "Add Event"}
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("calendarp1")}
            </p>
          </div>
          <div className="mt-8">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              {t("calendarp2")} 
              </label>
              <input
                id="event-title"
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400"
                placeholder="Enter event name"
              />
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              {t("calendarp3")}   
              </label>
              <input
                type="date"
                value={eventStartDate}
                onChange={(e) => setEventStartDate(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400"
              />
              <input
                type="date"
                value={eventEndDate}
                onChange={(e) => setEventEndDate(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full mt-3 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400"
              />
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              {t("calendarp4")}
              </label>
              <div className="dark:bg-dark-900 p-4 rounded-lg">
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
  {Object.entries(calendarsEvents).map(([key, value]) => (
    <label
      key={key}
      className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
    >
      <input
        type="radio"
        name="eventLevel"
        value={value}
        checked={eventLevel === value}
        onChange={() => setEventLevel(value)}
        className="h-4 w-4 text-brand-500 border-gray-300 focus:ring-0 dark:border-gray-700 dark:bg-dark-900"
      />
      <span className="ml-1">{key}</span> {/* Adjust spacing if needed */}
    </label>
  ))}
</div>

</div>

            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={closeModal}
              className="h-11 rounded-lg border border-gray-300 bg-transparent px-6 py-3 text-sm font-semibold text-gray-800 shadow-theme-xs hover:bg-gray-100 focus:outline-none dark:border-gray-700 dark:text-white dark:hover:bg-white/10"
            >
             {t("calendarp5")} 
            </button>
            <button
              onClick={handleAddOrUpdateEvent}
              className="h-11 rounded-lg border border-gray-300 bg-primary px-6 py-3 text-sm font-semibold text-gray-800 shadow-theme-xs hover:bg-primary-500 focus:outline-none dark:border-gray-700 dark:bg-primary-500 dark:text-white dark:hover:bg-primary-600"
            >
              {selectedEvent ? `${t("calendar7")}` : `${t("calendar7")}`}
            </button>
            {selectedEvent && (
              <button
                onClick={handleDeleteEvent}
                className="h-11 rounded-lg border border-gray-300 bg-danger-500 px-6 py-3 text-sm font-semibold text-gray-800 shadow-theme-xs hover:bg-danger-400 focus:outline-none dark:border-gray-700 dark:bg-danger-500 dark:text-white dark:hover:bg-danger-600"
              >
               {t("calendarp6")}   
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;
