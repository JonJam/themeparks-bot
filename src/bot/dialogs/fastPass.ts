import { Library } from "botbuilder";
import { getSelectedPark } from "../data/userData";
import { getFastPassTimes, supportsFastPass } from "../../services/parks";

const lib = new Library("fastpass");

lib
  .dialog("all", [
    async session => {
      session.sendTyping();

      // Removing undefined since at this point it will be set.
      const park = getSelectedPark(session)!;

      // TODO Use strings and update message.
      let message = "Doesnt support fast pass";

      // TODO check if park supports fastpass
      if (supportsFastPass(park) === true) {
        // TODO get fast pass info
        await getFastPassTimes(park);
        message = "It does support fast pass";
      }

      session.endDialog(message);
    }
  ])
  .triggerAction({
    // LUIS intent
    matches: "fastPass:all"
  });

export default lib;
