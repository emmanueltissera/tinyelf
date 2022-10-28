import { SlackPayload } from "../models/SlackPayload";

export class SlackMessageBuilder {

    static buildAlert(alertText: string, messageBody: string, messageFooter?: string) : SlackPayload {

        let payload = new SlackPayload();
        payload.addText(alertText);

        let messageBodyBlock = {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": messageBody
                }
            };
        payload.addBlock(messageBodyBlock);
    
        if (messageFooter != undefined) {
    
          let divider = {
            "type": "divider"
          };

          payload.addBlock(divider);
    
          let footNoteBlock = {
            "type": "context",
            "elements": [{
            "type": "mrkdwn",
            "text": messageFooter
            }]
          };
    
          payload.addBlock(footNoteBlock);
        }

        return payload;
    }

}