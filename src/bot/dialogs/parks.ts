import {
  EntityRecognizer,
  IDialogResult,
  IPromptChoiceResult,
  IPromptConfirmResult,
  Library,
  ListStyle,
  Prompts,
  IEntity
} from "botbuilder";
import { parkNames, getOpenAndCloseTimes } from "../../services/parks";
import strings from "../../strings";
import { getSelectedPark } from "../data/userData";
import moment = require("moment");

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
  session => {
    const parkName = getSelectedPark(session);

    const prompt = `${strings.parks.stillInterestedInPark
      .prompt1}${parkName}${strings.parks.stillInterestedInPark.prompt2}`;

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
  .dialog("parks:openAndCloseTimes", async (session, args) => {
    session.sendTyping();

    const intent = args.intent;
    const dateEntity: IEntity | null = EntityRecognizer.findEntity(
      intent.entities,
      "builtin.datetimeV2.date"
    );

    let date = moment();

    if (dateEntity !== null) {
      // Getting parsed date value from utterance.
      date = moment((dateEntity as any).resolution.values[0].value);
    }

    const park = getSelectedPark(session);

    const schedule = await getOpenAndCloseTimes(park, date);

    session.endDialog(JSON.stringify(schedule));
  })
  .triggerAction({
    // LUIS intent
    matches: "parks:openAndCloseTimes"
  });

export default lib;
