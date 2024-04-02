/* MagicMirror²
 * Module: MMM-MuellBonn
 *
 * By Steven Heribert , heribert@makerspacebonn.de
 * MIT Licensed.
 */
Module.register("MMM-MuellBonn", {
  // Define module defaults
  defaults: {
      daysFromToday: 4,
      csvFilePath: 'modules/MMM-MuellBonn/trash_collection_schedule.csv', // Path to your CSV file
      iconPath: 'modules/MMM-MuellBonn/icons/',
      updateInterval: 60 * 60 * 1000, // Update interval in milliseconds (1 hour in this example)
  },

  // Start the module
  start: function() {
    console.log("MMM-MuellBonn module started!");  
    
    this.loadTrashSchedule(); // Load trash schedule initially

      // Schedule updates
      setInterval(() => {
          this.loadTrashSchedule();
      }, this.config.updateInterval);
  },

  // Load the trash schedule
  loadTrashSchedule: function() {
      const self = this;
      const fs = require('fs');
      const moment = require('moment');

      fs.readFile(this.config.csvFilePath, 'utf8', function(err, data) {
          if (err) {
              self.updateDom(1000, '<div>Error loading CSV file</div>');
              return;
          }
          console.log("MMM-MuellBonn module csv gelesen!");      
          
          const rows = data.trim().split('\n').map(row => row.split(','));
          const trashSchedule = rows.map(row => ({
              date: moment(row[0], 'DD.MM.YYYY'),
              type: row[1]
          }));

          const today = moment();
          const specificDate = today.format('YYYY-MM-DD');
          const collections = self.findTrashCollections(specificDate, self.config.daysFromToday, trashSchedule);

          let widgetContent = '';
          if (collections.length > 0) {
              const icons = collections.map(trash => {
                  let iconColor = '';
                  switch (trash.type) {
                      case 'GR':
                          iconColor = 'grey';
                          break;
                      case 'BL':
                          iconColor = 'blue';
                          break;
                      case 'YE':
                          iconColor = 'yellow';
                          break;
                      default:
                          iconColor = 'black';
                          break;
                  }
                  return `<img src="${self.config.iconPath}${iconColor}_trash_icon.png" alt="${trash.type} Trash Icon" />`;
              });

              const formattedDate = moment(specificDate).add(self.config.daysFromToday, 'days').format('DD.MM.YYYY');
              widgetContent = `<div>Trash collections for ${formattedDate} (${self.config.daysFromToday} days from today):</div>${icons.join('')}`;
          } else {
              widgetContent = '<div>No upcoming trash collections found within the specified period.</div>';
          }

          self.updateDom(1000, widgetContent);
      });
  },

  // Find trash collections a certain number of days from a specific date
  findTrashCollections: function(date, daysFromToday, trashSchedule) {
      const moment = require('moment');
      const targetDate = moment(date).add(daysFromToday, 'days');
      return trashSchedule.filter(trash => trash.date.isSame(targetDate, 'day'));
  }
});
