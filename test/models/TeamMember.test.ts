import { TeamMember } from "../../src/models/TeamMember";
import { Mother } from "../Mother";
import "../../src/utils/Date.extensions";

function memberRecordLastDate(teamMember: TeamMember): boolean {
  const newRecordDate = new Date("16-Oct-2022");
  teamMember.lastHostDate = newRecordDate;
  return true;
}

describe("test Team member last record date", () => {
  const member = Mother.memberSonnyObject;

  it("should return 28-Sep-2022 for member.lastHostDate before recording new date", () => {
    expect(member?.lastHostDate.formatToDayMonthYear()).toBe("28-Sep-2022");
  });

  it("should return 16-Oct-2022 for member.lastHostDate after recording new date", () => {
    member?.recordLastHostDate(memberRecordLastDate, Mother.calendarDummyEvent24Oct);
    expect(member?.lastHostDate.formatToDayMonthYear()).toBe("16-Oct-2022");
  });
});
