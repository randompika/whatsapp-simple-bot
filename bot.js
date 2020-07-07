const venom = require('venom-bot');
var mexp = require('math-expression-evaluator');
var fs = require('fs')
var https = require('https')

//////////////////////////////////////
///////// Update Values: ////////
var botname = "Pika"; //your bot name here, e.g, if you bot name is "Pika", then the bot will monitor all chats with Pika keyword
var botnumber = "91xxxxxxxxx"; //bot mobile number
var ytapikey = "xxxxxxxxxxxxxxxxxxxxxxxx"; //your Google Developer API key, with YouTube Data search enabled
////////////////End///////////////////

//custom block sticker feature, works for only one
var bannedsticker = "91xxxxxxxxx";  //enter mobile number of person/group creator in which you don't want sticker to be sent

//Turn function off and on

var songactive = false; //you need to configure your own song database api
var mathactive = true;
var stickeractive = true;


function searchyt(keyword, cb) {
    var options = {
        "method": "GET",
        "hostname": "content.googleapis.com",
        "port": null,
        "path": "/youtube/v3/search?maxResults=1&q=" + encodeURIComponent(keyword) + "&part=snippet&key=" + ytapikey,
        "headers": {
            "content-length": "0",
            "accept": "application/json"
        }
    };

    var req = https.request(options, function(res) {
        var chunks = [];

        res.on("data", function(chunk) {
            chunks.push(chunk);
        });

        res.on("end", function() {
            var body = Buffer.concat(chunks);

            body = body.toString();
            if (res.statusCode == 200) {

                body = JSON.parse(body)

                if (body.items && body.items.length > 0) {
                    console.log("YT Found " + body.items[0].snippet.title)
                    cb(body.items[0])
                } else {
                    cb("Error")
                }
            } else {
                cb("Error")
            }
        });
    });

    req.end();
}


function songlink(songid, cb) {

    var options = {
        "method": "POST",
        "hostname": "www.you_song_api.com",
        "port": null,
        "path": "/",
        "headers": {
            "content-length": "0"
        }
    };

    var req = https.request(options, function(res) {
        var chunks = [];

        res.on("data", function(chunk) {
            chunks.push(chunk);
        });

        res.on("end", function() {
            var body = Buffer.concat(chunks);

            body = body.toString();
            if (res.statusCode == 200) {

                body = JSON.parse(body)
                if (body.link) {
                    console.log("Song Link Found")
                    cb(body)
                } else {
                    cb("Error")
                }
            } else {
                cb("Error")
            }
        });
    });

    req.end();
}



venom.create().then((client) => start(client));

async function start(client) {


    try {
        client.onMessage(async message => {

            if (message.from) {
                if (message.content.indexOf(botname) > -1 || message.content.indexOf("@" + botnumber) > -1) {

                    console.log("Received Request From " + message.sender.formattedName)

                    if (message.content.indexOf("math") > -1 || message.content.indexOf("maths") > -1) {
                        if (mathactive) {
                            msg = message.content.replace("math", "").replace("maths", "").replace(botname, "").replace("@" + botnumber, "");
                            console.log("Doing Maths: ")
                            msg = msg.replace(/[':"&$#@\\]/g,'').trim();
                            console.log(msg)
                            try {
                                client.reply(message.from, 'Hi ' + message.sender.pushname + ', your answer is: ' + mexp.eval(msg), message.id.toString());
                            } catch (e) {
                                client.reply(message.from, 'Hi ' + message.sender.pushname + ', your question is problematic. Please don\'t include special characters in command. \n *These operations are accepted:* +	Addition Operator eg. 2+3 results 5" \n \n-	Subtraction Operator eg. 2-3 results -1 \n \n /	Division operator eg 3/2 results 1.5 \n \n *	Multiplication Operator eg. 2*3 results 6 \n \n Mod	Modulus Operator eg. 3 Mod 2 results 1 \n \n (	Opening Parenthesis \n \n )	Closing Parenthesis \n \n Sigma	Summation eg. Sigma(1,100,n) results 5050 \n \n Pi	Product eg. Pi(1,10,n) results 3628800 \n \n n	Variable for Summation or Product \n \n pi	Math constant pi returns 3.14 \n \n e	Math constant e returns 2.71 \n \n C	Combination operator eg. 4C2 returns 6 \n \n P	Permutation operator eg. 4P2 returns 12 \n \n !	factorial operator eg. 4! returns 24 \n \n log	logarithmic function with base 10 eg. log 1000 returns 3 \n \n ln	natural log function with base e eg. ln 2 returns .3010 \n \n pow	power function with two operator pow(2,3) returns 8 \n \n ^	power operator eg. 2^3 returns 8 \n \n root	underroot function root 4 returns 2 \n \n sin	Sine function \n \n cos	Cosine function \n \n tan	Tangent function \n \n asin	Inverse Sine function \n \n acos	Inverse Cosine function \n \n atan	Inverse Tangent function \n \n sinh	Hyperbolic Sine function \n \n cosh	Hyperbolic Cosine function \n \n tanh	Hyperbolic Tangent function \n \n asinh	Inverse Hyperbolic Sine function \n \n acosh	Inverse Hyperbolic Cosine function \n \n atanh	Inverse Hyperbolic Tangent function \n \n Type ' + botname + ' /help for command list', message.id.toString());

                            }
                        } else {
                            client.reply(message.from, 'Hi ' + message.sender.pushname + ', this function has been turned off', message.id.toString());

                        }
                    } else if (message.content.indexOf("Song") > -1 || message.content.indexOf("song") > -1) {
                        if (songactive) {
                            songname = message.content.replace("Song", "").replace("song", "").replace(botname, "").replace("@" + botnumber, "").trim();
                            console.log("Finding Song " + songname)

                            songlink(songname, async function(songdata) {
                                if (songdata != "Error") {

                                    //Song json data obtained, processing songdata to send song

                                    filepath = "./dump/" + songdata.title + ".mp4";
                                    filename = songdata.title + ".mp4";

                                    file = fs.createWriteStream(filepath);

                                    https.get(songdata.link, async function(response) { //you need to save the song to your local storage first
                                        await response.pipe(file);
                                        file.on('finish', function() {
                                            file.close(); // close() is async, call cb after close completes.

                                            client.sendFile(message.from, filepath, filename, songdata.title);

                                        });
                                    });



                                } else {
                                    console.log("Error in Song processing")
                                    client.reply(message.from, 'Hi ' + message.sender.pushname + ', your request couldn\'t be completed ', message.id.toString());

                                }
                            });
                        } else {
                            client.reply(message.from, 'Hi ' + message.sender.pushname + ', this function has been turned off', message.id.toString());

                        }


                    } else if (message.content.indexOf("sticker") > -1 || message.content.indexOf("Sticker") > -1) {
                        if (stickeractive) {


                            if (message.chat.contact.profilePicThumbObj.eurl) {

                                if (message.from.indexOf(bannedsticker) == -1) {

                                    console.log("Sending Sticker")
                                    filepath = "./stickers/" + message.sender.formattedName + ".jpg";

                                    file = fs.createWriteStream(filepath);
                                    https.get(message.chat.contact.profilePicThumbObj.eurl, async function(response) {
                                        await response.pipe(file);
                                        file.on('finish', function() {
                                            file.close();

                                            client.sendImageAsSticker(message.from, filepath);

                                        });
                                    });
                                } else {
                                    client.reply(message.from, 'Hi ' + message.sender.pushname + ', this group/person doesn\'t allow sending stickers ', message.id.toString());

                                }
                            } else {
                                client.reply(message.from, 'Hi ' + message.sender.pushname + ', you have no profile picture. \n \n Type ' + botname + ' /help for command list ', message.id.toString());

                            }
                        } else {
                            client.reply(message.from, 'Hi ' + message.sender.pushname + ', this function has been turned off', message.id.toString());

                        }

                    } else if (message.content.indexOf("YT") > -1 || message.content.indexOf("yt") > -1 || message.content.indexOf("youtube") > -1 || message.content.indexOf("Youtube") > -1) {
                        ytquery = message.content.replace("yt", "").replace("YT", "").replace("youtube", "").replace(botname, "").replace("@" + botnumber, "").replace("Youtube", "").trim();
                        console.log("YT Request Received " + ytquery)
                        searchyt(ytquery, function(ytres) {
                            if (ytres != "Error") {

                                ytlink = "https://www.youtube.com/watch?v=" + ytres.id.videoId;
                                ytitle = ytres.snippet.title;

                                client.reply(message.from, ytlink + ' \n \n ' + ytitle, message.id.toString());

                            } else {
                                console.log("Error Occured")
                                client.reply(message.from, 'Hi ' + message.sender.pushname + ', your youtube search cannot be completed. \n \n Type ' + botname + ' /help for command list ', message.id.toString());

                            }
                        });
                    } else if (message.content.indexOf("/h") > -1 || message.content.indexOf("/help") > -1) {
                        console.log("Help Reuest")

                        await client.reply(message.from, 'Hi ' + message.sender.pushname + ', you can use the following commands: \n \n *' + botname + ' song <song name>* to download songs \n \n *' + botname + ' math 5+5* for basic maths \n \n *' + botname + ' yt <video name>* to share YT Video link \n \n *' + botname + ' sticker* to convert your DP to a sticker, works in PM/DM, for public dps', message.id.toString());
                    }


                } else {
                    //console.log("desired msg not recieved "+message.content)
                }
            }
        })
    } catch (e) {
        console.log("Bot Crashed " + e)
        client.close();

    }
}


if (!fs.existsSync("./dump")) {
    fs.mkdirSync("./dump");
}
if (!fs.existsSync("./stickers")) {
    fs.mkdirSync("./stickers");
}
