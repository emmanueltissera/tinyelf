import { ShortDaysOfWeek } from "../../src/enums/ShortDaysOfWeek";
import { DateUtils } from "../../src/utils/DateUtils";
import "../../src/utils/String.extensions";

describe("test isGivenDayInString function", () => {
  it("should return true for 'Mon, Tue , Wed' if given date is 17-Oct-2022", () => {
    expect(DateUtils.isGivenDayInString("Mon, Tue , Wed", new Date("17-Oct-2022"))).toBeTruthy;
  });

  it("should return false for 'Mon, Wed, Thu, Fri' if given date is 17-Oct-2022", () => {
    expect(DateUtils.isGivenDayInString("Mon, Wed, Thu, Fri", new Date("17-Oct-2022"))).toBeFalsy;
  });

  it("should return true for 'Mon' if given date is 16-Oct-2022", () => {
    expect(DateUtils.isGivenDayInString("Mon", new Date("16-Oct-2022"))).toBeTruthy;
  });

  it("should return false for empty string if given date is 17-Oct-2022", () => {
    expect(DateUtils.isGivenDayInString("", new Date("17-Oct-2022"))).toBeFalsy;
  });
});

describe("test toShortDaysOfWeekArray function", () => {
  it("should return 'Mon' as first option if given string is 'Mon, Tue , Wed'", () => {
    const shortDayArray = DateUtils.toShortDaysOfWeekArray("Mon, Tue , Wed");
    expect(shortDayArray[0]).toBe(ShortDaysOfWeek.Mon);
  });

  it("should return 7 as length if given string is 'all'", () => {
    const shortDayArray = DateUtils.toShortDaysOfWeekArray("all");
    expect(shortDayArray.length).toEqual(7);
  });

  it("should return 7 as length if given string is ' All '", () => {
    const shortDayArray = DateUtils.toShortDaysOfWeekArray(" All ");
    expect(shortDayArray.length).toEqual(7);
  });

  it("should return 0 as length if given string is three spaces", () => {
    const shortDayArray = DateUtils.toShortDaysOfWeekArray("   ");
    expect(shortDayArray.length).toEqual(0);
  });

  it("should return 0 as length if given string is 'None'", () => {
    const shortDayArray = DateUtils.toShortDaysOfWeekArray("None");
    expect(shortDayArray.length).toEqual(0);
  });

  it("should return 'Sun' as first option if given string is 'Fri, Sat, Sun'", () => {
    const shortDayArray = DateUtils.toShortDaysOfWeekArray("Fri, Sat, Sun");
    expect(shortDayArray[0]).toBe(ShortDaysOfWeek.Fri);
  });

  it("should return 'Fri' as first option if given string is 'Sunday, Monday, Fri'", () => {
    const shortDayArray = DateUtils.toShortDaysOfWeekArray("Sunday, Monday, Fri");
    expect(shortDayArray[0]).toBe(ShortDaysOfWeek.Fri);
  });

  it("should return 'Sat' as first option if given string is 'Fir, Sat, Sunday'", () => {
    const shortDayArray = DateUtils.toShortDaysOfWeekArray("Fir, Sat, Sunday");
    expect(shortDayArray[0]).toBe(ShortDaysOfWeek.Sat);
  });
});
