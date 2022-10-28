import "../../src/utils/Date.extensions";

describe("test formatToDayMonthYear function", () => {
    it("should return 01-Jan-2007 for \"01-Jan-2007\".formatToDayMonthYear()", () => {
      expect(new Date("01-Jan-2007").formatToDayMonthYear()).toBe("01-Jan-2007");
    });
  });