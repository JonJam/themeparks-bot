import { ChatConnector, IConversationUpdate, UniversalBot } from "botbuilder";
import { appId, appPassword } from "../settings";
import defaultDialog from "./dialogs/default";
import greetings from "./dialogs/greetings";

// Create chat connector for communicating with the Bot Framework Service
const connector = new ChatConnector({
  appId,
  appPassword
});

const bot = new UniversalBot(connector, defaultDialog);

// This may not be supported by all channcels, see alternative: https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-handle-conversation-events
bot.on("conversationUpdate", (message: IConversationUpdate) => {
  if (message.membersAdded) {
    message.membersAdded.forEach(identity => {
      if (identity.id === message.address.bot.id) {
        // Bot added to conversation, so display welcome message.
        // https://github.com/Microsoft/BotBuilder-Samples/tree/master/Node/demo-ContosoFlowers#welcome-message
        bot.beginDialog(message.address, "greetings:hello");
      }
    });
  }

  // TODO Test this works
  if (message.membersRemoved) {
    message.membersRemoved.forEach(identity => {
      if (identity.id === message.address.bot.id) {
        bot.beginDialog(message.address, "greetings:goodbye");
      }
    });
  }
});

bot.library(greetings.clone());

export default connector;
