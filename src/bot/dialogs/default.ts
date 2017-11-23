import { IDialogResult, Session } from "botbuilder";
import { IParkIntroArgs } from "./parks";

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
    session.userData.selectedPark = results.response;

    const args: IParkIntroArgs = {
      parkName: session.userData.selectedPark
    };

    session.beginDialog("parks:parkIntro", args);
  }
];
