const Command = require('./command');

// Uses a Regex pattern to match
class RegexCommand extends Command {
    constructor(pattern) {
        super();
        this.pattern = RegExp(pattern, 'i');  // Create case-insensitive Regex pattern
    }

    // Matches command if Regex pattern matches
    matches(message) {
        return this.pattern.test(message);
    }
}

module.exports = RegexCommand;