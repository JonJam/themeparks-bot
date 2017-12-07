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
    // Removing undefined as we know that if reach here then a park has been selected.
    const park = results.response!;

    setSelectedPark(session, park);

    session.beginDialog("parks:parkIntro");
  }
];
