import {
  IDialogResult,
  IPromptChoiceResult,
  Library,
  ListStyle,
  Prompts
} from "botbuilder";
import { getWaitTimes } from "../../services/parks";
import strings from "../../strings";
import { getSelectedPark } from "../data/userData";

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

    // TODO Think about whether create another method for this.
    const waitTimes = await getWaitTimes(park);

    let message = strings.rides.all.noData;

    if (waitTimes !== null) {
      message = strings.rides.all.message;

      waitTimes.forEach(w => {
        message += `* ${w.name}\n\n`;
      });
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
