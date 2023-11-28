require("dotenv").config();
const { google } = require("googleapis");

const spreadsheetId = process.env.GOOGLE_SHEET_ID;
const sheetTitle = process.env.GOOGLE_SHEET_TITLE;

async function updateSheet(city, items) {
  const client = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    keyFile: `${process.env.GOOGLE_ACCOUNT_DATA}`,
  });

  const sheets = google.sheets({ version: "v4", auth: client });
  const range = `${sheetTitle}!A1:U41`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  const rows = response.data.values;

  const cityIndex = rows.findIndex((row) => row[0] === city);
  if (cityIndex >= 0) {
    const headerRow = rows[0];
    for (const [item, value] of Object.entries(items)) {
      const itemIndex = headerRow.indexOf(item);
      if (itemIndex >= 0) {
        rows[cityIndex][itemIndex] = `${value}%`;
      }
    }
  }

  const updateResponse = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: rows,
    },
  });

  console.log(`${updateResponse.data.updatedCells} cells updated.`);
}

module.exports = updateSheet;
