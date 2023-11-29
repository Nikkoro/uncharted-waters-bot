# uncharted-waters-bot

## Requirements

- .env file ([>click<](#example-env))
- Google account data in json format ( [>click<](#google-account-data))

- config.json in src directory ([>click<](#discord-config))

## Installation

```bash
npm install
```

## Usage

```bash
npm run start
npm run start:dev # with nodemon
```

## Example env

Put this in a file called `.env` in the src directory.

```bash
DISCORD_TOKEN=your-token
CHANNEL_ID=your-channel-id
GOOGLE_ACCOUNT_DATA=path-to-google-json
GOOGLE_SHEET_ID=your-sheet-id
GOOGLE_SHEET_TITLE=your-sheet-title
```

## Google account data

**GOOGLE_ACCOUNT_DATA** is a path to a json file with google account data. See https://developers.google.com/identity/protocols/oauth2/service-account#creatinganaccount

## Discord config

```json
{
  "token": "token",
  "clientId": "client-id",
  "guildId": "guild-id"
}
```
