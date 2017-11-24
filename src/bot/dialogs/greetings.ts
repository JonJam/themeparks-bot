import { Library, Session } from "botbuilder";
import strings from "../../strings";
import {
  getShownWelcomeNewUserMessage,
  setShownWelcomeNewUserMessage
} from "../data/userData";

const lib = new Library("greetings");

lib.dialog("hello", (session: Session) => {
  const shownWelcomeNewUserMessage = getShownWelcomeNewUserMessage(session);

  let message = strings.greetings.hello.welcomeBack;

  if (shownWelcomeNewUserMessage === undefined) {
    message = strings.greetings.hello.welcomeNew;

    setShownWelcomeNewUserMessage(session, true);
  }

  session.endDialog(message);
});

lib.dialog("goodbye", (session: Session) => {
  session.endDialog(strings.greetings.goodbye.message);
});

lib
  .dialog("none", (session: Session) => {
    const randomIndex = Math.floor(
      Math.random() * strings.greetings.none.messages.length
    );
    const message = strings.greetings.none.messages[randomIndex];

    session.endDialog(message);
  })
  .triggerAction({
    // LUIS intent
    matches: "None"
  });

export default lib;
