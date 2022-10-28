import { Columns } from "../enums/Columns";
import { TeamMember } from "../models/TeamMember";
import { DateUtils } from "../utils/DateUtils";
import "../utils/String.extensions";

export class TeamMemberMapper {

    static map(rowValues: string[], index: number): TeamMember | null {

        if(index == 0 || rowValues.filter(x => x === "").length > 1)
        {
            return null;
        }

        let member = new TeamMember();
        member.name = rowValues[Columns.Name];
        member.emailAddress = rowValues[Columns.EmailAddress];
        member.slackMemberId = rowValues[Columns.SlackMemberId];
        member.enabled = rowValues[Columns.Enabled].toBoolean();
        member.lastHostDate = rowValues[Columns.LastHostDate].toString().toDate()!;
        member.rosterForDays = DateUtils.toShortDaysOfWeekArray(rowValues[Columns.RosterForDays]);
        member.rowNumber = index + 1;

        return member;
    }
}