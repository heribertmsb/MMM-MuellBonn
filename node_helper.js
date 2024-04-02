const NodeHelper = require('node_helper');
const fs = require('fs');

module.exports = NodeHelper.create({
    start: function() {
        console.log('MMM-MuellBonn node_helper started');
    },

    // Handle socket notifications
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_TRASH_SCHEDULE') {
            this.loadTrashSchedule(payload.csvFilePath);
        }
    },

   // Load the trash schedule from CSV file
loadTrashSchedule: function(csvFilePath) {
    const self = this;
    const fs = require('fs');
    const moment = require('moment');
    console.log('CSV import start');
    fs.readFile(csvFilePath, 'utf8', function(err, data) {
        if (err) {
            self.sendSocketNotification('TRASH_SCHEDULE_ERROR', { error: err });
            return;
        }

        // Split data into rows and parse each row
        const rows = data.trim().split('\n');
        const trashSchedule = rows.map(row => {
            const [date, type] = row.trim().split(';'); // Use semicolon as delimiter
            return { date, type };
        });

        // Send the loaded trash schedule to the client-side JavaScript
        self.sendSocketNotification('TRASH_SCHEDULE_LOADED', { trashSchedule });
    });
}

});
