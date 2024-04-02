/* MagicMirror²
 * Module: MMM-MuellBonn
 *
 * By Steven Heribert , heribert@makerspacebonn.de
 * MIT Licensed.
 */
Module.register("trash_schedule", {
  // Define module defaults
  defaults: {
      daysFromToday: 4,
      csvFilePath: 'trash_collection_schedule.csv', // Path to your CSV file
      iconPath: 'icons/',
      updateInterval: 60 * 60 * 1000, // Update interval in milliseconds (1 hour in this example)
  },

  // Start the module
  start: function() {
      // Load the trash schedule
      this.loadTrashSchedule();

      // Schedule updates
      setInterval(() => {
          this.loadTrashSchedule();
      }, this.config.updateInterval);
  },

  // Load the trash schedule
  loadTrashSchedule: function() {
      const self = this;
      const csvData = fs.readFileSync(this.config.csvFilePath, 'utf8');
      const rows = csvData.trim().split('\n').map(row => row.split(','));
      const trashSchedule = rows.map(row => ({
          date: moment(row[0], 'DD.MM.YYYY'),
          type: row[1]
      }));

      // Find trash collections for the specific date and days from today
      const today = moment();
      const specificDate = today.format('YYYY-MM-DD');
      const collections = this.findTrashCollections(specificDate, this.config.daysFromToday, trashSchedule);

      // Generate icons for each trash collection
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

          // Format the date and display garbage can icons
          const formattedDate = moment(specificDate).add(this.config.daysFromToday, 'days').format('DD.MM.YYYY');
          widgetContent = `<div>Trash collections for ${formattedDate} (${this.config.daysFromToday} days from today):</div>${icons.join('')}`;
      } else {
          widgetContent = '<div>No upcoming trash collections found within the specified period.</div>';
      }

      // Update the module content
      self.updateDom(1000, widgetContent);
  },

  // Find trash collections a certain number of days from a specific date
  findTrashCollections: function(date, daysFromToday, trashSchedule) {
      const targetDate = moment(date).add(daysFromToday, 'days');
      return trashSchedule.filter(trash => trash.date.isSame(targetDate, 'day'));
  }
});
