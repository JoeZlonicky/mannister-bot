const mariadb = require('mariadb');
const Command = require('../command');

// Store and remove requests in a MySQL/MariaDB database
class WeNeed extends Command {
    constructor() {
        super();
        this.pool = mariadb.createPool({
            host: 'localhost',
            user: 'mannister',
            password: '1248',
            database: 'we_need',
            connectionLimit: 5,
            initializationTimeout: 5000
        });
        this.pool.getConnection().catch(_ => {
            console.log("Unable to connect to the database");
            this.pool.end().then();
        });
    }

    // Make a query on the database
    async makeQuery(query) {
        let conn;
        try {
            conn = await this.pool.getConnection();
            return await conn.query(query);
        } catch (err) {
            throw err;
        } finally {
            if (conn) {
                conn.release();
            }
        }
    }

    // See if command matches any of the 3
    matches(message) {
        let split = message.split(" ");
        return split[0] === '!weneed' || split[0] === "!wedontneed" || split[0] === "!weneednothing";
    }

    // Execute appropriate command
    execute(cmd, channel) {
        let split = cmd.split(" ");
        if (split[0] === "!weneed") {
            this.executeWeNeed(split.splice(1), channel);
        } else if (split[0] === "!wedontneed") {
            this.executeWeDontNeed(split.splice(1), channel);
        } else if (split[0] === "!weneednothing") {
            this.executeWeNeedNothing(channel);
        }
    }

    // List items or add item(s)
    executeWeNeed(args, channel) {
        if (args.length === 0) {
            this.listItems(channel);
        } else if (args.length === 1) {
            channel.send("Okay I will add that to the list");
            this.addItems(args, channel);
        } else {
            channel.send("Okay I will add those to the list");
            this.addItems(args, channel);
        }
    }

    // Remove items
    executeWeDontNeed(args, channel) {
        if (args.length === 0) {
            channel.send("Hmmm, that is a rather large list");
        } else if (args.length === 1) {
            channel.send("Okay I will remove that from the list");
            this.removeItems(args, channel);
        } else if (args.length >= 1) {
            channel.send("Okay I will remove those from the list");
            this.removeItems(args, channel);
        }
    }

    // Remove everything
    executeWeNeedNothing(channel) {
        channel.send("Removing everything from the list");
        this.removeEverything(channel);
    }

    // List all requests
    listItems(channel) {
        this.makeQuery("SELECT item_name FROM requests").then(result => {
            if (result.length === 0) {
                channel.send("You don't seem to need anything at the moment");
                return;
            }
            let str = 'Here is what we need: \n';
            result.forEach(entry => {
                str += entry["item_name"] + '\n';
            });
            channel.send(str);
        }).catch(error => {
            console.log(`Error while attempting to list the table: ${error}`);
            channel.send("Sorry, I was unable to retrieve requests from the table");
        });
    }

    // Make a delete query
    removeItems(args, channel) {
        args = this.concat_values(args, false);
        this.makeQuery(`DELETE FROM requests WHERE item_name IN (${args})`).catch(error => {
            console.log(`Error while attempting to remove an item from the table: ${error}`);
            channel.send("Sorry, I was unable to delete that from the table");
        });
    }

    // Make an insert query
    addItems(args, channel) {
        args = this.concat_values(args, true);
        this.makeQuery(`INSERT INTO requests (item_name) VALUES ${args}`).catch(error => {
            console.log(`Error while attempting to add to the table: ${error}`);
            channel.send("Sorry, I was unable to add that to the table");
        });
    }

    // Make a catch-all delete query
    removeEverything(channel) {
        this.makeQuery("DELETE FROM requests").catch(error => {
            console.log(`Error while attempting to clear the table: ${error}`);
            channel.send("Sorry, I was unable to clear the table");
        });
    }

    // Combine arguments so they can be sent in a query, if separate is true then make single-element lists
    concat_values(arr, separate) {
        let str = '';
        for (let i = 0; i < arr.length; ++i) {
            if (separate) {
                str += `('${arr[i]}')`;
            } else {
                str += `'${arr[i]}'`;
            }
            if ( i < arr.length - 1) {
                str += ', ';
            }
        }
        return str;
    }
}

module.exports = WeNeed;


