import { CalendarEvent } from "../models/CalendarEvent";

export class CalendarEventDoesNotExistError extends Error {
  code: number;
  calendarEvent: CalendarEvent;

  constructor(code: number, message: string, calendarEvent: CalendarEvent) {
    super(message);
    this.code = code;
    this.calendarEvent = calendarEvent;
  }
}
