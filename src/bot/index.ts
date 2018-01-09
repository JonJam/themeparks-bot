import { ChatConnector, LuisRecognizer, UniversalBot } from "botbuilder";
import { appId, appPassword, luisAppUrl } from "../settings";
import defaultDialog from "./dialogs/default";
import fastPass from "./dialogs/fastPass";
import global from "./dialogs/global";
import greetings from "./dialogs/greetings";
import operatingHours from "./dialogs/operatingHours";
import parks from "./dialogs/parks";
import rides from "./dialogs/rides";
import status from "./dialogs/status";
import waitTimes from "./dialogs/waitTimes";
import storage from "./storage";

// Create chat connector for communicating with the Bot Framework Service
const connector = new ChatConnector({
  appId,
  appPassword
});

const bot = new UniversalBot(connector, defaultDialog);
bot.set("storage", storage);
bot.recognizer(new LuisRecognizer(luisAppUrl));
bot.library(fastPass.clone());
bot.library(global.clone());
bot.library(greetings.clone());
bot.library(operatingHours.clone());
bot.library(parks.clone());
bot.library(rides.clone());
bot.library(status.clone());
bot.library(waitTimes.clone());

export default connector;
