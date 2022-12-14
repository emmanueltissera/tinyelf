import { PropertyKeys } from "./enums/PropertyKeys";
import { CalendarEventDoesNotExistError } from "./errors/CalendarNotAccessibleError copy";
import { Settings } from "./models/Settings";
import { SlackPayload } from "./models/SlackPayload";
import { CalendarService } from "./services/CalendarService";
import { PropertyHelperService } from "./services/PropertyHelperService";
import { SlackService } from "./services/SlackService";
import { SpreadsheetService } from "./services/SpreadsheetService";
import { TriggerService } from "./services/TriggerService";
import { onOpen } from "./SimpleTriggers";
import { DateUtils } from "./utils/DateUtils";
import { SlackMessageBuilder } from "./utils/SlackMessageBuilder";
import { TokenManager } from "./utils/TokenManager";

export function notifyTeamMember(checkTriggerDay = true): void {
  const settings = new Settings();
  const currentDate = new Date();

  if (checkTriggerDay && !DateUtils.isGivenDayInArray(settings.triggerOnDays, currentDate)) {
    Logger.log(`Should not run on ${currentDate.formatToDayName()}`);
    return;
  }

  const calendarEvent = settings.getCalendarEventTiming(currentDate);
  if (settings.checkEventExists && !CalendarService.isCalendarEventScheduled(calendarEvent)) {
    const errorMessage = `Event titled '${
      calendarEvent.title
    }' on ${calendarEvent.startTime.formatDateTime()} does not exist on the calendar of trigger owner (${CalendarService.getTriggerOwnerEmail()}).`;
    throw new CalendarEventDoesNotExistError(404, errorMessage, calendarEvent);
  }

  const team = SpreadsheetService.getTeam();
  const teamMember = team.filterForMember(
    CalendarService.filterTeamMemberToRoster,
    calendarEvent,
    settings.rosterCheck
  );

  let slackPayload: SlackPayload;

  if (teamMember == null) {
    const tokenisedMessage = TokenManager.replaceTokens(settings.busyMessage);
    slackPayload = SlackMessageBuilder.buildAlert(settings.messageBusySummary, tokenisedMessage);
  } else {
    const tokenisedMessageBody = TokenManager.replaceTokens(settings.messageBody, teamMember);
    const tokenisedMessageFooter = TokenManager.replaceTokens(settings.messageFooter, teamMember);
    slackPayload = SlackMessageBuilder.buildAlert(
      settings.messageSummary,
      tokenisedMessageBody,
      tokenisedMessageFooter
    );

    teamMember.recordLastHostDate(SpreadsheetService.recordLastHostDate, calendarEvent);
  }

  SlackService.sendAlert(slackPayload, settings.slackWebhookUrl);
}

global.notifyTeamMember = notifyTeamMember;

export function skipTeamMember(): void {
  const settings = new Settings();
  const currentDate = new Date();
  const team = SpreadsheetService.getTeam();

  const calendarEvent = settings.getCalendarEventTiming(currentDate);
  const rosteredTeamMember = team.filterForMember(
    CalendarService.filterHostForGivenDay,
    calendarEvent,
    settings.rosterCheck
  );

  notifyTeamMember(false);

  rosteredTeamMember?.removeLastHostDate(SpreadsheetService.removeLastHostDate);
}

global.skipTeamMember = skipTeamMember;

export function notifyTeamMemberFromUi(): void {
  try {
    notifyTeamMember();
    SpreadsheetService.showModalWindow("Success", "Notification has been sent to Slack.");
  } catch (e) {
    const error = e as Error;
    SpreadsheetService.showModalWindow("Failure", error.message);
  }
}

global.notifyTeamMemberFromUi = notifyTeamMemberFromUi;

export function notifyTeamMemberFromTrigger(): void {
  try {
    notifyTeamMember();
  } catch (e) {
    const error = e as Error;
    Logger.log(error.message);
    const settings = new Settings();
    const slackPayload = SlackMessageBuilder.buildAlert(
      "Tiny Elf has encountered an error",
      `*hmmm... Tiny Elf has encountered an error* :face_palm: \n${error.message}`
    );
    SlackService.sendAlert(slackPayload, settings.slackWebhookUrl);
  }
}

global.notifyTeamMemberFromTrigger = notifyTeamMemberFromTrigger;

export function skipTeamMemberFromUi(): void {
  try {
    skipTeamMember();
    SpreadsheetService.showModalWindow("Success", "Notification has been sent to Slack.");
  } catch (e) {
    const error = e as Error;
    SpreadsheetService.showModalWindow("Failure", error.message);
  }
}

global.skipTeamMemberFromUi = skipTeamMemberFromUi;

export function resetTriggerFromUi(): void {
  const handlerFunction = "notifyTeamMemberFromTrigger";
  const settings = new Settings();
  TriggerService.deleteIfTriggerExists(handlerFunction);
  TriggerService.createDailyTrigger(settings.triggerHour, settings.triggerMinute, handlerFunction);

  SpreadsheetService.showModalWindow("Success", "Trigger has been set/reset.");
}

global.resetTriggerFromUi = resetTriggerFromUi;

export function authoriseTinyElf(): void {
  PropertyHelperService.setUserPropertyValue(PropertyKeys.isAuthorised, "true");
  Logger.log(`isAuthorised property set.`);
  onOpen();
  SpreadsheetService.showModalWindow("Success", "Tiny Elf has been authorised.");
}

global.authoriseTinyElf = authoriseTinyElf;
