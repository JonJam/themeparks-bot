import { IDialogResult, Library, Session } from "botbuilder";
import { format } from "util";
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
    (session: Session) => {
      session.beginDialog("parks:whichPark");
    },
    (session: Session, result: IDialogResult<string>) => {
      session.endDialog(
        format(strings.global.switchPark.message, result.response)
      );
    }
  ])
  .triggerAction({
    // LUIS intent
    matches: "global:switchPark"
  });

export default lib;
