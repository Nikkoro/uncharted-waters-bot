// Import the necessary modules
const { SlashCommandBuilder } = require("discord.js");
const resetSheet = require("../../helpers/resetSheet.js");

// Create the slash command
const resetSheetCommand = new SlashCommandBuilder()
  .setName("resetsheet")
  .setDescription("Reset the Google Sheet");

// Execute the slash command
async function execute(interaction) {
  try {
    await resetSheet(); // Call the function from resetSheet.js
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
