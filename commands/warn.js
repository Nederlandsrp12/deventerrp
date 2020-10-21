const discord = require("discord.js");
const fs = require("fs");
const warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));

module.exports.run = async (client, message, args) => {

    // !warn spelerNaam redenen hier.

    if (!message.member.hasPermission("MANAGE_MESSAGE")) return message.reply("Helaas kan jij dit niet doen!");

    if (!args[0]) return message.reply("Geen gebruiker meegegeven!");

    if (!args[1]) return message.reply("Geen redenen meegegeven");

    if (!message.guild.me.hasPermission("MANAGE_MESSAGE")) return message.reply("Geen perms!");

    var warnUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    var reason = args.slice(1).join(" ");

    if (!warnUser) return message.reply("Gebruik niet gevonden!");

    if (warnUser.hasPermission("MANAGE_MESSAGE")) return message.reply("Je kunt deze niet warnen!");

    if (!warns[warnUser.id]) warns[warnUser.id] = {
        warns: 0
    };

    warns[warnUser.id].warns++;

    fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
        if (err) console.log(err);
    });

    var embed = new discord.MessageEmbed()
        .setColor("ff0000")
        .setFooter(message.member.displayName)
        .setTimestamp()
        .setDescription(`**Gewarnd:** ${warnUser} (${warnUser.id})
        **Warning door:** ${message.author}
        **Redenen:** ${reason}`)
        .addField("Aantal warns", warns[warnUser.id].warns);

    var channel = message.member.guild.channels.cache.get("768569606171656212");

    if (!channel) return;

    channel.send(embed);

    if (warns[warnUser.id].warns == 2) {

        var embed = new discord.MessageEmbed()
            .setColor("ff0000")
            .setDescription("**LAASTE WAARSCHUWING ANDERS KICK!!**");

        message.channel.send(embed);

    } else if (warns[warnUser.id].warns == 3) {
       message.guild.member(warnUser).kick(reason);
       message.channel.send(`${warnUser} is gekickd door de bot wegens te veel warns!`);
    }

}

module.exports.help = {
    name: "warn"
}