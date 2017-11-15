import { Session } from "botbuilder";
import strings from "../../strings";

// https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-overview#default-dialog
// Called whenever the dialog stack is empty and no other dialog triggered.
export default function defaultDialog(session: Session) {
  const randomIndex = Math.floor(
    Math.random() * strings.default.messages.length
  );
  const message = strings.default.messages[randomIndex];

  session.endDialog(message);
}
