# Mannister Bot
A Discord bot for miscellaneous tasks using Node.js, discord.js, and regex. Current features include
  * Basic commands
  * Rolling of dice
  * Determining next garbage and recycling days
  * Keeping track of requests by storing them in a MySQL database  

## Setup
Requires a file named auth.json which contains a single key called 'token' with the corresponding authorization token. 
Also requires Node.js and the discord.js module. The MySQL components won't work unless you have the database set up properly.
