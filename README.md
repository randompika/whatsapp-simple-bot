# whatsapp-simple-bot
A whatsapp bot made on NodeJS with Venom-Bot module

## Bot Functions/Commands:
1. `<bot name> /help` to view all the commands
2. `<bot name> yt <query>` to share YouTube video links
3. `<bot name> math <query>` to do basic maths operations
4. ~~`<bot name> song <query>` to send songs from your api~~ (**This function is disabled by default, you need to add your own custom api**)

## Requirements:
1. Install NodeJS 10.x+
2. Google YouTube Data Search API Access Key, can be obtained from https://console.developers.google.com/apis/library/youtube.googleapis.com

## Instructions:
1. Open `bot.js` and change the following variables to make the bot work:
   ```
   botname
   botnumber
   ytapikey
   ```

## How to Use Bot?
1. Clone this repository locally
2. On the directory:
  `npm install` to install al required modules
3. Start Bot:
  `npm start`
4. Scan the QR Code that would appear on the screen and your bot will start.
