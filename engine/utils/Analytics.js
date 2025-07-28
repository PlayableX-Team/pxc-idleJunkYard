import globals from "../../globals";

export default class Analytics {
  static init() {
    const event_keys = [
      "endcard_shown",
      "cta_clicked",
      "first_click",
      "impressions",

      //custom events to be added here
      "logs_collected",
      "logs_sold",
      "trees_cut",
      "speed_upgrade",
      "power_upgrade",
    ];

    if (typeof __EXPORTED__ !== "undefined" && __EXPORTED__) {
      console.log("Analytics initialized");
      
      event_keys.forEach((key) => {
        globals.EventEmitter.on(key, (data) => {
          console.log(`Event: ${key}`, data, "Analytics.js");
          console.log("Analytics", window.Analytics);
          window.Analytics?.send(key, data);
        });
      });
    } else {
      console.log("Analytics not initialized");
    }
  }
}
