import { TeamMemberMapper } from "../../src/mappers/TeamMember.mapper";
import { Mother } from "../Mother";
import "../../src/utils/Date.extensions";

describe("test 'Mia' TeamMember model", () => {
  let member1 = TeamMemberMapper.map(Mother.memberMiaData, 1);
  it("should return Mia for member1.name", () => {
    expect(member1?.name).toBe("Mia");
  });
  it("should return mia+fake@binkmail.com for member1.emailAddress", () => {
    expect(member1?.emailAddress).toBe("mia+fake@binkmail.com");
  });
  it("should return U8233HAJ2 for member1.slackMemberId", () => {
    expect(member1?.slackMemberId).toBe("U8233HAJ2");
  });
  it("should return true for member1.enabled", () => {
    expect(member1?.enabled).toBe(true);
  });
  it("should return 3-Oct-2022 for member1.lastHostDate", () => {
    expect(member1?.lastHostDate.formatToDayMonthYear()).toBe("03-Oct-2022");
  });
});

describe("test 'Lucy' TeamMember model", () => {
  let member1 = TeamMemberMapper.map(Mother.memberLucyData, 1);
  it("should return Lucy for member1.name", () => {
    expect(member1?.name).toBe("Lucy");
  });
  it("should return lucy+fake@binkmail.com for member1.emailAddress", () => {
    expect(member1?.emailAddress).toBe("lucy+fake@binkmail.com");
  });
  it("should return U0763278U6T for member1.slackMemberId", () => {
    expect(member1?.slackMemberId).toBe("U0763278U6T");
  });
  it("should return false for member1.enabled", () => {
    expect(member1?.enabled).toBe(false);
  });
  it("should return 01-Jan-2001 for member1.lastHostDate", () => {
    expect(member1?.lastHostDate.formatToDayMonthYear()).toBe("01-Jan-2001");
  });
});
