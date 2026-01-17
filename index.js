require("dotenv").config();

const fs = require("fs");
const path = require("path");
const {
  Client,
  Collection,
  GatewayIntentBits
} = require("discord.js");

// ===============================
// CLIENT
// ===============================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const PREFIX = process.env.PREFIX || ".";

// ===============================
// COMMAND COLLECTION
// ===============================
client.commands = new Collection();

// Load ONLY economy commands
const commandsPath = path.join(__dirname, "cmds/economy");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command.name) {
    client.commands.set(command.name, command);

    // aliases support
    if (command.aliases && Array.isArray(command.aliases)) {
      command.aliases.forEach(alias => {
        client.commands.set(alias, command);
      });
    }
  }
}

console.log(`✅ Loaded ${client.commands.size} commands`);

// ===============================
// READY
// ===============================
client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

// ===============================
// WELCOME MESSAGE (ALWAYS ACTIVE)
// ===============================
client.on("guildMemberAdd", member => {
  const welcomeChannelName = "welcome"; // change if needed
  const channel = member.guild.channels.cache.find(
    ch => ch.name === welcomeChannelName
  );

  if (!channel) return;

  channel.send(
    `👋 Welcome **${member.user.username}** to **${member.guild.name}**!\n` +
    `🎰 Head over to <#${channel.id}> to get started!\n` +
    `💰 Use \`${PREFIX}wallet\` to see your balance.`
  );
});

// ===============================
// MESSAGE HANDLER (PREFIX)
// ===============================
client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content
    .slice(PREFIX.length)
    .trim()
    .split(/ +/);

  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName);

  if (!command) return;

  try {
    command.execute(message, args);
  } catch (err) {
    console.error(err);
    message.reply("❌ An error occurred while executing this command.");
  }
});

// ===============================
// LOGIN
// ===============================
client.login(process.env.TOKEN);
