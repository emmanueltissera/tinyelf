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
    return SpreadsheetService.updateLastHostDate(teamMember, calendarEvent.startTime);
  }

  static removeLastHostDate(teamMember: TeamMember): boolean {
    return SpreadsheetService.updateLastHostDate(teamMember, null);
  }

  private static updateLastHostDate(teamMember: TeamMember, cellValue: Date | null): boolean {
    const teamSheet = SpreadsheetService.getSheetByName(SettingsKeys.TeamSheetName);
    const filterSettings = teamSheet.getFilter();

    const filterCriteria = [];
    if (filterSettings) {
      for (let col = 1; col <= teamSheet.getMaxColumns(); col++) {
        const criteria = filterSettings.getColumnFilterCriteria(col);
        filterCriteria.push(criteria);
      }

      filterSettings.remove();
    }

    const lastHostDateCell = teamSheet.getRange(teamMember.rowNumber, Columns.LastHostDate + 1);
    lastHostDateCell.setValue(cellValue);

    if (filterCriteria.length > 0) {
      teamSheet.getRange(1, 1, teamSheet.getMaxRows(), teamSheet.getMaxColumns()).createFilter();
      const newFilterSettings = teamSheet.getFilter();

      if (newFilterSettings) {
        for (let col = 1; col <= teamSheet.getMaxColumns(); col++) {
          const criteria = filterCriteria[col - 1];
          newFilterSettings.setColumnFilterCriteria(col, criteria);
        }
      }
    }

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

  static showModalWindow(title: string, message: string, hint?: string) {
    const ui = SpreadsheetApp.getUi();

    if (hint) {
      message = message + "\n" + hint;
    }

    ui.alert(title, message, ui.ButtonSet.OK);
  }
}
