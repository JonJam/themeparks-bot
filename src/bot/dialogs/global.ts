import { IDialogResult, Library, Session } from "botbuilder";
import { setSelectedPark } from "../data/userData";
import strings from "../../strings";

const lib = new Library("global");

lib
  .dialog("help", (session: Session) => {
    session.endDialog(strings.global.help.message);
  })
  .triggerAction({
    // LUIS intent
    matches: "global:help"
  });

lib
  .dialog("switchPark", [
    // TODO See if can reduce duplication. Copied from default.
    (session: Session) => {
      session.beginDialog("parks:whichPark");
    },
    (session: Session, results: IDialogResult<string>) => {
      // Removing undefined as we know that if reach here then a park has been selected.
      const park = results.response!;

      setSelectedPark(session, park);

      session.beginDialog("parks:parkIntro");
    }
  ])
  .triggerAction({
    // LUIS intent
    matches: "global:switchPark"
  });

export default lib;
