Date.prototype.sortByLastHosted = function (secondDate: Date) {
  if (this < secondDate) {
    return -1;
  }
  if (this > secondDate) {
    return 1;
  }
  return 0;
};

Date.prototype.formatToDayMonthYear = function () {
  const shortMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = this.getDate().toString().padStart(2, "0");
  const month = shortMonths[this.getMonth()];
  const year = this.getFullYear();

  return `${day}-${month}-${year}`;
};

Date.prototype.formatTimeHHmm = function () {
  const hours = this.getHours().toString().padStart(2, "0");
  const minutes = this.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

Date.prototype.formatDateTime = function () {
  return this.formatToDayMonthYear() + " " + this.formatTimeHHmm();
};

Date.prototype.formatToDayName = function () {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = dayNames[this.getDay()];

  return dayName;
};
