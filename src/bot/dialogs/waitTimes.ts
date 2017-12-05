import { Library } from "botbuilder";
import { format } from "util";
import { IRideWaitTime } from "../../models";
import { getWaitTimes } from "../../services/parks";
import strings from "../../strings";
import { getSelectedPark } from "../data/userData";

function createRideWaitTimeMessage(w: IRideWaitTime) {
  const status = w.isRunning
    ? format(strings.waitTimes.time, w.waitTime)
    : strings.waitTimes.closed;

  return format(strings.waitTimes.waitTime, w.name, status);
}

const lib = new Library("waitTimes");

lib
  .dialog("all", async session => {
    session.sendTyping();

    // Casting as string to remove undefined since at this point it will be set.
    const park = getSelectedPark(session) as string;

    const waitTimes = await getWaitTimes(park);

    let message = strings.waitTimes.all.noData;

    if (waitTimes !== null) {
      message = strings.waitTimes.all.message;

      waitTimes.forEach(w => {
        message += `* ${createRideWaitTimeMessage(w)}`;
      });
    }

    session.endDialog(message);
  })
  .triggerAction({
    // LUIS intent
    matches: "waitTimes:all"
  });

lib
  .dialog("shortest", async session => {
    session.sendTyping();

    // Casting as string to remove undefined since at this point it will be set.
    const park = getSelectedPark(session) as string;

    const waitTimes = await getWaitTimes(park);

    let message = strings.waitTimes.shortest.noData;

    if (waitTimes !== null) {
      const runningRides = waitTimes.filter(wt => wt.isRunning === true);

      if (runningRides.length > 0) {
        const shortest = runningRides.sort((a, b) => {
          if (a.waitTime < b.waitTime) {
            return -1;
          }

          if (a.waitTime > b.waitTime) {
            return 1;
          }

          return 0;
        })[0];

        message = format(
          strings.waitTimes.shortest.message,
          createRideWaitTimeMessage(shortest)
        );
      } else {
        message = strings.waitTimes.shortest.allRidesClosed;
      }
    }

    session.endDialog(message);
  })
  .triggerAction({
    // LUIS intent
    matches: "waitTimes:shortest"
  });

export default lib;
