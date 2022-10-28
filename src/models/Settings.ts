import { RosterCheck } from "../enums/RosterCheck";
import { SettingsKeys } from "../enums/SettingsKeys";
import { ShortDaysOfWeek } from "../enums/ShortDaysOfWeek";
import { SpreadsheetService } from "../services/SpreadsheetService";
import { DateUtils } from "../utils/DateUtils";
import { EnumUtils } from "../utils/EnumUtils";
import { CalendarEvent } from "./CalendarEvent";
import { EventTime } from "./EventTime";

export class Settings {

    eventTitle: string;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    checkEventExists: boolean;
    rosterCheck: RosterCheck;

    busyMessage: string;
    messageBody: string;
    messageFooter: string;
    messageBusySummary: string;
    messageSummary: string;
    slackWebhookUrl: string;

    triggerDaysBefore: number;
    triggerHour: number;
    triggerMinute: number;
    triggerOnDays: ShortDaysOfWeek[];


    constructor() {

        // Event Timings
        this.eventTitle = SpreadsheetService.getCellValueByName(SettingsKeys.EventTitle);
        this.startHour = SpreadsheetService.getCellValueByName(SettingsKeys.StartHour);
        this.startMinute = SpreadsheetService.getCellValueByName(SettingsKeys.StartMinute);
        this.endHour = SpreadsheetService.getCellValueByName(SettingsKeys.EndHour);
        this.endMinute = SpreadsheetService.getCellValueByName(SettingsKeys.EndMinute);
        this.checkEventExists = SpreadsheetService.getCellValueByName(SettingsKeys.CheckEventExists).toString().toBoolean();
        this.rosterCheck = EnumUtils.toRosterCheck(SpreadsheetService.getCellValueByName(SettingsKeys.RosterCheck));

        // Slack Messaging
        this.busyMessage = SpreadsheetService.getCellValueByName(SettingsKeys.SlackMessageBusy);
        this.messageBody = SpreadsheetService.getCellValueByName(SettingsKeys.SlackMessageBody);
        this.messageFooter = SpreadsheetService.getCellValueByName(SettingsKeys.SlackMessageFooter);
        this.messageBusySummary = SpreadsheetService.getCellValueByName(SettingsKeys.SlackMessageBusySummary);
        this.messageSummary = SpreadsheetService.getCellValueByName(SettingsKeys.SlackMessageSummary);
        this.slackWebhookUrl = SpreadsheetService.getCellValueByName(SettingsKeys.SlackWebhookUrl);

        // Trigger settings

        this.triggerHour = SpreadsheetService.getCellValueByName(SettingsKeys.TriggerHour);
        this.triggerMinute = SpreadsheetService.getCellValueByName(SettingsKeys.TriggerMinute);
        this.triggerDaysBefore = SpreadsheetService.getCellValueByName(SettingsKeys.TriggerDaysBefore);
        this.triggerOnDays = DateUtils.toShortDaysOfWeekArray(SpreadsheetService.getCellValueByName(SettingsKeys.TriggerOnDays).toString());
    }

    getCalendarEventTiming(eventDate: Date): CalendarEvent {

        let eventStartTime = new EventTime(this.startHour, this.startMinute);
        let eventEndTime = new EventTime(this.endHour, this.endMinute);
        
        return new CalendarEvent(this.eventTitle, eventDate, eventStartTime, eventEndTime, this.triggerDaysBefore);
    }
}