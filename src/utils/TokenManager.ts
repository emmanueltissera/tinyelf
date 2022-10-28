import { TokenManagerKeys } from "../enums/TokenManagerKeys";
import { TeamMember } from "../models/TeamMember";
import { TokenPair } from "../models/TokenPair";

export class TokenManager {
  static replaceTokens(message: string, teamMember?: TeamMember) {
    let tokenisedMessage = message;

    const tokens: TokenPair[] = [
      new TokenPair(TokenManagerKeys.AtHereKey, TokenManagerKeys.AtHereValue),
    ];

    if (teamMember) {
      tokens.push(
        new TokenPair(TokenManagerKeys.NameKey, teamMember.name),
        new TokenPair(TokenManagerKeys.AtSlackHandleKey, `<@${teamMember.slackMemberId}>`)
      );
    }

    tokens.forEach((x) => (tokenisedMessage = tokenisedMessage.replace(x.key, x.value)));

    return tokenisedMessage;
  }
}
