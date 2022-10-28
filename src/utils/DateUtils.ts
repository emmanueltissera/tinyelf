import { ShortDaysOfWeek } from "../enums/ShortDaysOfWeek";
import { ShortDaysOfWeekCompositeKeys } from "../enums/ShortDaysOfWeekCompositeKeys";

export class DateUtils {
  static isGivenDayInString(shortDayList: string, givenDate: Date) {
    const shortDaysOfWeek = DateUtils.toShortDaysOfWeekArray(shortDayList);

    return DateUtils.isGivenDayInArray(shortDaysOfWeek, givenDate);
  }

  static isGivenDayInArray(shortDaysOfWeek: ShortDaysOfWeek[], givenDate: Date) {
    const dayOfWeek = givenDate.getDay();
    const givenDay = DateUtils.toShortDaysOfWeekSingle(dayOfWeek);

    const matchingDays = shortDaysOfWeek.filter((x) => x === givenDay);

    return matchingDays.length > 0;
  }

  static toShortDaysOfWeekArray(shortDayList: string): ShortDaysOfWeek[] {
    shortDayList = shortDayList.trim();

    if (
      shortDayList === "" ||
      shortDayList.convertToProperCase() === ShortDaysOfWeekCompositeKeys.None
    ) {
      return [];
    }

    if (shortDayList.convertToProperCase() === ShortDaysOfWeekCompositeKeys.All) {
      return [
        ShortDaysOfWeek.Mon,
        ShortDaysOfWeek.Tue,
        ShortDaysOfWeek.Wed,
        ShortDaysOfWeek.Thu,
        ShortDaysOfWeek.Fri,
        ShortDaysOfWeek.Sat,
        ShortDaysOfWeek.Sun,
      ];
    }

    const shortDayArray = shortDayList.split(",");
    let matchingDays = shortDayArray.map((x) => {
      const dayShortName = x.trim().convertToProperCase() as keyof typeof ShortDaysOfWeek;
      return ShortDaysOfWeek[dayShortName];
    });

    matchingDays = matchingDays.filter((x) => x >= ShortDaysOfWeek.Sun && x <= ShortDaysOfWeek.Sat);

    return matchingDays;
  }

  static toShortDaysOfWeekSingle(dayOfWeek: number): ShortDaysOfWeek {
    const dayOfWeekName = ShortDaysOfWeek[dayOfWeek];
    const dayOfWeekEnum = dayOfWeekName as keyof typeof ShortDaysOfWeek;
    return ShortDaysOfWeek[dayOfWeekEnum];
  }
}
