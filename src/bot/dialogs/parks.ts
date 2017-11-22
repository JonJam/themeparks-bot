import { Library, Prompts, ListStyle } from "botbuilder";
import { parksMap } from "../../services/parks";

const lib = new Library("parks");

lib.dialog("whichPark", [
  function(session) {
    const choices: string[] = [];

    // TODO Sort this
    for (let key of parksMap.keys()) {
      choices.push(key);
    }

    // TODO replace with strings
    Prompts.choice(session, "Which park are you interested in?", choices, {
      listStyle: ListStyle.auto
    });
  },
  function(session, results) {
    // TODO handle a result
    session.endDialogWithResult(results);
  }
]);

export default lib;
