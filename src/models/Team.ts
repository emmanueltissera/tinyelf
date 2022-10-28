import { TeamMember } from "./TeamMember";
import "../utils/Date.extensions";
import { CalendarEvent } from "./CalendarEvent";
import { RosterCheck } from "../enums/RosterCheck";

export class Team {

    members = new Array<TeamMember>;

    private filterEnabledMembers() {
        this.members = this.members.filter(member => member.enabled);
    }

    private filterMembersForCalenderEvent(calendarEvent: CalendarEvent) {
        this.members = this.members.filter(member => member.rosterForDays.includes(calendarEvent.shortDayOfWeek));
    }

    private sort() {
        this.members.sort((x, y) => x.lastHostDate.sortByLastHosted(y.lastHostDate));
    }

    filterForMember(filterCallback: (team: Team, calendarEvent: CalendarEvent, rosterCheck: RosterCheck) => TeamMember | null, calendarEvent: CalendarEvent, rosterCheck: RosterCheck) : TeamMember | null {
        this.filterEnabledMembers();
        this.filterMembersForCalenderEvent(calendarEvent);
        this.sort();
        let team = this;
        return filterCallback(team, calendarEvent, rosterCheck);
    }
}