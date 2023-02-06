interface Date {
  sortByLastHosted(secondDate: Date): number;
  formatToDayMonthYear(): string;
  formatToDayName(): string;
  formatToShortDayName(): string;
  formatTimeHHmm(): string;
  formatDateTime(): string;
}
