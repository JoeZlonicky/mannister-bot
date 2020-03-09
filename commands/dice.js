const RegexCommand = require('../regex-command.js');

class DiceCommand extends RegexCommand {

    constructor() {
        super('^!(\\d*)d(\\d+)$');  // Looks for mdn or dn where n, m are integers
    }

    // Send randomly generated numbers to channel
    execute(cmd, channel) {
        let input = this.parse_input(cmd);
        let n = input[0];
        let die = input[1];
        if (die === 0) {
            channel.send('Wat');
            return;
        } else if (n === 0) {
            channel.send('Wat');
            return;
        }
        let output = "";
        for (let i = 0; i < n; ++i) {
            let result = Math.floor(Math.random() * (die) + 1);
            output += result.toString() + " ";
        }
        channel.send(output).then(null, () => channel.send("Sorry, I was unable to compute that"));
    }

    // Determine sides of dice and how many to roll
    parse_input(cmd) {
        let d_pos = cmd.indexOf('d');
        let n = 0;
        if (d_pos > 0) {
            n = parseInt(cmd.slice(1, d_pos));
        } else {
            n = 1;
        }
        let die = parseInt(cmd.slice(d_pos+1));
        return [n, die]
    }
}

module.exports = DiceCommand;