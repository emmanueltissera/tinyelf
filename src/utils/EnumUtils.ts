import { RosterCheck } from "../enums/RosterCheck";

export class EnumUtils {
  static toRosterCheck(selection: string): RosterCheck {
    const settingvalue = selection.substring(selection.indexOf("[") + 1, selection.indexOf("]"));
    const settingName = settingvalue as keyof typeof RosterCheck;
    return RosterCheck[settingName];
  }
}
