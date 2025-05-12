import { RosterCheck } from "../enums/RosterCheck";
import { CalendarNotAccessibleError } from "../errors/CalendarNotAccessibleError";
import { CalendarEvent } from "../models/CalendarEvent";
import { Team } from "../models/Team";
import { TeamMember } from "../models/TeamMember";

export class CalendarService {
  static filterHostForGivenDay(team: Team, calendarEvent: CalendarEvent): TeamMember | null {
    const hostForDay = team.members.filter(
      (x) => x.lastHostDate.getDate() === calendarEvent.startTime.getDate()
    );

    if (hostForDay.length == 1) {
      return hostForDay[0];
    }

    return null;
  }

  static filterTeamMemberToRoster(
    team: Team,
    calendarEvent: CalendarEvent,
    rosterCheck: RosterCheck
  ): TeamMember | null {
    switch (rosterCheck) {
      case RosterCheck.Available:
        return CalendarService.filterAvailableTeamMember(team, calendarEvent);
      case RosterCheck.AcceptedInvite:
        return CalendarService.filterInviteAcceptedTeamMember(team, calendarEvent);
      case RosterCheck.AcceptedAndAvailable:
        return CalendarService.filterAcceptedAndAvailableTeamMember(team, calendarEvent);
      case RosterCheck.None:
        return team.members[0];
    }
  }

  private static filterInviteAcceptedTeamMember(
    team: Team,
    calendarEvent: CalendarEvent
  ): TeamMember | null {
    const inviteAcceptedMembers = CalendarService.filterInviteAcceptedTeamMembers(
      team,
      calendarEvent
    );

    if (inviteAcceptedMembers == null || inviteAcceptedMembers.length == 0) {
      return null;
    }

    return inviteAcceptedMembers[0];
  }

  private static filterInviteAcceptedTeamMembers(
    team: Team,
    calendarEvent: CalendarEvent
  ): TeamMember[] | null {
    const scheduledEvent = CalendarService.getScheduledCalendarEvent(calendarEvent);

    if (scheduledEvent == null) {
      return null;
    }

    const guests = scheduledEvent?.getGuestList(true);

    const teamMembers = team.members.filter((member) => {
      return guests.some((guest) => {
        return (
          guest.getEmail() == member.emailAddress &&
          guest.getGuestStatus() == CalendarApp.GuestStatus.YES
        );
      });
    });

    return teamMembers;
  }

  private static filterAcceptedAndAvailableTeamMember(
    team: Team,
    calendarEvent: CalendarEvent
  ): TeamMember | null {
    const inviteAcceptedMembers = CalendarService.filterInviteAcceptedTeamMembers(
      team,
      calendarEvent
    );

    if (inviteAcceptedMembers == null || inviteAcceptedMembers.length == 0) {
      return null;
    }

    for (let i = 0; i < inviteAcceptedMembers.length; i++) {
      const teamMember = inviteAcceptedMembers[i];
      const isAvailable = CalendarService.isMemberCalendarFree(teamMember, calendarEvent);

      if (isAvailable) {
        return teamMember;
      }
    }

    return null;
  }

  private static filterAvailableTeamMember(
    team: Team,
    calendarEvent: CalendarEvent
  ): TeamMember | null {
    for (let i = 0; i < team.members.length; i++) {
      const teamMember = team.members[i];
      const isAvailable = CalendarService.isMemberCalendarFree(teamMember, calendarEvent);

      if (isAvailable) {
        return teamMember;
      }
    }

    return null;
  }

  private static isMemberCalendarFree(
    teamMember: TeamMember,
    calendarEvent: CalendarEvent
  ): boolean {
    const emailAddress = teamMember.emailAddress;
    const debug = false;

    let calendar = CalendarApp.getCalendarById(emailAddress);

    if (calendar == null) {
      try {
        calendar = CalendarApp.subscribeToCalendar(emailAddress, { hidden: true });
      } catch (e) {
        throw new CalendarNotAccessibleError(
          403,
          `Trigger owner (${CalendarService.getTriggerOwnerEmail()}) could not access calendar for team member ${emailAddress}`,
          teamMember
        );
      }
    }

    const events = calendar.getEvents(calendarEvent.startTime, calendarEvent.endTime);

    if (debug) {
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        Logger.log("event.getTitle(): " + event.getTitle());
        Logger.log("event.getEventType(): " + event.getEventType());
        Logger.log("event.getStartTime(): " + event.getStartTime());
        Logger.log("event.getEndTime(): " + event.getEndTime());
        Logger.log("event.getGuestList().length: " + event.getGuestList().length);
        Logger.log("event.getGuestByEmail(emailAddress): " + event.getGuestByEmail(emailAddress));
        Logger.log("!event.getGuestByEmail(emailAddress):" + !event.getGuestByEmail(emailAddress));
      }
    }

    const acceptedEvents = events.filter(
      (e) =>
        e.getTitle().indexOf(calendarEvent.title) < 0 &&
        e.getEventType() != CalendarApp.EventType.WORKING_LOCATION &&
        (e.getGuestList().length == 0 ||
          !e.getGuestByEmail(emailAddress) ||
          !e.getGuestByEmail(emailAddress).getGuestStatus() ||
          e.getGuestByEmail(emailAddress).getGuestStatus() === CalendarApp.GuestStatus.OWNER ||
          e.getGuestByEmail(emailAddress).getGuestStatus() === CalendarApp.GuestStatus.YES)
    );

    if (acceptedEvents.length > 0) {
      Logger.log(emailAddress + " has more than one accepted event.");
      return false;
    }

    const thisEvent = events.filter((e) => e.getTitle().indexOf(calendarEvent.title) >= 0);

    if (thisEvent.length == 1) {
      Logger.log('The event title is "%s".', thisEvent[0].getTitle());
      return true;
    }

    return false;
  }

  static isCalendarEventScheduled(calendarEvent: CalendarEvent): boolean {
    const scheduledEvent = CalendarService.getScheduledCalendarEvent(calendarEvent);

    return scheduledEvent != null;
  }

  static getScheduledCalendarEvent(
    calendarEvent: CalendarEvent
  ): GoogleAppsScript.Calendar.CalendarEvent | null {
    const events = CalendarApp.getEvents(calendarEvent.startTime, calendarEvent.endTime);

    if (events.length > 0) {
      const scheduledEvents = events.filter((x) => x.getTitle().indexOf(calendarEvent.title) >= 0);
      if (scheduledEvents.length > 0) {
        return scheduledEvents[0];
      }
    }

    return null;
  }

  static getTriggerOwnerEmail(): string {
    return Session.getEffectiveUser().getEmail();
  }
}
