import { SettingsKeys } from "../enums/SettingsKeys";

String.prototype.toBoolean = function () {
  const trueValues = ["true", "yes", "1"];
  return trueValues.filter((x) => x === this.toLowerCase().trim()).length > 0;
};

String.prototype.toDate = function () {
  return this != ""
    ? new Date(Date.parse(this.toString()))
    : new Date(SettingsKeys.MinimumHostDate);
};

String.prototype.convertToProperCase = function () {
  return this.split(" ")
    .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
    .join(" ");
};
