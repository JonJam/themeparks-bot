import {
  IDialogResult,
  IPromptChoiceResult,
  Library,
  ListStyle,
  Prompts
} from "botbuilder";
import { getRidesInfo } from "../../services/parks";
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
  .dialog("all", [
    // tslint:disable-next-line:variable-name
    (session, _result, skip) => {
      session.sendTyping();

      const park = getSelectedPark(session);

      if (park === undefined) {
        session.beginDialog("parks:whichPark");
      } else {
        const result: IDialogResult<string> = {
          response: park
        };

        skip!(result);
      }
    },
    async (session, result: IDialogResult<string>) => {
      // Removing undefined as we have either obtained this from the user or from storage.
      const park = result.response!;

      const ridesInfo = await getRidesInfo(park);

      let message = strings.rides.common.noData;

      if (ridesInfo !== null) {
        message = strings.rides.all.message;

        ridesInfo.forEach(ri => {
          message += `* ${ri.name}\n\n`;
        });
      }

      session.endDialog(message);
    }
  ])
  .triggerAction({
    // LUIS intent
    matches: "rides:all"
  });

export default lib;

export interface IWhichRideArgs {
  rideNames: ReadonlyArray<string>;
}
