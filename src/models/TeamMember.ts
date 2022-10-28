import { SettingsKeys } from "../enums/SettingsKeys";
import { ShortDaysOfWeek } from "../enums/ShortDaysOfWeek";
import { CalendarEvent } from "./CalendarEvent";

export class TeamMember {
  name = "";
  emailAddress = "";
  slackMemberId = "";
  enabled = false;
  lastHostDate: Date = new Date(SettingsKeys.MinimumHostDate);
  rowNumber = -1;
  rosterForDays: ShortDaysOfWeek[] = [];

  recordLastHostDate(
    recordCallback: (teamMember: TeamMember, calendarEvent: CalendarEvent) => boolean,
    calendarEvent: CalendarEvent
  ): boolean {
    return recordCallback(this, calendarEvent);
  }

  removeLastHostDate(recordCallback: (teamMember: TeamMember) => boolean): boolean {
    return recordCallback(this);
  }
}
