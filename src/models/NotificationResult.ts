export class NotificationResult {
  success: boolean;
  message: string;
  hint: string | undefined;

  constructor(success: boolean, message: string, hint?: string) {
    this.success = success;
    this.message = message;
    this.hint = hint;
  }

  getNotificationTitle() {
    return this.success ? "Success" : "Failure";
  }
}
