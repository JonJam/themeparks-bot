import {
  IDialogResult,
  IPromptChoiceResult,
  IPromptConfirmResult,
  Library,
  ListStyle,
  Prompts
} from "botbuilder";
import { format } from "util";
import { parkNames } from "../../services/parks";
import strings from "../../strings";
import { getSelectedPark, setSelectedPark } from "../data/userData";

const lib = new Library("parks");

lib.dialog("whichPark", [
  session => {
    Prompts.choice(session, strings.parks.whichPark.prompt, parkNames, {
      listStyle: ListStyle.auto,
      retryPrompt: strings.parks.whichPark.retryPrompt
    });
  },

  (session, result: IPromptChoiceResult) => {
    // Removing undefined as choice prompt will ensure value.
    const chosenPark = result.response!.entity;

    setSelectedPark(session, chosenPark);

    const dialogResult: IDialogResult<string> = {
      response: chosenPark
    };

    session.endDialogWithResult(dialogResult);
  }
]);

// TODO Decide to remove?
lib.dialog("stillInterestedInPark", [
  session => {
    const parkName = getSelectedPark(session);

    const prompt = format(strings.parks.stillInterestedInPark.prompt, parkName);

    Prompts.confirm(session, prompt);
  },

  (session, result: IPromptConfirmResult) => {
    if (result.response === true) {
      const dialogResult: IDialogResult<string> = {
        response: getSelectedPark(session)
      };

      session.endDialogWithResult(dialogResult);
    } else {
      session.replaceDialog("parks:whichPark");
    }
  }
]);
export default lib;
