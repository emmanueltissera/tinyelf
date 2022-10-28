import { RosterCheck } from "../../src/enums/RosterCheck";
import { TeamMapper } from "../../src/mappers/Team.mapper";
import { CalendarEvent } from "../../src/models/CalendarEvent";
import { Team } from "../../src/models/Team";
import { TeamMember } from "../../src/models/TeamMember";
import { Mother } from "../Mother";

function memberTrikeIsAvailable(
  team: Team,
  calendarEvent: CalendarEvent,
  rosterCheck: RosterCheck
): TeamMember | null {
  if (rosterCheck == RosterCheck.None) {
    calendarEvent.title = "Dummy event1";
  }
  rosterCheck = RosterCheck.None;
  return team.members.filter((x) => x.emailAddress == Mother.memberTrikeObject?.emailAddress)[0];
}

describe("test 4 person Team model", () => {
  let team1 = TeamMapper.map(Mother.data);
  let memberFiltered = team1.filterForMember(
    memberTrikeIsAvailable,
    Mother.calendarDummyEvent24Oct,
    RosterCheck.None
  );

  it("should return Trike for memberFiltered.name", () => {
    expect(memberFiltered?.name).toBe(Mother.memberTrikeObject?.name);
  });

  it("filtered team should return 3 for team1.members.length", () => {
    expect(team1.members.length).toEqual(3);
  });

  it("sorted team should return Trike for team1.members[0].name", () => {
    expect(team1.members[0].name).toBe("Trike");
  });

  it("sorted team should return 01-Jan-2001 for team1.members[0].lastHostDate", () => {
    expect(team1.members[0].lastHostDate.formatToDayMonthYear()).toBe("01-Jan-2001");
  });

  it("sorted team should return 04-Oct-2022 for team1.members[2].lastHostDate", () => {
    expect(team1.members[2].lastHostDate.formatToDayMonthYear()).toBe("04-Oct-2022");
  });
});
