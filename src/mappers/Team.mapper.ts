import { Team } from "../models/Team";
import "../utils/String.extensions";
import { TeamMemberMapper } from "./TeamMember.mapper";

export class TeamMapper {
  static map(rows: Array<Array<string>>): Team {
    let team = new Team();

    rows.map((row, index) => {
      let member = TeamMemberMapper.map(row, index);
      if (member != null) {
        team.members.push(member);
      }
    });

    return team;
  }
}
