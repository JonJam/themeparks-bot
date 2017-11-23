import {
  IDialogResult,
  IPromptChoiceResult,
  Library,
  ListStyle,
  Prompts
} from "botbuilder";
import { parkNames } from "../../services/parks";
import strings from "../../strings";

const lib = new Library("parks");

lib.dialog("whichPark", [
  session => {
    Prompts.choice(session, strings.parks.whichPark.prompt, parkNames, {
      listStyle: ListStyle.auto,
      retryPrompt: strings.parks.whichPark.retryPrompt
    });
  },

  (session, results: IPromptChoiceResult) => {
    const chosenPark = results.response.entity;

    const dialogResult: IDialogResult<string> = {
      response: chosenPark
    };

    session.endDialogWithResult(dialogResult);
  }
]);

export default lib;
