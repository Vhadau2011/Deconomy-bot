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

const DAILY_AMOUNT = 1500;          // coins per day
const DAILY_COOLDOWN = 86400000;    // 24 hours in ms

module.exports = {
  name: "daily",

  execute(message) {
    const users = loadUsers();
    const userId = message.author.id;
    const now = Date.now();

    // Create user if not exists
    if (!users[userId]) {
      users[userId] = {
        wallet: 5000,
        bank: 0,
        lastDaily: 0
      };
    }

    const lastDaily = users[userId].lastDaily || 0;
    const timeLeft = DAILY_COOLDOWN - (now - lastDaily);

    if (timeLeft > 0) {
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

      return message.reply(
        `⏳ You already claimed your daily reward.\n` +
        `Come back in **${hours}h ${minutes}m**.`
      );
    }

    users[userId].wallet += DAILY_AMOUNT;
    users[userId].lastDaily = now;

    saveUsers(users);

    message.reply(
      `🎁 **Daily Reward Claimed!**\n` +
      `💰 You received **${DAILY_AMOUNT.toLocaleString()}** coins.\n` +
      `👛 Wallet: **${users[userId].wallet.toLocaleString()}**`
    );
  }
}; 
