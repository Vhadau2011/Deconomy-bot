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
  name: "withdraw",
  aliases: ["with", "wd"],

  execute(message, args) {
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
      return message.reply("❌ Usage: `.withdraw <amount | all>`");
    }

    let amount;

    if (args[0].toLowerCase() === "all") {
      amount = users[userId].bank;
    } else {
      amount = parseInt(args[0]);
    }

    if (isNaN(amount) || amount <= 0) {
      return message.reply("❌ Please enter a valid amount.");
    }

    if (amount > users[userId].bank) {
      return message.reply("❌ You don’t have that much money in the bank.");
    }

    users[userId].bank -= amount;
    users[userId].wallet += amount;

    saveUsers(users);

    message.reply(
      `💸 **Withdraw Successful!**\n` +
      `🏦 Withdrawn: **${amount.toLocaleString()}** coins\n` +
      `👛 Wallet: **${users[userId].wallet.toLocaleString()}**\n` +
      `🏦 Bank: **${users[userId].bank.toLocaleString()}**`
    );
  }
};
