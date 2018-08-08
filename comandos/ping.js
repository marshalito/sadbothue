const Discord = require('discord.js')
module.exports.run = async (client, message, args) => {
    if (!message.guild.member(message.author).hasPermission("SEND_MESSAGES")) return
	if (!message.guild.member(client.user).hasPermission("ADMINISTRATOR")) return message.reply(":x: Permissões insuficientes.");
    
    message.channel.send(`:ping_pong: **|** Seu ping é de **${Math.round(client.ping)}ms**!`);
}
module.exports.help = {
    name: "ping"
    }