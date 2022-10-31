import { PropertyKeys } from "./enums/PropertyKeys";
import { PropertyHelperService } from "./services/PropertyHelperService";

export function onOpen(): void {
  const spreadsheet = SpreadsheetApp.getActive();
  let menuItems = [];

  const isAuthorised = PropertyHelperService.getUserPropertyValue(
    PropertyKeys.isAuthorised
  )?.toBoolean();

  if (!isAuthorised) {
    menuItems = [
      {
        name: "Authorise Tiny Elf",
        functionName: "authoriseTinyElf"
      }
    ];
  } else {
    menuItems = [
      {
        name: "Skip currently rostered team member",
        functionName: "skipTeamMemberFromUi"
      },
      {
        name: "Notify team member",
        functionName: "notifyTeamMemberFromUi"
      },
      {
        name: "Set/reset automated trigger",
        functionName: "resetTriggerFromUi"
      }
    ];
  }
  spreadsheet.addMenu("Tiny Elf", menuItems);
}

global.onOpen = onOpen;
