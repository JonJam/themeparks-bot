import { Library, Session } from "botbuilder";
import strings from "../../strings";

const lib = new Library("greetings");

lib.dialog("hello", (session: Session) => {
  const shownWelcomeNewUserMessage: boolean | undefined =
    session.userData.shownWelcomeNewUserMessage;

  let message = strings.greetings.hello.welcomeBack;

  if (shownWelcomeNewUserMessage === undefined) {
    message = strings.greetings.hello.welcomeNew;

    session.userData.shownWelcomeNewUserMessage = true;
  }

  session.endDialog(message);
});

lib.dialog("goodbye", (session: Session) => {
  session.endDialog(strings.greetings.goodbye.message);
});

export default lib;
