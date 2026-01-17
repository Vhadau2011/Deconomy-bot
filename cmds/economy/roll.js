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
  name: "roll",

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
      return message.reply("❌ Usage: `.roll <amount>`");
    }

    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply("❌ Please enter a valid amount.");
    }

    if (amount > users[userId].wallet) {
      return message.reply("❌ You don’t have enough money in your wallet.");
    }

    // 🎲 Roll 1–6
    const roll = Math.floor(Math.random() * 6) + 1;

    if (roll >= 4) {
      // WIN
      users[userId].wallet += amount;
      saveUsers(users);

      return message.reply(
        `🎲 You rolled **${roll}** — **YOU WON!**\n` +
        `💰 Won: **${amount.toLocaleString()}** coins\n` +
        `👛 Wallet: **${users[userId].wallet.toLocaleString()}**`
      );
    } else {
      // LOSE
      users[userId].wallet -= amount;
      saveUsers(users);

      return message.reply(
        `🎲 You rolled **${roll}** — **YOU LOST!**\n` +
        `💸 Lost: **${amount.toLocaleString()}** coins\n` +
        `👛 Wallet: **${users[userId].wallet.toLocaleString()}**`
      );
    }
  }
}; 
