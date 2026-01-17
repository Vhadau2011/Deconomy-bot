const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {
  client.on("guildMemberAdd", member => {

    // ✅ WELCOME CHANNEL (ID)
    const welcomeChannelId = "1462122069008584817";
    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor("#6b7cff")
      // 🖼 IMAGE AT THE TOP
      .setImage("https://i.imgur.com/0KFBHTB.png") // 🔁 REPLACE with Re:Zero image
      .setTitle("Re:Zero | Nexus")
      .setDescription(
        `Hello ${member} welcome to **Re:Zero | Nexus** 🌸\n\n` +
        `📜 Don’t forget to read the rules at <#1459259678683824199>\n` +
        `🗣️ And don’t forget to introduce yourself at <#1462001394516099164>\n` +
        `📘 And read the new members guideline at <#1462001613542658201>`
      )
      .setFooter({
        text: "Re:Zero | Nexus • Welcome System"
      })
      .setTimestamp();

    channel.send({
      embeds: [embed]
    });
  });
};
