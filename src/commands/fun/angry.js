const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("angry")
    .setDescription("Replies with Angry!"),
  async execute(interaction) {
    const response = await fetch("https://purrbot.site/api/img/sfw/angry/gif");
    const data = await response.json();
    const gifUrl = data.link;

    await interaction.reply({ content: "Message sent!", ephemeral: true });
    await interaction.channel.send(gifUrl);
  },
};
