import { RosterCheck } from "../enums/RosterCheck";

export class EnumUtils {
    static toRosterCheck(selection: string): RosterCheck {
        let settingvalue = selection.substring(selection.indexOf("[") + 1,selection.indexOf("]"));
        let settingName = settingvalue as keyof typeof RosterCheck;
        return RosterCheck[settingName];
    }
}