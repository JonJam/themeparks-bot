import {
  IDialogResult,
  IPromptChoiceResult,
  Library,
  ListStyle,
  Prompts
} from "botbuilder";
import strings from "../../strings";

const lib = new Library("rides");

lib.dialog("whichRide", [
  (session, args: IWhichRideArgs) => {
    Prompts.choice(session, strings.rides.whichRide.prompt, args.rideNames, {
      listStyle: ListStyle.auto,
      retryPrompt: strings.rides.whichRide.retryPrompt
    });
  },

  (session, result: IPromptChoiceResult) => {
    // Removing undefined as choice prompt will ensure value.
    const chosenRide = result.response!.entity;

    const dialogResult: IDialogResult<string> = {
      response: chosenRide
    };

    session.endDialogWithResult(dialogResult);
  }
]);

export default lib;

export interface IWhichRideArgs {
  rideNames: ReadonlyArray<string>;
}
