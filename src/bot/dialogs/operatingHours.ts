import { EntityRecognizer, IEntity, Library } from "botbuilder";
import moment = require("moment-timezone");
import { format } from "util";
import { getOperatingHours } from "../../services/parks";
import strings from "../../strings";
import { getSelectedPark } from "../data/userData";

const lib = new Library("operatingHours");

lib
  .dialog("park", async (session, args) => {
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
      message = strings.operatingHours.park.noData;
    } else {
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
  })
  .triggerAction({
    // LUIS intent
    matches: "operatingHours:park"
  });

export default lib;
