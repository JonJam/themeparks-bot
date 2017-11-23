import {
  IDialogResult,
  IPromptChoiceResult,
  Library,
  ListStyle,
  Prompts,
  IPromptConfirmResult
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

lib.dialog("stillInterestedInPark", [
  (session, args: IStillInterestedInParkArgs) => {
    const prompt = `${strings.parks.stillInterestedInPark
      .prompt1}${args.parkName}${strings.parks.stillInterestedInPark.prompt2}`;

    Prompts.confirm(session, prompt);
  },

  (session, results: IPromptConfirmResult) => {
    // TODO If Yes return theme park name
    // TODO if no launch the which park.
  }
]);

lib.dialog("parkIntro", [
  (session, args: IParkIntroArgs) => {
    session.send(strings.parks.parkIntro.message1 + args.parkName);

    session.endDialog(strings.parks.parkIntro.message2);
  }
]);

export default lib;

export interface IParkIntroArgs {
  parkName: string;
}

export interface IStillInterestedInParkArgs {
  parkName: string;
}
