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
  name: "wallet",
  aliases: ["bal", "balance"],

  execute(message) {
    const users = loadUsers();
    const userId = message.author.id;

    // Create user if not exists
    if (!users[userId]) {
      users[userId] = {
        wallet: 5000,
        bank: 0
      };
      saveUsers(users);
    }

    const wallet = users[userId].wallet;
    const bank = users[userId].bank;

    message.reply(
      `💰 **${message.author.username}'s Balance**\n` +
      `👛 Wallet: **${wallet.toLocaleString()}** coins\n` +
      `🏦 Bank: **${bank.toLocaleString()}** coins`
    );
  }
};
