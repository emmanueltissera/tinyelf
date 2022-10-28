interface Date {
  sortByLastHosted(secondDate: Date): number;
  formatToDayMonthYear(): string;
  formatToDayName(): string;
  formatTimeHHmm(): string;
  formatDateTime(): string;
}
