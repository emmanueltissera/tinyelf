import { TeamMapper } from "../../src/mappers/Team.mapper";
import { Mother } from "../Mother";

describe("test 4 person Team model", () => {
  const team1 = TeamMapper.map(Mother.data);
  it("should return 4 for team1.members.length", () => {
    expect(team1.members.length).toEqual(4);
  });
  it("should return Sonny for team1.members[1].name", () => {
    expect(team1.members[1].name).toBe("Sonny");
  });
  it("should return false for team1.members[3].enabled", () => {
    expect(team1.members[3].enabled).toBe(false);
  });
});
