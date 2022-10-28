export class CellNotFoundError extends Error {

    code: number;
    cellName: string;

    constructor(code: number, message: string, cellName: string) {
        super(message);
        this.code = code;
        this.cellName = cellName;
    }
}