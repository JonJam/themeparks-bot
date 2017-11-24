import { IDialogResult, Session } from "botbuilder";
import { getSelectedPark, setSelectedPark } from "../data/userData";

// https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-overview#default-dialog
// Called whenever the dialog stack is empty and no other dialog triggered.
export default [
  (session: Session) => {
    session.beginDialog("greetings:hello");
  },
  (session: Session) => {
    const selectedPark = getSelectedPark(session);

    if (selectedPark) {
      session.beginDialog("parks:stillInterestedInPark");
    } else {
      session.beginDialog("parks:whichPark");
    }
  },
  (session: Session, results: IDialogResult<string>) => {
    setSelectedPark(session, results.response);

    session.beginDialog("parks:parkIntro");
  }
];
