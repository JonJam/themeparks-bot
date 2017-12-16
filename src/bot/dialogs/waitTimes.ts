import {
  EntityRecognizer,
  IDialogResult,
  IEntity,
  Library,
  Session
} from "botbuilder";
import { format } from "util";
import { IRideWaitTime } from "../../models";
import { getWaitTimes } from "../../services/parks";
import strings from "../../strings";
import { getClosestMatch } from "../../utils";
import { getSelectedPark } from "../data/userData";
import { IWhichRideArgs } from "./rides";

async function dialog(
  session: Session,
  createMessage: (waitTimes: IRideWaitTime[]) => string
) {
  session.sendTyping();

  // Removing undefined since at this point it will be set.
  const park = getSelectedPark(session)!;

  const waitTimes = await getWaitTimes(park);

  let message = strings.waitTimes.common.noData;

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
    ? format(strings.waitTimes.common.time, w.waitTime)
    : strings.waitTimes.common.closed;

  return format(strings.waitTimes.common.waitTime, w.name, status);
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

      let message = strings.waitTimes.common.allRidesClosed;

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

      let message = strings.waitTimes.common.allRidesClosed;

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

lib
  .dialog("ride", [
    async (session, args, next) => {
      session.sendTyping();

      const rideNameEntity: IEntity | null = EntityRecognizer.findEntity(
        args.intent.entities,
        "rideName"
      );

      // Removing undefined since at this point it will be set.
      const park = getSelectedPark(session)!;

      const waitTimes = await getWaitTimes(park);

      if (waitTimes !== null) {
        const rideNames = waitTimes.map(wt => wt.name);
        session.dialogData.waitTimes = waitTimes;

        let rideName: string | null = null;

        if (rideNameEntity !== null) {
          // LUIS found a ride name.
          rideName = getClosestMatch(rideNameEntity.entity, rideNames);
        }

        if (rideName !== null) {
          const dialogResult: IDialogResult<string> = {
            response: rideName
          };

          // Removing undefined as we do have a next step.
          next!(dialogResult);
        } else {
          const whichRideArgs: IWhichRideArgs = {
            rideNames
          };

          session.beginDialog("rides:whichRide", whichRideArgs);
        }
      } else {
        session.endDialog(strings.waitTimes.common.noData);
      }
    },
    (session, result: IDialogResult<string>) => {
      const parkName = result.response;

      const waitTimes: IRideWaitTime[] = session.dialogData.waitTimes;

      // Removing undefined as the park name comes from this list.
      const rideWaitTime = waitTimes.find(wt => wt.name === parkName)!;

      session.endDialog(createRideWaitTimeMessage(rideWaitTime));
    }
  ])
  .triggerAction({
    // LUIS intent
    matches: "waitTimes:ride"
  });

export default lib;
