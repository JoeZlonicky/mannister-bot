// For executing a task when a command is given in the server
class Command {
    // Called when command is matched
    execute(cmd, channel) {
        console.log('Executing command');
    }

    // Test to see if a message matches the command
    matches(message) {
        return false;
    }
}

module.exports = Command;