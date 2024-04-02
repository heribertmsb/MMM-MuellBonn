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
        fs.readFile(csvFilePath, 'utf8', function(err, data) {
            if (err) {
                console.error('Error loading CSV file:', err);
                self.sendSocketNotification('TRASH_SCHEDULE_ERROR', { error: err });
                return;
            }

            const rows = data.trim().split('\n').map(row => row.split(';'));
            const trashSchedule = rows.map(row => ({
                date: row[0].trim(),
                type: row[1].trim()
            }));

            // Send the loaded trash schedule to the client-side JavaScript
            self.sendSocketNotification('TRASH_SCHEDULE_LOADED', { trashSchedule });
        });
    }
});
