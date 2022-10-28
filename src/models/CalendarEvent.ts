import { ShortDaysOfWeek } from "../enums/ShortDaysOfWeek";
import { DateUtils } from "../utils/DateUtils";
import { EventTime } from "./EventTime";

export class CalendarEvent {
  startTime: Date;
  endTime: Date;
  title: string;
  shortDayOfWeek: ShortDaysOfWeek;

  constructor(
    title: string,
    currentDate: Date,
    startTime: EventTime,
    endTime: EventTime,
    eventInDays: number
  ) {
    this.title = title;
    currentDate.setDate(currentDate.getDate() + eventInDays);
    this.shortDayOfWeek = DateUtils.toShortDaysOfWeekSingle(currentDate.getDay());
    this.startTime = new Date(currentDate.setHours(startTime.hour, startTime.minute, 0, 0));
    this.endTime = new Date(currentDate.setHours(endTime.hour, endTime.minute, 0, 0));
  }
}
