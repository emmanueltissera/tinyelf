import { CalendarEventDoesNotExistError } from "./errors/CalendarNotAccessibleError copy";
import { Settings } from "./models/Settings";
import { SlackPayload } from "./models/SlackPayload";
import { CalendarService } from "./services/CalendarService";
import { SlackService } from "./services/SlackService";
import { SpreadsheetService } from "./services/SpreadsheetService";
import { TriggerService } from "./services/TriggerService";
import { DateUtils } from "./utils/DateUtils";
import { SlackMessageBuilder } from "./utils/SlackMessageBuilder";
import { TokenManager } from "./utils/TokenManager";

export function notifyTeamMember(skipTriggerDayCheck: boolean = false): void {
  let settings = new Settings();
  let currentDate = new Date();

  if (skipTriggerDayCheck && !DateUtils.isGivenDayInArray(settings.triggerOnDays, currentDate)) {
    Logger.log(`Should not run on ${currentDate.formatToDayName()}`);
    return;
  }

  let calendarEvent = settings.getCalendarEventTiming(currentDate);
  if (settings.checkEventExists && !CalendarService.isCalendarEventScheduled(calendarEvent)) {
    let errorMessage = `Calendar event '${
      calendarEvent.title
    }' on ${calendarEvent.startTime.formatDateTime()} does not exist on trigger owner's calendar`;
    Logger.log(errorMessage);
    throw new CalendarEventDoesNotExistError(404, errorMessage, calendarEvent);
  }

  let team = SpreadsheetService.getTeam();
  let teamMember = team.filterForMember(
    CalendarService.filterTeamMemberToRoster,
    calendarEvent,
    settings.rosterCheck
  );

  let slackPayload: SlackPayload;

  if (teamMember == null) {
    let tokenisedMessage = TokenManager.replaceTokens(settings.busyMessage);
    slackPayload = SlackMessageBuilder.buildAlert(settings.messageBusySummary, tokenisedMessage);
  } else {
    let tokenisedMessageBody = TokenManager.replaceTokens(settings.messageBody, teamMember);
    let tokenisedMessageFooter = TokenManager.replaceTokens(settings.messageFooter, teamMember);
    slackPayload = SlackMessageBuilder.buildAlert(
      settings.messageSummary,
      tokenisedMessageBody,
      tokenisedMessageFooter
    );

    teamMember.recordLastHostDate(SpreadsheetService.recordLastHostDate, calendarEvent);
  }

  SlackService.sendAlert(slackPayload, settings.slackWebhookUrl);
}

export function skipTeamMember(): void {
  let settings = new Settings();
  let currentDate = new Date();
  let team = SpreadsheetService.getTeam();

  let calendarEvent = settings.getCalendarEventTiming(currentDate);
  let rosteredTeamMember = team.filterForMember(
    CalendarService.filterHostForGivenDay,
    calendarEvent,
    settings.rosterCheck
  );

  notifyTeamMember(true);

  rosteredTeamMember?.removeLastHostDate(SpreadsheetService.removeLastHostDate);
}

export function notifyTeamMemberFromUi(): void {
  try {
    notifyTeamMember();
    SpreadsheetService.showModalWindow("Success", "Notification has been sent to Slack.");
  } catch (e) {
    let error = e as Error;
    SpreadsheetService.showModalWindow("Failure", error.message);
  }
}

export function skipTeamMemberFromUi(): void {
  try {
    skipTeamMember();
    SpreadsheetService.showModalWindow("Success", "Notification has been sent to Slack.");
  } catch (e) {
    let error = e as Error;
    SpreadsheetService.showModalWindow("Failure", error.message);
  }
}

export function resetTriggerFromUi(): void {
  let handlerFunction = "notifyTeamMember";
  let settings = new Settings();
  TriggerService.deleteIfTriggerExists(handlerFunction);
  TriggerService.createDailyTrigger(settings.triggerHour, settings.triggerMinute, handlerFunction);

  SpreadsheetService.showModalWindow("Success", "Trigger has been reset");
}
