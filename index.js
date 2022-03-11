import DiscordJS, { Intents } from 'discord.js'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
dotenv.config()

const CAT_API_URL = "https://api.thecatapi.com/"

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', () => {
    console.log('The bot is ready')
    let channel = client.channels.cache.get('947973309063135243') //test
    //let channel = client.channels.cache.get('911817903089782814')
    setInterval(async function() {
        var image = await loadImage('image')

        channel.send("***Daily Cat Picture!***");
        channel.send({files: [image[0].url]});
    }, 6000)
})

client.on('messageCreate', (message) => {
    if(message.content === 'ping'){
        message.reply({content: 'pong',})
    }
    if(message.content === 'cat'){
        recieveImage(message, 'image');
    }
    if(message.content === 'gifcat'){
        recieveImage(message, 'gif');
    }
})

async function recieveImage(message, type){
    try{
        var images = await loadImage(type);

        console.log('message processed')

        message.channel.send({files: [images[0].url]});
    } catch(error){
        console.log(error)
    }
}

async function loadImage(type){
    if(type === 'image'){
        type = 'png,jpg'
    }
    try{
        let _url = CAT_API_URL + 'v1/images/search' + 
            '?mime_types=' + type + 
            '&key=' + process.env.CAT_API_KEY ;
        let response = await fetch(_url);
        let json = await response.json();

        return json
    } catch (err){
        console.log(err)
    }
}

client.login(process.env.TOKEN)