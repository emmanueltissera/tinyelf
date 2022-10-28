Date.prototype.sortByLastHosted = function (secondDate: Date) {
  let firstDate = this;
  if (firstDate < secondDate) {
    return -1;
  }
  if (firstDate > secondDate) {
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
  let day = this.getDate().toString().padStart(2, "0");
  let month = shortMonths[this.getMonth()];
  let year = this.getFullYear();

  return `${day}-${month}-${year}`;
};

Date.prototype.formatTimeHHmm = function () {
  let hours = this.getHours().toString().padStart(2, "0");
  let minutes = this.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

Date.prototype.formatDateTime = function () {
  return this.formatToDayMonthYear() + " " + this.formatTimeHHmm();
};

Date.prototype.formatToDayName = function () {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let dayName = dayNames[this.getDay()];

  return dayName;
};
