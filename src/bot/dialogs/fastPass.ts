import { Library } from "botbuilder";
import { format } from "util";
import { getRidesInfo, supportsFastPass } from "../../services/parks";
import strings from "../../strings";
import { getSelectedPark } from "../data/userData";

const lib = new Library("fastPass");

lib
  .dialog("all", async session => {
    session.sendTyping();

    // Removing undefined since at this point it will be set.
    const park = getSelectedPark(session)!;

    let message = format(strings.fastPass.all.notSupported, park);

    if (supportsFastPass(park) === true) {
      let ridesInfo = await getRidesInfo(park);

      if (ridesInfo !== null) {
        message = strings.fastPass.all.message;

        ridesInfo = ridesInfo.filter(ri => ri.fastPass === true);

        ridesInfo.forEach(ri => {
          message += `* ${ri.name}\n\n`;
        });
      } else {
        message = strings.fastPass.commom.noData;
      }
    }

    session.endDialog(message);
  })
  .triggerAction({
    // LUIS intent
    matches: "fastPass:all"
  });

// TODO Specific ride

export default lib;
