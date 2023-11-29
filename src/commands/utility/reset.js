const { SlashCommandBuilder } = require("discord.js");
const resetSheet = require("../../helpers/resetSheet.js");

const resetSheetCommand = new SlashCommandBuilder()
  .setName("resetsheet")
  .setDescription("Reset the Google Sheet");

async function execute(interaction) {
  try {
    await resetSheet();
    await interaction.reply("Google Sheet reset successful!");
  } catch (error) {
    console.error(error);
    await interaction.reply(
      "An error occurred while resetting the Google Sheet."
    );
  }
}

module.exports = {
  data: resetSheetCommand,
  execute: execute,
};
