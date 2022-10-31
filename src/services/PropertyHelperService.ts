export class PropertyHelperService {
  static getScriptPropertyValue(propertyName: string) {
    return PropertyHelperService.getPropertyValue(
      PropertiesService.getScriptProperties(),
      propertyName
    );
  }

  static getDocumentPropertyValue(propertyName: string) {
    return PropertyHelperService.getPropertyValue(
      PropertiesService.getDocumentProperties(),
      propertyName
    );
  }

  static getUserPropertyValue(propertyName: string) {
    return PropertyHelperService.getPropertyValue(
      PropertiesService.getUserProperties(),
      propertyName
    );
  }

  private static getPropertyValue(
    properties: GoogleAppsScript.Properties.Properties,
    propertyName: string
  ) {
    const propertyValue = properties.getProperty(propertyName);
    return propertyValue;
  }

  static setScriptPropertyValue(propertyName: string, propertyValue: string) {
    PropertyHelperService.setPropertyValue(
      PropertiesService.getScriptProperties(),
      propertyName,
      propertyValue
    );
  }

  static setDocumentPropertyValue(propertyName: string, propertyValue: string) {
    PropertyHelperService.setPropertyValue(
      PropertiesService.getDocumentProperties(),
      propertyName,
      propertyValue
    );
  }

  static setUserPropertyValue(propertyName: string, propertyValue: string) {
    PropertyHelperService.setPropertyValue(
      PropertiesService.getUserProperties(),
      propertyName,
      propertyValue
    );
  }

  private static setPropertyValue(
    properties: GoogleAppsScript.Properties.Properties,
    propertyName: string,
    propertyValue: string
  ) {
    properties.setProperty(propertyName, propertyValue);
  }
}
