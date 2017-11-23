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
