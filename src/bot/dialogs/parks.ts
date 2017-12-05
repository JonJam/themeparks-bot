import {
  IDialogResult,
  IFindMatchResult,
  IPromptChoiceResult,
  IPromptConfirmResult,
  Library,
  ListStyle,
  Prompts
} from "botbuilder";
import { format } from "util";
import { parkNames } from "../../services/parks";
import strings from "../../strings";
import { getSelectedPark } from "../data/userData";

const lib = new Library("parks");

lib.dialog("whichPark", [
  session => {
    Prompts.choice(session, strings.parks.whichPark.prompt, parkNames, {
      listStyle: ListStyle.auto,
      retryPrompt: strings.parks.whichPark.retryPrompt
    });
  },

  (session, results: IPromptChoiceResult) => {
    // Casting to remove undefined as choice prompt will ensure value.
    const response = results.response as IFindMatchResult;
    const chosenPark = response.entity;

    const dialogResult: IDialogResult<string> = {
      response: chosenPark
    };

    session.endDialogWithResult(dialogResult);
  }
]);

lib.dialog("stillInterestedInPark", [
  session => {
    const parkName = getSelectedPark(session);

    const prompt = format(strings.parks.stillInterestedInPark.prompt, parkName);

    Prompts.confirm(session, prompt);
  },

  (session, results: IPromptConfirmResult) => {
    if (results.response) {
      const dialogResult: IDialogResult<string> = {
        response: getSelectedPark(session)
      };

      session.endDialogWithResult(dialogResult);
    } else {
      session.replaceDialog("parks:whichPark");
    }
  }
]);

lib.dialog("parkIntro", [
  session => {
    const parkName = getSelectedPark(session);

    session.send(strings.parks.parkIntro.message1 + parkName);

    session.endDialog(strings.parks.parkIntro.message2);
  }
]);

export default lib;
