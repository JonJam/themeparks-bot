import { Library } from "botbuilder";
import strings from "../../strings";
import { getFirstRun, setFirstRun } from "../data/userData";

const lib = new Library("greetings");

// Universal channel support for first run, see https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-handle-conversation-events#add-a-first-run-dialog
lib
  .dialog("firstRun", session => {
    setFirstRun(session, true);

    session.endDialog(strings.greetings.firstRun.message);
  })
  .triggerAction({
    onFindAction: (context, callback) => {
      // Only trigger if we've never seen user before
      if (!getFirstRun(context)) {
        // Return a score of 1.1 to ensure the first run dialog wins
        callback(null as any, 1.1);
      } else {
        callback(null as any, 0.0);
      }
    }
  });

// TODO Change this to say still interested in park ?
lib
  .dialog("hello", session => {
    let message = strings.greetings.hello.welcomeBack;

    // (session: Session) => {
    //   const selectedPark = getSelectedPark(session);

    //   if (selectedPark) {
    //     session.beginDialog("parks:stillInterestedInPark");
    //   } else {
    //     session.beginDialog("parks:whichPark");
    //   }
    // },
    // (session: Session, results: IDialogResult<string>) => {
    //   // Removing undefined as we know that if reach here then a park has been selected.
    //   const park = results.response!;

    //   setSelectedPark(session, park);

    //   session.beginDialog("parks:parkIntro");
    // }

    session.endDialog(message);
  })
  .triggerAction({
    // LUIS intent
    matches: "greetings:hello"
  });

export default lib;
