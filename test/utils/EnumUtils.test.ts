import { RosterCheck } from "../../src/enums/RosterCheck";
import { EnumUtils } from "../../src/utils/EnumUtils";
import "../../src/utils/String.extensions";

describe("test toRosterCheck function", () => {
  it("should return enum RosterCheck.Available for 'They are available [Available]' text", () => {
    expect(EnumUtils.toRosterCheck("They are available [Available]")).toBe(RosterCheck.Available);
  });

  it("should return enum RosterCheck.Available for 'They have accepted the event invitation [AcceptedInvite]' text", () => {
    expect(
      EnumUtils.toRosterCheck("They have accepted the event invitation [AcceptedInvite]")
    ).toBe(RosterCheck.AcceptedInvite);
  });

  it("should return enum RosterCheck.Available for 'They are available [Available]' text", () => {
    expect(
      EnumUtils.toRosterCheck(
        "They have accepted the event invitation and are available [AcceptedAndAvailable]"
      )
    ).toBe(RosterCheck.AcceptedAndAvailable);
  });

  it("should return enum RosterCheck.Available for 'They are available [Available]' text", () => {
    expect(
      EnumUtils.toRosterCheck(
        "It's their turn (irrespective of their availability or invitation response) [None]"
      )
    ).toBe(RosterCheck.None);
  });
});
