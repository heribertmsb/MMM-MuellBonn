/* MagicMirror²
 * Module: MMM-MuellBonn
 *
 * By Steven Heribert , heribert@makerspacebonn.de
 * MIT Licensed.
 */
Module.register("MMM-MuellBonn", {
  // Module config defaults.
  defaults: {
    //update every 3 minutes
    updateInterval: 180000,
    //fade speed
    fadeSpeed: 4000,
    //initial load delay
    initialLoadDelay: 0,
    //retry delay
    retryDelay: 2500,
    
  },

  
  getStyles: function () {
    return [
      "style.css" // will try to load it from the vendor folder, otherwise it will load is from the module folder.
    ];
  },

  // Define start sequence.
  start: function () {
    Log.info("Starting module: " + this.name);

    // Schedule update timer.
    setInterval(() => {
      this.updateDom(this.config.fadeSpeed);
    }, this.config.updateInterval);
  },

// Import necessary modules
const fs = require('fs');
const moment = require('moment');

// Load the CSV file
const csvFilePath = 'trash_collection_schedule.csv'; // Path to your CSV file
const csvData = fs.readFileSync(csvFilePath, 'utf8');

// Parse CSV data
const rows = csvData.trim().split('\n').map(row => row.split(','));

// Extract dates and garbage can types
const trashSchedule = rows.map(row => ({
    date: moment(row[0], 'DD.MM.YYYY'),
    type: row[1]
}));

// Find the next collection date
const today = moment();
const nextCollection = trashSchedule.find(trash => trash.date.isAfter(today));

// Define widget content
let widgetContent = '';
if (nextCollection) {
    // Calculate days until next collection
    const daysUntilNextCollection = nextCollection.date.diff(today, 'days');

    // Determine color based on days until next collection
    let textColor = 'black';
    if (daysUntilNextCollection === 1) {
        textColor = 'red'; // One day before collection
    }

    // Group trash collections by date
    const collectionsForNextDate = trashSchedule.filter(trash => trash.date.isSame(nextCollection.date));

    // Sort collections by type, considering the order GR, BL, YE
    collectionsForNextDate.sort((a, b) => {
        const order = { GR: 1, BL: 2, YE: 3 };
        return order[a.type] - order[b.type];
    });

    // Generate icons for each type of garbage collected
    const icons = collectionsForNextDate.map(trash => {
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
        return `<img src="icons/${iconColor}_trash_icon.png" alt="${trash.type} Trash Icon" />`;
    });

    // Format the date and display garbage can icons
    const formattedDate = nextCollection.date.format('DD.MM.YYYY');
    widgetContent = `<div style="color: ${textColor};">Next collection: ${formattedDate}</div>`;
    widgetContent += icons.join('');
} else {
    widgetContent = '<div>No upcoming trash collection dates found</div>';
}

// Output widget content
console.log(widgetContent);






});
