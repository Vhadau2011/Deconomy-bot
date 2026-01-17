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
  name: "slot",
  aliases: ["slots"],

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
      return message.reply("❌ Usage: `.slot <amount>`");
    }

    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply("❌ Enter a valid amount.");
    }

    if (amount > users[userId].wallet) {
      return message.reply("❌ You don’t have enough money in your wallet.");
    }

    const symbols = ["🍒", "🍋", "🍇", "💎", "🍀"];
    const roll = () => symbols[Math.floor(Math.random() * symbols.length)];

    const s1 = roll();
    const s2 = roll();
    const s3 = roll();

    let resultText = `🎰 **SLOT MACHINE** 🎰\n[ ${s1} | ${s2} | ${s3} ]\n\n`;

    // 🎯 Win logic
    if (s1 === s2 && s2 === s3) {
      // JACKPOT (x3)
      const winAmount = amount * 3;
      users[userId].wallet += winAmount;
      saveUsers(users);

      return message.reply(
        resultText +
        `🔥 **JACKPOT!**\n` +
        `🏆 Won **${winAmount.toLocaleString()}** coins\n` +
        `👛 Wallet: **${users[userId].wallet.toLocaleString()}**`
      );
    }

    if (s1 === s2 || s2 === s3 || s1 === s3) {
      // SMALL WIN (x1)
      users[userId].wallet += amount;
      saveUsers(users);

      return message.reply(
        resultText +
        `✨ **SMALL WIN!**\n` +
        `💰 Won **${amount.toLocaleString()}** coins\n` +
        `👛 Wallet: **${users[userId].wallet.toLocaleString()}**`
      );
    }

    // LOSE
    users[userId].wallet -= amount;
    saveUsers(users);

    return message.reply(
      resultText +
      `💀 **YOU LOST!**\n` +
      `💸 Lost **${amount.toLocaleString()}** coins\n` +
      `👛 Wallet: **${users[userId].wallet.toLocaleString()}**`
    );
  }
}; 
