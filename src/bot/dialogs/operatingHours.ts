import { EntityRecognizer, IDialogResult, IEntity, Library } from "botbuilder";
import * as moment from "moment-timezone";
import { format } from "util";
import { getOperatingHours } from "../../services/parks";
import strings from "../../strings";
import { getSelectedPark } from "../data/userData";

const lib = new Library("operatingHours");

lib
  .dialog("park", [
    (session, result, skip) => {
      session.sendTyping();

      session.dialogData.dateEntity = EntityRecognizer.findEntity(
        result.intent.entities,
        "builtin.datetimeV2.date"
      );

      const park = getSelectedPark(session);

      if (park === undefined) {
        session.beginDialog("parks:whichPark");
      } else {
        const dialogResult: IDialogResult<string> = {
          response: park
        };

        skip!(dialogResult);
      }
    },
    async (session, result: IDialogResult<string>) => {
      session.sendTyping();

      const dateEntity: IEntity | null = session.dialogData.dateEntity;
      // Removing undefined as we have either obtained this from the user or from storage.
      const park = result.response!;

      let date = moment().startOf("day");

      if (dateEntity !== null) {
        // Getting parsed date value from utterance.
        date = moment((dateEntity as any).resolution.values[0].value);
      }

      const operatingHours = await getOperatingHours(park, date);

      let message = strings.operatingHours.park.noData;

      if (operatingHours !== null) {
        message = format(
          strings.operatingHours.park.operatingHoursMessage,
          park,
          operatingHours.isOpen
            ? strings.operatingHours.park.open
            : strings.operatingHours.park.closed,
          operatingHours.opening.format("LT z"),
          operatingHours.closing.format("LT z"),
          operatingHours.date.format("L")
        );

        if (operatingHours.additionalHours !== undefined) {
          message += strings.operatingHours.park.additionalHoursMessage;

          operatingHours.additionalHours.forEach(a => {
            message += `**${a.description}**\n`;
            message += format(
              strings.operatingHours.park.startsAt,
              a.opening.format("LT z")
            );
            message += format(
              strings.operatingHours.park.endsAt,
              a.closing.format("LT z")
            );
          });
        }
      }

      session.endDialog(message);
    }
  ])
  .triggerAction({
    // LUIS intent
    matches: "operatingHours:park"
  });

export default lib;
