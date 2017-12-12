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

lib
  .dialog("all", async session => {
    session.sendTyping();

    // Removing undefined since at this point it will be set.
    const park = getSelectedPark(session)!;

    const waitTimes = await getWaitTimes(park);

    let message = strings.waitTimes.common.noData;

    if (waitTimes !== null) {
      message = createMessage(waitTimes);
    }

    session.endDialog(message);
  })
  .triggerAction({
    // LUIS intent
    matches: "rides:all"
  });

export default lib;

export interface IWhichRideArgs {
  rideNames: ReadonlyArray<string>;
}
