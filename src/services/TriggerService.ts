export class TriggerService {
  static deleteIfTriggerExists(handlerFunction: string) {
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(function (trigger) {
      if (trigger.getHandlerFunction() === handlerFunction) {
        ScriptApp.deleteTrigger(trigger);
        return;
      }
    });
  }

  static createDailyTrigger(hour: number, minute: number, handlerFunction: string) {
    ScriptApp.newTrigger(handlerFunction)
      .timeBased()
      .everyDays(1)
      .atHour(hour)
      .nearMinute(minute)
      .create();
  }
}
