require("dotenv").config();
const Tesseract = require("tesseract.js");
const { Client, IntentsBitField } = require("discord.js");
const Jimp = require("jimp");
const resetSheet = require("./helpers/resetSheet.js");
const updateSheet = require("./helpers/updateSheet.js");

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const channelID = "1076543900505882664";

const recognizeText = async (imgBuffer) => {
  const {
    data: { text },
  } = await Tesseract.recognize(imgBuffer, "eng");
  return text;
};

let photoNr = 0;

const preprocessImage = async (imageBuffer) => {
  const image = await Jimp.read(imageBuffer);

  //image.greyscale().contrast(0.5).brightness(0.5).posterize(2);
  image
    .greyscale()
    .contrast(0.5)
    .brightness(0.5)
    .posterize(2)
    .threshold({ max: 256, autoGreyscale: false });
  //   image.threshold({ max: 164, autoGreyscale: false });

  const processedImageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

  //await image.writeAsync(`resources/processed${photoNr}.jpg`);
  //photoNr++;
  return processedImageBuffer;
};

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.login(DISCORD_TOKEN);

client.on("ready", () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (
    message.channel.id === channelID &&
    message.content.toLowerCase() === "ping"
  ) {
    message.reply("pong");
  }
});

client.on("messageCreate", (message) => {
  if (message.channel.id === channelID && message.content === "John Cena") {
    message.reply("Bing Chilling");
  }
});

const prefix = "!";

client.on("messageCreate", (message) => {
  if (message.content === `${prefix}clearAll`) {
    message.channel.messages
      .fetch({ limit: 100 })
      .then((messages) => {
        const nonPinnedMessages = messages.filter((m) => !m.pinned);
        message.channel
          .bulkDelete(nonPinnedMessages)
          .then((deletedMessages) => {
            message.channel.send(`Deleted ${deletedMessages.size} messages`);
          });
      })
      .catch(console.error);
  }
});

client.on("messageCreate", (message) => {
  if (message.content === `${prefix}resetSheet`) {
    resetSheet();
    message.channel.send(`Sheet has been reset.`);
  }
});

client.on("messageCreate", async (message) => {
  if (
    message.channel.id === channelID &&
    message.attachments.size > 0 &&
    message.attachments.first().contentType.startsWith("image/")
  ) {
    const image = message.attachments.first();
    const imageUrl = image.url;
    const response = await fetch(imageUrl);
    const imgBuffer = await response.arrayBuffer();
    const processedImageBuffer = await preprocessImage(imgBuffer);
    // const text = await recognizeText(imgBuffer);

    const text = await recognizeText(processedImageBuffer);
    console.log(text);
    const citiesRegex =
      /Aden|Alexandria|Amsterdam|Athens|Basrah|Boston|Brunei|Buenos Aires|Calicut|Kolkata|Cape Town|Cayenne|Ceylon|Copenhagen|Darwin|Edo|Hamburg|Hangzhou|Istanbul|Jamaica|Las Palmas|Lisbon|London|Luanda|Malacca|Manila|Marseille|Mozambique|Nantes|Nassau|Panama City|Pinjarra|Quanzhou|Rio De Janeiro|Santo Domingo|Seville|St\. George's|Stockholm|Tunis|Venice/g;
    const cities = text.match(citiesRegex);

    const itemsRegex =
      /Alcohol|Agate|Peanuts|Firearms|Banana|Meat|Paper|Diamonds|Tea Leaves|Medicine|Gold|Leather|Pearls|Fish|Porcelain|Tin|Cloth|Tobacco|Carpets|Dye/g;
    // const pricesRegex = /Price (\d+(?:\.\d+)?) \((\d+)%\)/g;
    const pricesRegex = /Price (\d+(?:\.\d+)?)(?:K)? \((\d+)%\)/g;

    let items = {},
      match;

    while ((match = itemsRegex.exec(text))) {
      items[match[0]] = 0;
    }
    while ((match = pricesRegex.exec(text))) {
      const item = itemsRegex.exec(text);
      if (item) {
        items[item[0]] = Number(match[2]);
      }
    }

    console.log(cities, items);
    updateSheet(cities.join(", "), items)
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
        `City: ${cities.join(", ")}\nItems: \n${Object.keys(items)
          .map((item) => `${item}: ${items[item]}%`)
          .join("\n")}`
      );
    }
  }
});
