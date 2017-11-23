import { IDialogResult, Session } from "botbuilder";
import strings from "../../strings";

// https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-overview#default-dialog
// Called whenever the dialog stack is empty and no other dialog triggered.
export default [
  (session: Session) => {
    session.beginDialog("greetings:hello");
  },
  (session: Session) => {
    session.beginDialog("parks:whichPark");
  },
  (session: Session, results: IDialogResult<string>) => {
    session.send(strings.default.parkSelected + results.response);

    // TODO Save selected park
    // TODO Continue with selected park.
  }
];
