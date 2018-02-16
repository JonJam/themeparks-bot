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
  park: string,
  createMessage: (waitTimes: IRideWaitTime[]) => string
) {
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
  .dialog("all", [
    // tslint:disable-next-line:variable-name
    (session, _result, skip) => {
      session.sendTyping();

      const park = getSelectedPark(session);

      if (park === undefined) {
        session.beginDialog("parks:whichPark");
      } else {
        const result: IDialogResult<string> = {
          response: park
        };

        skip!(result);
      }
    },
    async (session, result: IDialogResult<string>) => {
      session.sendTyping();

      function allMessage(waitTimes: IRideWaitTime[]) {
        let message = strings.waitTimes.all.message;

        waitTimes.forEach(w => {
          message += `* ${createRideWaitTimeMessage(w)}`;
        });

        return message;
      }

      // Removing undefined as we have either obtained this from the user or from storage.
      const park = result.response!;

      await dialog(session, park, allMessage);
    }
  ])
  .triggerAction({
    // LUIS intent
    matches: "waitTimes:all"
  });

lib
  .dialog("shortest", [
    // tslint:disable-next-line:variable-name
    (session, _result, skip) => {
      session.sendTyping();

      const park = getSelectedPark(session);

      if (park === undefined) {
        session.beginDialog("parks:whichPark");
      } else {
        const result: IDialogResult<string> = {
          response: park
        };

        skip!(result);
      }
    },
    async (session, result: IDialogResult<string>) => {
      session.sendTyping();

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

      // Removing undefined as we have either obtained this from the user or from storage.
      const park = result.response!;

      await dialog(session, park, shortestMessage);
    }
  ])
  .triggerAction({
    // LUIS intent
    matches: "waitTimes:shortest"
  });

lib
  .dialog("longest", [
    // tslint:disable-next-line:variable-name
    (session, _result, skip) => {
      session.sendTyping();

      const park = getSelectedPark(session);

      if (park === undefined) {
        session.beginDialog("parks:whichPark");
      } else {
        const result: IDialogResult<string> = {
          response: park
        };

        skip!(result);
      }
    },

    async (session, result) => {
      session.sendTyping();

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

      // Removing undefined as we have either obtained this from the user or from storage.
      const park = result.response!;

      await dialog(session, park, longestMessage);
    }
  ])
  .triggerAction({
    // LUIS intent
    matches: "waitTimes:longest"
  });

lib
  .dialog("ride", [
    (session, result, skip) => {
      session.sendTyping();

      session.dialogData.rideNameEntity = EntityRecognizer.findEntity(
        result.intent.entities,
        "rideName"
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

    async (session, result, skip) => {
      session.sendTyping();

      // Removing undefined as we have either obtained this from the user or from storage.
      const park = result.response!;
      const rideNameEntity: IEntity | null = session.dialogData.rideNameEntity;

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
          skip!(dialogResult);
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
      const rideName = result.response;

      const waitTimes: IRideWaitTime[] = session.dialogData.waitTimes;

      // Removing undefined as the park name comes from this list.
      const rideWaitTime = waitTimes.find(wt => wt.name === rideName)!;

      session.endDialog(createRideWaitTimeMessage(rideWaitTime));
    }
  ])
  .triggerAction({
    // LUIS intent
    matches: "waitTimes:ride"
  });

export default lib;
