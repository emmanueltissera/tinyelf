import { RosterCheck } from "../enums/RosterCheck";
import { CalendarNotAccessibleError } from "../errors/CalendarNotAccessibleError";
import { CalendarEvent } from "../models/CalendarEvent";
import { Team } from "../models/Team";
import { TeamMember } from "../models/TeamMember";

export class CalendarService {
  static filterHostForGivenDay(team: Team, calendarEvent: CalendarEvent): TeamMember | null {
    let hostForDay = team.members.filter(
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
    let inviteAcceptedMembers = CalendarService.filterInviteAcceptedTeamMembers(
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
    let scheduledEvent = CalendarService.getScheduledCalendarEvent(calendarEvent);

    if (scheduledEvent == null) {
      return null;
    }

    let guests = scheduledEvent?.getGuestList(true);

    let teamMembers = team.members.filter((member) => {
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
    let inviteAcceptedMembers = CalendarService.filterInviteAcceptedTeamMembers(
      team,
      calendarEvent
    );

    if (inviteAcceptedMembers == null || inviteAcceptedMembers.length == 0) {
      return null;
    }

    for (var i = 0; i < inviteAcceptedMembers.length; i++) {
      let teamMember = inviteAcceptedMembers[i];
      let isAvailable = CalendarService.isMemberCalendarFree(teamMember, calendarEvent);

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
    for (var i = 0; i < team.members.length; i++) {
      let teamMember = team.members[i];
      let isAvailable = CalendarService.isMemberCalendarFree(teamMember, calendarEvent);

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
    let emailAddress = teamMember.emailAddress;

    Logger.log('Trying to access the calendar of "%s".', emailAddress);

    var calendar = CalendarApp.getCalendarById(emailAddress);

    if (calendar == null) {
      try {
        calendar = CalendarApp.subscribeToCalendar(emailAddress, { hidden: true });
      } catch (e) {
        throw new CalendarNotAccessibleError(
          403,
          `Could not access ${emailAddress} calendar for team member`,
          teamMember
        );
      }
    }

    Logger.log('The calendar is named "%s".', calendar.getName());

    var events = calendar.getEvents(calendarEvent.startTime, calendarEvent.endTime);

    if (events.length > 1) {
      Logger.log(emailAddress + " has more than one event.");
      return false;
    }

    if (events.length == 1 && events[0].getTitle().indexOf(calendarEvent.title) >= 0) {
      Logger.log('The event title is "%s".', events[0].getTitle());
      return true;
    }

    return false;
  }

  static isCalendarEventScheduled(calendarEvent: CalendarEvent): boolean {
    var scheduledEvent = CalendarService.getScheduledCalendarEvent(calendarEvent);

    return scheduledEvent != null;
  }

  static getScheduledCalendarEvent(
    calendarEvent: CalendarEvent
  ): GoogleAppsScript.Calendar.CalendarEvent | null {
    var events = CalendarApp.getEvents(calendarEvent.startTime, calendarEvent.endTime);

    if (events.length > 0) {
      let scheduledEvents = events.filter((x) => x.getTitle().indexOf(calendarEvent.title) >= 0);
      if (scheduledEvents.length > 0) {
        return scheduledEvents[0];
      }
    }

    return null;
  }
}
