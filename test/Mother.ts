import { TeamMemberMapper } from "../src/mappers/TeamMember.mapper";
import { CalendarEvent } from "../src/models/CalendarEvent";
import { EventTime } from "../src/models/EventTime";

export class Mother {

    static data : string[][] = [
        ["Name", "Email Address", "Slack Member ID", "Enabled", "Roster for days", "Last Host Date"],
        ["Wilson", "wilson+fake@binkmail.com", "U4518JHUG", "Yes", "Mon, Tue", "Tue, 4 Oct 22"],
        ["Sonny", "sonny+fake@binkmail.com", "U90L2S11A", "Yes", "All", "Wed, 28 Sep 22"],
        ["Trike", "trike+fake@binkmail.com", "U10LDS22B", "Yes", "Fri, Mon", ""],
        ["Audrey", "audrey+fake@binkmail.com", "U036327BULL", "No", "None", "Fri, 7 Oct 22"],
        ["", "", "", "", "", ""]];

    static memberMiaData: string[] = ["Mia", "mia+fake@binkmail.com", "U8233HAJ2", "Yes", "Sat, Sun", "Mon, 3 Oct 22"];

    static memberLucyData: string[] = ["Lucy", "lucy+fake@binkmail.com", "U0763278U6T", "No", "Mon", ""];

    static memberTrikeObject = TeamMemberMapper.map(Mother.data[3], 1);

    static memberSonnyObject = TeamMemberMapper.map(Mother.data[2], 1);

    static calendarEventDate24Oct = new Date("24-Oct-2022");

    static calendarDummyEvent24Oct = new CalendarEvent("Dummy event", Mother.calendarEventDate24Oct, new EventTime(13,0), new EventTime(13, 15), 0);

}