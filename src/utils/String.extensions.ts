import { SettingsKeys } from "../enums/SettingsKeys";

String.prototype.toBoolean = function () {
    return this.toLowerCase() === "yes";
};

String.prototype.toDate = function () {
    return this != "" ? new Date(Date.parse(this.toString())) : new Date(SettingsKeys.MinimumHostDate);
};

String.prototype.convertToProperCase = function () {
    return this.split(' ')
        .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
        .join(' ');
}