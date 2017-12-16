import {
  EntityRecognizer,
  IDialogResult,
  IEntity,
  IPromptChoiceResult,
  Library,
  ListStyle,
  Prompts
} from "botbuilder";
import { format } from "util";
import { RideStatus } from "../../models";
import { getRidesInfo, supportsFastPass } from "../../services/parks";
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

// TODO refactor below to use common function

lib
  .dialog("all", async session => {
    session.sendTyping();

    // Removing undefined since at this point it will be set.
    const park = getSelectedPark(session)!;

    const ridesInfo = await getRidesInfo(park);

    let message = strings.rides.commom.noData;

    if (ridesInfo !== null) {
      message = strings.rides.all.message;

      ridesInfo.forEach(ri => {
        message += `* ${ri.name}\n\n`;
      });
    }

    session.endDialog(message);
  })
  .triggerAction({
    // LUIS intent
    matches: "rides:all"
  });

lib
  .dialog("fastPass", async session => {
    session.sendTyping();

    // Removing undefined since at this point it will be set.
    const park = getSelectedPark(session)!;

    let message = format(strings.rides.fastPass.notSupported, park);

    if (supportsFastPass(park) === true) {
      let ridesInfo = await getRidesInfo(park);

      if (ridesInfo !== null) {
        message = strings.rides.fastPass.message;

        ridesInfo = ridesInfo.filter(ri => ri.fastPass === true);

        ridesInfo.forEach(ri => {
          message += `* ${ri.name}\n\n`;
        });
      } else {
        message = strings.rides.commom.noData;
      }
    }

    session.endDialog(message);
  })
  .triggerAction({
    // LUIS intent
    matches: "rides:fastPass"
  });

lib
  .dialog("status", async (session, args) => {
    session.sendTyping();

    const rideStatusEntity: IEntity = EntityRecognizer.findEntity(
      args.intent.entities,
      "rideStatus"
    );
    const status: RideStatus = rideStatusEntity.entity;

    // Removing undefined since at this point it will be set.
    const park = getSelectedPark(session)!;

    let ridesInfo = await getRidesInfo(park);

    let message = strings.rides.commom.noData;

    if (ridesInfo !== null) {
      let isRunning = true;
      if (status === RideStatus.Open) {
        message = strings.rides.status.openMessage;
      } else {
        message = strings.rides.status.closedMessage;
        isRunning = false;
      }

      ridesInfo = ridesInfo.filter(ri => ri.isRunning === isRunning);

      ridesInfo.forEach(ri => {
        message += `* ${ri.name}\n\n`;
      });
    }

    session.endDialog(message);
  })
  .triggerAction({
    // LUIS intent
    matches: "rides:status"
  });

export default lib;

export interface IWhichRideArgs {
  rideNames: ReadonlyArray<string>;
}
