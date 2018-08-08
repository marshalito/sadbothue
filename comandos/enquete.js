const Discord = require('discord.js')
module.exports.run = async (client, message, args) => {
    if (!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) return
    if (!message.guild.member(client.user).hasPermission("ADMINISTRATOR")) return message.reply("Eu não tenho a permissão `ADMINISTATOR`.");
    message.delete().catch(O_o=>{});
    if (!args[0]) {
        message.reply("**a sintaxe deste comando é:** !votar <detalhes da votação>.");
        return;
    };
    var args1 = message.content.split(" ").slice(1).join(" ");
    if (!args1) return message.reply("Digite !votar para mais informações.");
    message.channel.send('@everyone').then(a=>a.delete(1));
    var role = message.guild.roles.find('name', 'PartyBOT');
    const embed1 = new Discord.RichEmbed()
  .setAuthor('Votação')
  .setDescription(`${args1}`)
  .setColor(role.color)
  message.channel.send({embed: embed1}).then(msg=> {
    msg.react('👍');
    msg.react('👎');
    }); 
}
module.exports.help = {
    name: "votar"
    }