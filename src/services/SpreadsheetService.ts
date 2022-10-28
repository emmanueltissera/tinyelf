import { Columns } from "../enums/Columns";
import { SettingsKeys } from "../enums/SettingsKeys";
import { CellNotFoundError } from "../errors/CellNotFoundError";
import { SheetNotFoundError } from "../errors/SheetNotFoundError";
import { TeamMapper } from "../mappers/Team.mapper";
import { CalendarEvent } from "../models/CalendarEvent";
import { Team } from "../models/Team";
import { TeamMember } from "../models/TeamMember";

export class SpreadsheetService {
  static getTeam(): Team {
    const teamSheet = SpreadsheetService.getSheetByName(SettingsKeys.TeamSheetName);

    const teamRange = teamSheet.getDataRange();
    const teamData = teamRange.getValues();

    const team = TeamMapper.map(teamData);

    return team;
  }

  static recordLastHostDate(teamMember: TeamMember, calendarEvent: CalendarEvent): boolean {
    const teamSheet = SpreadsheetService.getSheetByName(SettingsKeys.TeamSheetName);
    const lastHostDateCell = teamSheet.getRange(teamMember.rowNumber, Columns.LastHostDate + 1);
    lastHostDateCell.setValue(calendarEvent.startTime);
    return true;
  }

  static removeLastHostDate(teamMember: TeamMember): boolean {
    const teamSheet = SpreadsheetService.getSheetByName(SettingsKeys.TeamSheetName);
    const lastHostDateCell = teamSheet.getRange(teamMember.rowNumber, Columns.LastHostDate + 1);
    lastHostDateCell.setValue("");
    return true;
  }

  private static getSheetByName(sheetName: string) {
    const spreadsheet = SpreadsheetApp.getActive();
    const sheet = spreadsheet.getSheetByName(sheetName);

    if (sheet == null) {
      throw new SheetNotFoundError(404, `Specified sheet '${sheetName}' was not found`, sheetName);
    }

    return sheet;
  }

  static getCellValueByName(cellName: string) {
    const spreadsheet = SpreadsheetApp.getActive();
    const value = spreadsheet.getRangeByName(cellName)?.getValue();

    if (value === undefined || value === "") {
      throw new CellNotFoundError(404, `Specified cell '${cellName}' was not found`, cellName);
    }

    return value;
  }

  static showModalWindow(title: string, message: string) {
    const ui = SpreadsheetApp.getUi();
    ui.alert(title, message, ui.ButtonSet.OK);
  }
}
