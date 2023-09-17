import { PropertyKeys } from "./enums/PropertyKeys";
import { CalendarEventDoesNotExistError } from "./errors/CalendarNotAccessibleError copy";
import { NotificationResult } from "./models/NotificationResult";
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
import { SOURCE_VERSION } from "./Version";

export function notifyTeamMember(throwCheckEventError = true): NotificationResult {
  const settings = new Settings();
  const currentDate = new Date();

  if (!DateUtils.isGivenDayInArray(settings.triggerOnDays, currentDate)) {
    const message = `This script should not run on ${currentDate.formatToDayName()}.`;
    Logger.log(message);
    return new NotificationResult(
      false,
      message,
      `Please check 'Trigger on days' setting and add '${currentDate.formatToShortDayName()}' if appropriate.`
    );
  }

  const calendarEvent = settings.getCalendarEventTiming(currentDate);
  if (settings.checkEventExists && !CalendarService.isCalendarEventScheduled(calendarEvent)) {
    const errorMessage = `Event titled '${
      calendarEvent.title
    }' on ${calendarEvent.startTime.formatDateTime()} does not exist on the calendar of trigger owner (${CalendarService.getTriggerOwnerEmail()}).`;
    if (!throwCheckEventError) {
      Logger.log(errorMessage);
      return new NotificationResult(false, errorMessage);
    }
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
    const tokenisedMessageSummary = TokenManager.replaceTokens(settings.messageSummary, teamMember);
    const tokenisedMessageBody = TokenManager.replaceTokens(settings.messageBody, teamMember);
    const tokenisedMessageFooter = TokenManager.replaceTokens(settings.messageFooter, teamMember);
    slackPayload = SlackMessageBuilder.buildAlert(
      tokenisedMessageSummary,
      tokenisedMessageBody,
      tokenisedMessageFooter
    );

    teamMember.recordLastHostDate(SpreadsheetService.recordLastHostDate, calendarEvent);
  }

  SlackService.sendAlert(slackPayload, settings.slackWebhookUrl);

  return new NotificationResult(true, "Notification has been sent to Slack.");
}

global.notifyTeamMember = notifyTeamMember;

export function skipTeamMember(): NotificationResult {
  const settings = new Settings();
  const currentDate = new Date();
  const team = SpreadsheetService.getTeam();

  const calendarEvent = settings.getCalendarEventTiming(currentDate);
  const rosteredTeamMember = team.filterForMember(
    CalendarService.filterHostForGivenDay,
    calendarEvent,
    settings.rosterCheck
  );

  const notificationResult = notifyTeamMember();

  if (notificationResult.success) {
    rosteredTeamMember?.removeLastHostDate(SpreadsheetService.removeLastHostDate);
  }

  return notificationResult;
}

global.skipTeamMember = skipTeamMember;

export function notifyTeamMemberFromUi(): void {
  try {
    const notificationResult = notifyTeamMember();
    SpreadsheetService.showModalWindow(
      notificationResult.getNotificationTitle(),
      notificationResult.message,
      notificationResult.hint
    );
  } catch (e) {
    const error = e as Error;
    SpreadsheetService.showModalWindow("Failure", error.message);
  }
}

global.notifyTeamMemberFromUi = notifyTeamMemberFromUi;

export function notifyTeamMemberFromTrigger(): void {
  try {
    notifyTeamMember(false);
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
    const notificationResult = skipTeamMember();
    SpreadsheetService.showModalWindow(
      notificationResult.getNotificationTitle(),
      notificationResult.message,
      notificationResult.hint
    );
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

export function getSourceCodeVersion(): string {
  return SOURCE_VERSION;
}

global.SOURCEVERSION = getSourceCodeVersion;
