import { TeamMember } from "../models/TeamMember";

export class CalendarNotAccessibleError extends Error {

    code: number;
    teamMember: TeamMember;

    constructor(code: number, message: string, teamMember: TeamMember) {
        super(message);
        this.code = code;
        this.teamMember = teamMember;
    }
}