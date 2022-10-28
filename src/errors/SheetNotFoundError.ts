export class SheetNotFoundError extends Error {
  code: number;
  sheetName: string;

  constructor(code: number, message: string, sheetName: string) {
    super(message);
    this.code = code;
    this.sheetName = sheetName;
  }
}
