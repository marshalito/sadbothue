console.log("Ativando..")
const Discord = require('discord.js');
const bot = new Discord.Client();
const delay = require('delay');
const config = require("./config.js");
const YTDL = require('ytdl-core');
const cors = require('chalk');
var prefix = ("!")
const fs = require('fs')

function play(connection, message) {
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

  server.queue.shift();

  server.dispatcher.on("end", function() {
    if (server.queue[0]) play(connection, message);
    else connection.disconnect();
  })
}

var servers = {};

bot.on('message', message => {

  // Variables - Variables make it easy to call things, since it requires less typing.
  let msg = message.content.toUpperCase(); // This variable takes the message, and turns it all into uppercase so it isn't case sensitive.
  let sender = message.author; // This variable takes the message, and finds who the author is.
  let cont = message.content.slice(prefix.length).split(" "); // This variable slices off the prefix, then puts the rest in an array based off the spaces
  let args = cont.slice(1); // This slices off the command in cont, only leaving the arguments.

  // Commands


  // Purge
  if (msg.startsWith(prefix + 'DELETAR')) { // This time we have to use startsWith, since we will be adding a number to the end of the command.
      // We have to wrap this in an async since awaits only work in them.
      async function purge() {
          message.delete(); // Let's delete the command message, so it doesn't interfere with the messages we are going to delete.

          // Now, we want to check if the user has the `bot-commander` role, you can change this to whatever you want.
          if (!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) return null; // This checks to see if they DONT have it, the "!" inverts the true/false

          // We want to check if the argument is a number
          if (isNaN(args[0])) {
              // Sends a message to the channel.
              message.channel.send('Insira o número de mensagens que deseja remover. \n Exemplo: ' + prefix + 'limpar <número>.'); //\n means new line.
              // Cancels out of the script, so the rest doesn't run.
              return;
          }

          const fetched = await message.channel.fetchMessages({limit: args[0]}); // This grabs the last number(args) of messages in the channel.
          console.log(fetched.size + ' mensagens deletadas.'); // Lets post into console how many messages we are deleting

          // Deleting the messages
          message.channel.bulkDelete(fetched)
              .catch(error => message.channel.send(`Erro: ${error}`)); // If it finds an error, it posts it into the channel.

      }

      // We want to make sure we call the function whenever the purge command is run.
      purge(); // Make sure this is inside the if(msg.startsWith)

  }
  //Tocar
  if (msg.startsWith(prefix + 'TOCAR')) {
    if (args[1]) {
      message.channel.sendMessage("Adicione um link.");
      return;
    }

    if (!message.member.voiceChannel) {
      message.channel.sendMessage("Entre em um canal de voz.");
      return; 
    }

    if(!servers[message.guild.id]) servers[message.guild.id] = {
      queue: []
    };

    var server = servers[message.guild.id];

    server.queue.push(args[1]);

    if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
      play(connection, message);
    });
  }
  //Pular
  if (msg.startsWith(prefix + 'PULAR')) {
    var server = servers[message.guild.id];

    if (server.dispatcher) server.dispatcher.end();
  }
  //Parar
  if (msg.startsWith(prefix + 'PARAR')) {
    var server = servers [message.guild.id];

    if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
  }
});

bot.on('ready', () =>{
  console.log(`Estou ativado! <${bot.user.username}>`);
  bot.user.setActivity("o desenvolvimento do servidor.", {type: "WATCHING"});
});
bot.commands = new Discord.Collection();
fs.readdir("./comandos", (err, files) => {
  if(err) console.error(err);
  let jsfiles = files.filter(f => f.split(".").pop() === "js");
  if(jsfiles.length <= 0) {
    console.log (cors.bgRed("@Nenhum comando foi carregado."));
    return;
  }
  console.log(cors.bgRed(`@Eu carreguei ${jsfiles.length} comando(s) para você usar!`));
  jsfiles.forEach((f, i) => {
    let props = require(`./comandos/${f}`);
    bot.commands.set(props.help.name, props)
  });
});

bot.on("message", async(message) =>{
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let args = message.content.split(" ").slice(1).join(" ");
  let command = message.content.split(" ")[0];
  if(!command.startsWith(prefix)) return;

let cmd = bot.commands.get(command.slice(prefix.length));
if(cmd)
cmd.run(bot, message, args);
});


bot.on('guildMemberAdd', member =>{
  let channel = member.guild.channels.find('name', 'boas-vindas');
  let memberavatar = member.user.avatarURL
      if (!channel) return;
      let embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setThumbnail(memberavatar)
      .addField(':zzz: Novo membro!', `${member} veio sonhar conosco, seja bem-vindo(a)!`)
      .setTimestamp()

      channel.sendEmbed(embed);
});

bot.on('guildMemberAdd', member => {

    console.log(`${member}`, "entrou!" + `${member.guild.name}`)

});

bot.on('guildMemberAdd', member =>{
  let embed = new Discord.RichEmbed()
  .setColor('#2fd12c')
  .setDescription(`Olá. Seja **bem-vindo(a)** ao Discord da Rede Dream!

:white_small_square: Antes de interagir, leia as **regras**.
:white_small_square: Precisa de ajuda? Digite **!ajuda**.
:white_small_square: **Twitter:** https://twitter.com/ServidoresDream
:white_small_square: **IP:** jogar.rededream.com
:white_small_square: **Loja:** Em desenvolvimento.
:white_small_square: **Site:** Em desenvolvimento.
  
Caso tenha alguma dúvida em relação à rede, dirija-se ao chat #dúvidas para que ela possa ser solucionada por um de nossos staffers!`)
  .setTimestamp()

  member.sendEmbed(embed);
});

bot.login("NDY2Njc3NjkwOTEzNzgzODEw.Difi_Q.P7Dgh6fXUwYiSgwUITQ69CZchLU");