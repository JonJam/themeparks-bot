import { Session } from "botbuilder";

// https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-overview#default-dialog
// First response to a user.
export default function defaultDialog(session: Session) {
  const shownWelcomeNewUserMessage: boolean | undefined =
    session.userData.shownWelcomeNewUserMessage;

  if (shownWelcomeNewUserMessage === undefined) {
    session.send("Hi I am Theme Park Bot. How can I help?");

    session.userData.shownWelcomeNewUserMessage = true;
  } else if (shownWelcomeNewUserMessage === true) {
    session.send("Welcome back! How can I help?");
  }
}
