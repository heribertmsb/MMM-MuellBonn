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
      // Filter trash collections based on the number of days from today
      const today = moment();
      const upcomingCollections = trashSchedule.filter(entry => {
          const collectionDate = moment(entry.date, 'DD.MM.YYYY');
          const daysUntilCollection = collectionDate.diff(today, 'days');
          return daysUntilCollection <= this.config.daysFromToday;
      });

      // Generate HTML for displaying upcoming collections
      const container = document.createElement('div');
      upcomingCollections.forEach(entry => {
          const collectionDate = moment(entry.date, 'DD.MM.YYYY');
          const daysUntilCollection = collectionDate.diff(today, 'days');
          const icon = this.getTrashIcon(entry.type);
          const collectionText = `${collectionDate.format('DD.MM.YYYY')} (${daysUntilCollection} days)`;
          const entryElement = document.createElement('div');
          entryElement.innerHTML = `${icon} ${collectionText}`;
          container.appendChild(entryElement);
      });

      // Update module's DOM with the generated HTML
      this.updateDom(1000, container);
  },

  // Get trash icon HTML
  getTrashIcon: function(trashType) {
      // Define mapping between trash types and corresponding icons
      const iconMap = {
          'GR': 'grey_trash_icon.png',
          'BL': 'blue_trash_icon.png',
          'YE': 'yellow_trash_icon.png'
      };
      // Return HTML for displaying the icon
      return `<img src="${this.config.iconPath}${iconMap[trashType]}" />`;
  },

  // Override dom generator
  getDom: function() {
      // Create and return an empty container element
      return document.createElement('div');
  }
});
