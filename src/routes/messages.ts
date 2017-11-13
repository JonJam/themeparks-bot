import { ChatConnector } from "botbuilder";

// Create chat connector for communicating with the Bot Framework Service
export default new ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});
