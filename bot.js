const { Client } = require('discord.js');
const RegexCommand = require('./regex-command.js');
const DiceCommand = require('./commands/dice.js');
const { NextGarbageCommand, NextRecyclingCommand } = require('./commands/garbage.js');
const WeNeedCommand = require('./commands/we-need');
const auth = require('./auth.json');
const basic_commands = require('./basic-commands.json');

// New instance
const client = new Client();
const commands = [];

// On login
client.on('ready', () => {
    // Add basic responses
    for (let key in basic_commands) {
        if (basic_commands.hasOwnProperty(key)) {
            let command = new RegexCommand(key);
            command.execute = function(_, channel) {
                channel.send(basic_commands[key]);
            };
            commands.push(command);
        }
    }

    // Add unique commands
    commands.push(new DiceCommand(),
        new NextGarbageCommand(),
        new NextRecyclingCommand(),
        new WeNeedCommand());

    // All ready
    console.log('Mannister bot reporting for duty');
});

// Handle messages
client.on('message', msg => {
    commands.forEach(command => {
        if (command.matches(msg.content)) {
            command.execute(msg.content, msg.channel);
        }
    })
});

// Login
client.login(auth.token).then(_ => null);

