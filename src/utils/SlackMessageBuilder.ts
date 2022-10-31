import { SlackPayload } from "../models/SlackPayload";

export class SlackMessageBuilder {
  static buildAlert(alertText: string, messageBody: string, messageFooter?: string): SlackPayload {
    const payload = new SlackPayload();
    payload.addText(alertText);

    const messageBodyBlock = {
      type: "section",
      text: {
        type: "mrkdwn",
        text: messageBody
      }
    };
    payload.addBlock(messageBodyBlock);

    if (messageFooter != undefined) {
      const divider = {
        type: "divider"
      };

      payload.addBlock(divider);

      const footNoteBlock = {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: messageFooter
          }
        ]
      };

      payload.addBlock(footNoteBlock);
    }

    return payload;
  }
}
