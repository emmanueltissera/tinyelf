export class SlackPayload {
  blocks: object[];
  text = "Tiny Elf notification!";

  constructor() {
    this.blocks = [];
  }

  addText(notificationSummary: string) {
    this.text = notificationSummary;
  }

  addBlock(block: object) {
    this.blocks.push(block);
  }

  toJsonString(): string {
    return JSON.stringify(this);
  }
}
