require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { Client, IntentsBitField, Collection } = require("discord.js");
const updateSheet = require("./helpers/updateSheet.js");
const matchCityName = require("./helpers/extractCity.js");
const recognizeText = require("./ocr/recognizeText.js");

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const channelID = process.env.CHANNEL_ID;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(DISCORD_TOKEN);

client.on("messageCreate", async (message) => {
  if (message.channel.id === channelID && message.attachments.size > 0) {
    message.attachments.forEach(async (attachment) => {
      if (
        attachment.contentType &&
        attachment.contentType.startsWith("image/")
      ) {
        const imageUrl = attachment.url;

        const response = await fetch(imageUrl);
        const imgBuffer = await response.arrayBuffer();

        const text = await recognizeText(imgBuffer);

        const cities = matchCityName(text.substring(0, 20));

        const itemsRegex =
          /Alcohol|Agate|Peanuts|Firearms|Bananas|Meat|Paper|Diamonds|Tea Leaves|Medicine|Gold|Leather|Pearls|Fish|Porcelain|Tin|Cloth|Tobacco|Carpets|Dye/g;

        const pricesRegex = /\((\d+)%[\/f]?\)/g;

        let items = {},
          match;

        while ((match = itemsRegex.exec(text))) {
          items[match[0]] = 0;
        }
        while ((match = pricesRegex.exec(text))) {
          const item = itemsRegex.exec(text);
          if (item) {
            items[item[0]] = Number(match[1]);
          }
        }

        console.log(cities, items);
        updateSheet(cities, items)
          ? message.channel.send("Data has been updated in the sheet.")
          : message.channel.send("Error updating the sheet.");

        if (!cities) {
          message.reply(
            `City: not found\nItems: \n${Object.keys(items)
              .map((item) => `${item}: ${items[item]}%`)
              .join("\n")}`
          );
        } else {
          message.reply(
            `City: ${cities}\nItems: \n${Object.keys(items)
              .map((item) => `${item}: ${items[item]}%`)
              .join("\n")}`
          );
        }
      }
    });
  }
});
