/* MagicMirror²
 * Module: MMM-MuellBonn
 *
 * By Steven Heribert , heribert@makerspacebonn.de
 * MIT Licensed.
 */
Module.register("MMM-MuellBonn", {
  // Default module config
  defaults: {
      daysFromToday: 4,
      csvFilePath: 'modules/MMM-MuellBonn/trash_collection_schedule.csv', // Default CSV file path
      iconPath: 'modules/MMM-MuellBonn/icons/',
      updateInterval: 60 * 60 * 1000, // Update interval in milliseconds (1 hour in this example)
  },

  // Override socket notification handler
  socketNotificationReceived: function(notification, payload) {
      if (notification === 'TRASH_SCHEDULE_LOADED') {
          this.processTrashSchedule(payload.trashSchedule);
      } else if (notification === 'TRASH_SCHEDULE_ERROR') {
          console.error('Error loading trash schedule:', payload.error);
      }
  },

  // Override start method
  start: function() {
      console.log("MMM-MuellBonn module started!");

      // Request trash schedule from node helper
      this.sendSocketNotification('GET_TRASH_SCHEDULE', { csvFilePath: this.config.csvFilePath });

      // Schedule updates
      setInterval(() => {
          this.sendSocketNotification('GET_TRASH_SCHEDULE', { csvFilePath: this.config.csvFilePath });
      }, this.config.updateInterval);
  },

  // Process loaded trash schedule
  processTrashSchedule: function(trashSchedule) {
      // Your logic to process the loaded trash schedule and update the module content
      console.log("Trash schedule loaded:", trashSchedule);
  },

  // Override dom generator
  getDom: function() {
      // Generate and return module content
      return document.createElement("div");
  }
});
