import { Library, Session } from "botbuilder";
import { format } from "util";
import { IRideWaitTime } from "../../models";
import { getWaitTimes } from "../../services/parks";
import strings from "../../strings";
import { getSelectedPark } from "../data/userData";

async function dialog(
  session: Session,
  createMessage: (waitTimes: IRideWaitTime[]) => string
) {
  session.sendTyping();

  // Casting as string to remove undefined since at this point it will be set.
  const park = getSelectedPark(session) as string;

  const waitTimes = await getWaitTimes(park);

  let message = strings.waitTimes.noData;

  if (waitTimes !== null) {
    message = createMessage(waitTimes);
  }

  session.endDialog(message);
}

function rideWaitTimeSort(a: IRideWaitTime, b: IRideWaitTime) {
  if (a.waitTime < b.waitTime) {
    return -1;
  }

  if (a.waitTime > b.waitTime) {
    return 1;
  }

  return 0;
}

function createRideWaitTimeMessage(w: IRideWaitTime) {
  const status = w.isRunning
    ? format(strings.waitTimes.time, w.waitTime)
    : strings.waitTimes.closed;

  return format(strings.waitTimes.waitTime, w.name, status);
}

const lib = new Library("waitTimes");

lib
  .dialog("all", async session => {
    function allMessage(waitTimes: IRideWaitTime[]) {
      let message = strings.waitTimes.all.message;

      waitTimes.forEach(w => {
        message += `* ${createRideWaitTimeMessage(w)}`;
      });

      return message;
    }

    await dialog(session, allMessage);
  })
  .triggerAction({
    // LUIS intent
    matches: "waitTimes:all"
  });

lib
  .dialog("shortest", async session => {
    function shortestMessage(waitTimes: IRideWaitTime[]) {
      const runningRides = waitTimes.filter(wt => wt.isRunning === true);

      let message = strings.waitTimes.allRidesClosed;

      if (runningRides.length > 0) {
        const shortest = runningRides.sort(rideWaitTimeSort)[0];

        message = format(
          strings.waitTimes.shortest.message,
          createRideWaitTimeMessage(shortest)
        );
      }

      return message;
    }

    await dialog(session, shortestMessage);
  })
  .triggerAction({
    // LUIS intent
    matches: "waitTimes:shortest"
  });

lib
  .dialog("longest", async session => {
    function longestMessage(waitTimes: IRideWaitTime[]) {
      const runningRides = waitTimes.filter(wt => wt.isRunning === true);

      let message = strings.waitTimes.allRidesClosed;

      if (runningRides.length > 0) {
        const longest = runningRides.sort(rideWaitTimeSort)[
          runningRides.length - 1
        ];

        message = format(
          strings.waitTimes.longest.message,
          createRideWaitTimeMessage(longest)
        );
      }

      return message;
    }

    await dialog(session, longestMessage);
  })
  .triggerAction({
    // LUIS intent
    matches: "waitTimes:longest"
  });

export default lib;
