// 12-May-2025
// This file is used to declare custom types for Google Apps Script since the default
// types do not include all the properties and methods we need.
// This is a workaround until the official types are updated in `@types/google-apps-script` package.
declare namespace GoogleAppsScript.Calendar {
    interface CalendarEvent {
        getEventType(): string;
    }

    interface CalendarApp {
        EventType: {
            [WORKING_LOCATION: string]: "WORKING_LOCATION";
        };
    }
}