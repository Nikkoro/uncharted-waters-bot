require("dotenv").config();
const { createWorker } = require("tesseract.js");
const { Client, IntentsBitField } = require("discord.js");
const Jimp = require("jimp");
const resetSheet = require("./helpers/resetSheet.js");
const updateSheet = require("./helpers/updateSheet.js");
const matchCityName = require("./test.js");

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const channelID = process.env.CHANNEL_ID;

// const recognizeText = async (imgBuffer) => {
//   const {
//     data: { text },
//   } = await Tesseract.recognize(imgBuffer, "eng");
//   return text;
// };

const recognizeText = async (imgBuffer) => {
  const worker = await createWorker({
    logger: (m) => console.log(m),
  });
  await worker.load();
  await worker.loadLanguage("eng2");
  await worker.initialize("eng2");
  const {
    data: { text },
  } = await worker.recognize(imgBuffer);
  await worker.terminate();
  return text;
};

let photoNr = 0;

const preprocessImage = async (imageBuffer) => {
  const image = await Jimp.read(imageBuffer);

  //image.greyscale().contrast(0.5).brightness(0.5).posterize(2);
  //   image
  //     .greyscale()
  //     .contrast(0.5)
  //     .brightness(0.8)
  //     .posterize(2)
  //     .threshold({ max: 256, autoGreyscale: false })
  //     .invert();

  image
    .color([
      { apply: "desaturate", params: [90] },
      { apply: "darken", params: [5] },
    ])
    .contrast(0.8);
  // .convolute([
  //   [0, -1, 0],
  //   [-1, 5, -1],
  //   [0, -1, 0],
  // ]);

  const processedImageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

  await image.writeAsync(`resources/processed${"convolute"}.jpg`);
  photoNr++;
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
    console.log(imgBuffer);

    const processedImageBuffer = await preprocessImage(imgBuffer);

    // const text = await recognizeText(imgBuffer);

    const text = await recognizeText(processedImageBuffer);

    // const text =
    //   "Edo € 5.0752M 5.0752M Our establishment offers fair trade to 0 / 200k all: You can trust our 01.59.07 services! Gold Leather Price 862 (96%) Price 194 (97%) Weight 75 Weight 16 5.1K 14.45K Cloth Peanuts Price 247 (99%f) Price 110 (100%) Weight 22 Weight 10 12.24K 21.624K Bananas Agate Price 50 (100%) Price 1.006K (101%) Weight 4 Weight 100 37.4K 4.76K Meat Tobacco Price 92 (102%) Price 513 (103%) Weight 6 Weight 50 24.548K 82K Porcelain Tea Leaves Price 832 (104%) Price 481 (107%) Weight 57 Weight 37 5.304K 8.296K Alcohol Price 728 (86%) Weight 65 Sold out Purchase Sell";
    console.log(text);

    const citiesRegex =
      /Aden|Alexandria|Amsterdam|Athens|Basrah|Boston|Brunei|Buenos Aires|Calicut|Kolkata|Cape Town|Cayenne|Ceylon|Copenhagen|Darwin|Edo|Hamburg|Hangzhou|Istanbul|Jamaica|Las Palmas|Lisbon|London|Luanda|Malacca|Manila|Marseille|Mozambique|Nantes|Nassau|Panama City|Pinjarra|Quanzhou|Rio De Janeiro|Santo Domingo|Seville|St\. George's|Stockholm|Tunis|Venice/g;
    const cities = matchCityName(text.substring(0, 20));

    const itemsRegex =
      /Alcohol|Agate|Peanuts|Firearms|Banana|Meat|Paper|Diamonds|Tea Leaves|Medicine|Gold|Leather|Pearls|Fish|Porcelain|Tin|Cloth|Tobacco|Carpets|Dye/g;
    // const pricesRegex = /Price (\d+(?:\.\d+)?) \((\d+)%\)/g;
    // const pricesRegex = /Price (\d+(?:\.\d+)?)(?:K)? \((\d+)%\)/g;
    // const pricesRegex = /Price (\d+(?:\.\d+)?)(?:K)? \((\d+)%[\/f]?\)/g;
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
    // was cities.join(", ") before
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
