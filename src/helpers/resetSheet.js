require("dotenv").config();
const { google } = require("googleapis");
const spreadsheetId = process.env.GOOGLE_SHEET_ID;
const sheetTitle = process.env.GOOGLE_SHEET_TITLE;

async function resetCells() {
  const client = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    keyFile: `${process.env.GOOGLE_ACCOUNT_DATA}`,
  });

  const sheets = google.sheets({ version: "v4", auth: client });
  const range = `${sheetTitle}!B2:U41`;

  const resource = {
    range,
    values: Array(40).fill(Array(20).fill("")),
  };

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      resource,
    });
    console.log(`Cleared ${range} successfully.`);
  } catch (err) {
    console.error(err);
  }
}

module.exports = resetCells;
