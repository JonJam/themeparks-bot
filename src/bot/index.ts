import { ChatConnector, IConversationUpdate, UniversalBot } from "botbuilder";
import defaultDialog from "./dialogs/default";
import { appId, appPassword } from "../settings";
import test from "./dialogs/messages";

// Create chat connector for communicating with the Bot Framework Service
const connector = new ChatConnector({
  appId: appId,
  appPassword: appPassword
});

const bot = new UniversalBot(connector, defaultDialog);

bot.on("conversationUpdate", (message: IConversationUpdate) => {
  if (message.membersAdded) {
    message.membersAdded.forEach(identity => {
      if (identity.id === message.address.bot.id) {
        // Bot added to conversation, so display welcome message.
        // https://github.com/Microsoft/BotBuilder-Samples/tree/master/Node/demo-ContosoFlowers#welcome-message
        bot.beginDialog(message.address, "/");
      }
    });
  }

  // TODO Test this works
  if (message.membersRemoved) {
    message.membersRemoved.forEach(identity => {
      if (identity.id === message.address.bot.id) {
        bot.beginDialog(message.address, "messages:goodbye");
      }
    });
  }
});

bot.library(test.clone());

export default connector;
