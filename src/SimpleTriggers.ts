export function onOpen(): void {
  const spreadsheet = SpreadsheetApp.getActive();
  const menuItems = [
    {
      name: "Skip currently rostered team member",
      functionName: "skipTeamMemberFromUi",
    },
    {
      name: "Notify team member",
      functionName: "notifyTeamMemberFromUi",
    },
    {
      name: "Set/reset automated trigger",
      functionName: "resetTriggerFromUi",
    },
  ];
  spreadsheet.addMenu("Tiny Elf", menuItems);
}
