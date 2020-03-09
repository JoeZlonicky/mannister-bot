fs = require('fs');
df = require('../date_formatting');
RegexCommand = require("../regex-command.js");

// Determines the next date in a given ics file
class NextDate extends RegexCommand {
    constructor(pattern, file_name, event_hour) {
        super(pattern);
        this.file_name = file_name;
        this.event_hour = event_hour;
        this.date_pattern = /(?<=DTSTART;VALUE=DATE:)(\d*)/;
    }

    // Send next date in channel
    execute(cmd, channel) {
        let this_instance = this;
        fs.readFile(this.file_name, 'utf8', function(err, contents) {
            let date = this_instance.get_next_date(contents);
            if (date == null) {
                channel.send("Sorry, I was unable to compute the next date");
            } else {
                channel.send(`The next date is ${df.format(date)}`);
            }
        });
    }

    // Find the next date in the file, returns null if unable to
    get_next_date(contents) {
        while (true) {
            let found = this.date_pattern.exec(contents);
            if (found == null) {
                return null;
            }
            let date = this.create_date(found[0]);

            if (date < Date.now()) {
                contents = contents.substring(found.index);
            } else {
                return date;
            }
        }
    }

    // Create a Date instance from the format of an ics date
    create_date(date_string) {
        let year = parseInt(date_string.substring(0, 4));
        let month = parseInt(date_string.substring(4, 6)) - 1;
        let day = parseInt(date_string.substring(6, 8));
        return new Date(year, month, day, this.event_hour);
    }
}

// Sends next garbage date
class NextGarbageCommand extends NextDate {
    constructor() {
        super("^!garbage$", "res/garbage.en.ics", 7);
    }
}

// Sends next recycling date
class NextRecyclingCommand extends NextDate {
    constructor() {
        super("^!recycling$", "res/recycling.en.ics", 10);
    }
}

module.exports = { NextGarbageCommand, NextRecyclingCommand };