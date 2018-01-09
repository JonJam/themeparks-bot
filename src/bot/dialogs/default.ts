import { Session } from "botbuilder";
import strings from "../../strings";
import { format } from "util";

// https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-overview#default-dialog
// Called whenever the dialog stack is empty and no other dialog triggered.
export default [
  (session: Session) => {
    const randomIndex = Math.floor(
      Math.random() * strings.default.randomMessage.length
    );

    const message = format(
      strings.default.message,
      strings.default.randomMessage[randomIndex]
    );

    session.endDialog(message);
  }
];
