const { google } = require("googleapis");

async function updateSheet(city, items) {
  const auth = new google.auth.GoogleAuth({
    keyFile: "././uncharted-waters-bot-ef6c8b595272.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const client = await auth.getClient();
  const spreadsheetId = "1hNSQafZhcE0xmhADxy5nxDDqYV4BnInmgweK2eAotQs";
  const sheetTitle = "Arkusz1";

  const sheets = google.sheets({ version: "v4", auth });
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
