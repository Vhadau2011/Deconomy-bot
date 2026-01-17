const fs = require("fs");
const path = require("path");

const usersPath = path.join(__dirname, "../../data/users.json");

function loadUsers() {
  if (!fs.existsSync(usersPath)) {
    fs.writeFileSync(usersPath, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(usersPath));
}

function saveUsers(data) {
  fs.writeFileSync(usersPath, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "dice",
  aliases: ["rollDice"],

  execute(message, args) {
    // 🔒 SELF LOCK TO GAMBLING CHANNELS
    const allowedChannels = [
      process.env.GAMBLE_CHANNEL_1,
      process.env.GAMBLE_CHANNEL_2
    ];

    if (!allowedChannels.includes(message.channel.name)) {
      return message.reply(
        "⛔ This command can only be used in **official gambling channels**."
      );
    }

    const users = loadUsers();
    const userId = message.author.id;

    // Create user if not exists
    if (!users[userId]) {
      users[userId] = {
        wallet: 5000,
        bank: 0
      };
    }

    if (!args[0]) {
      return message.reply("❌ Usage: `.dice <amount>`");
    }

    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply("❌ Enter a valid amount.");
    }

    if (amount > users[userId].wallet) {
      return message.reply("❌ You don’t have enough money in your wallet.");
    }

    const userRoll = Math.floor(Math.random() * 6) + 1;
    const botRoll = Math.floor(Math.random() * 6) + 1;

    let result =
      `🎲 **DICE GAME** 🎲\n` +
      `You rolled: **${userRoll}**\n` +
      `House rolled: **${botRoll}**\n\n`;

    if (userRoll > botRoll) {
      // WIN (x2)
      users[userId].wallet += amount;
      saveUsers(users);

      return message.reply(
        result +
        `🏆 **YOU WIN!**\n` +
        `💰 Won **${amount.toLocaleString()}** coins\n` +
        `👛 Wallet: **${users[userId].wallet.toLocaleString()}**`
      );
    }

    if (userRoll === botRoll) {
      // DRAW (no loss)
      return message.reply(
        result +
        `🤝 **DRAW!**\n` +
        `💸 No money lost or won.\n` +
        `👛 Wallet: **${users[userId].wallet.toLocaleString()}**`
      );
    }

    // LOSE
    users[userId].wallet -= amount;
    saveUsers(users);

    return message.reply(
      result +
      `💀 **YOU LOST!**\n` +
      `💸 Lost **${amount.toLocaleString()}** coins\n` +
      `👛 Wallet: **${users[userId].wallet.toLocaleString()}**`
    );
  }
};
