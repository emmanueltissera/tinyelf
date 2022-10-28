import { SlackPayload } from "../models/SlackPayload";
import { HttpMethod } from "../types/HttpMethod";

export class SlackService {
    
    static sendAlert(payload: SlackPayload, webhookUrl: string) {

        let options = {
            method: "post" as HttpMethod,
            contentType: "application/json",
            muteHttpExceptions: false,
            payload: payload.toJsonString()
        };
    
        try {
            UrlFetchApp.fetch(webhookUrl, options);
        } catch (e) {
            Logger.log(e);
        }
    }
}