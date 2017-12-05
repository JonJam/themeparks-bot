import {
  EntityRecognizer,
  IDialogResult,
  IEntity,
  IFindMatchResult,
  IPromptChoiceResult,
  IPromptConfirmResult,
  Library,
  ListStyle,
  Prompts
} from "botbuilder";
import moment = require("moment-timezone");
import { format } from "util";
import {
  getOperatingHours,
  getWaitTimes,
  parkNames
} from "../../services/parks";
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

lib
  .dialog("operatingHours", async (session, args) => {
    session.sendTyping();

    const intent = args.intent;
    const dateEntity: IEntity | null = EntityRecognizer.findEntity(
      intent.entities,
      "builtin.datetimeV2.date"
    );

    let date = moment().startOf("day");

    if (dateEntity !== null) {
      // Getting parsed date value from utterance.
      date = moment((dateEntity as any).resolution.values[0].value);
    }

    // Casting as string to remove undefined since at this point it will be set.
    const park = getSelectedPark(session) as string;

    const operatingHours = await getOperatingHours(park, date);

    let message = "";
    if (operatingHours === null) {
      message = strings.parks.operatingHours.noData;
    } else {
      message = format(
        strings.parks.operatingHours.operatingHoursMessage,
        park,
        operatingHours.isOpen
          ? strings.parks.operatingHours.open
          : strings.parks.operatingHours.closed,
        operatingHours.opening.format("LT z"),
        operatingHours.closing.format("LT z"),
        operatingHours.date.format("L")
      );

      if (operatingHours.additionalHours !== undefined) {
        message += strings.parks.operatingHours.additionalHoursMessage;

        operatingHours.additionalHours.forEach(a => {
          message += `**${a.description}**\n`;
          message += format(
            strings.parks.operatingHours.startsAt,
            a.opening.format("LT z")
          );
          message += format(
            strings.parks.operatingHours.endsAt,
            a.closing.format("LT z")
          );
        });
      }
    }

    session.endDialog(message);
  })
  .triggerAction({
    // LUIS intent
    matches: "parks:operatingHours"
  });

lib
  .dialog("waittimes", async session => {
    session.sendTyping();

    // Casting as string to remove undefined since at this point it will be set.
    const park = getSelectedPark(session) as string;

    const waitTimes = await getWaitTimes(park);

    let message = strings.parks.waitTimes.noData;

    if (waitTimes !== null) {
      message = strings.parks.waitTimes.message;

      waitTimes.forEach(w => {
        const status = w.isRunning
          ? format(strings.parks.waitTimes.time, w.waitTime)
          : strings.parks.waitTimes.closed;
        message += format(strings.parks.waitTimes.waitTime, w.name, status);
      });
    }

    session.endDialog(message);
  })
  .triggerAction({
    // LUIS intent
    matches: "parks:waitTimes"
  });

export default lib;
