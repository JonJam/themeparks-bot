import { EntityRecognizer, IDialogResult, IEntity, Library } from "botbuilder";
import { format } from "util";
import { IRideInfo, RideStatus } from "../../models";
import { getRidesInfo } from "../../services/parks";
import strings from "../../strings";
import { getClosestMatch } from "../../utils";
import { getSelectedPark } from "../data/userData";
import { IWhichRideArgs } from "./rides";

const lib = new Library("status");

lib
  .dialog("all", async (session, args) => {
    session.sendTyping();

    const rideStatusEntity: IEntity = EntityRecognizer.findEntity(
      args.intent.entities,
      "rideStatus"
    );
    const status: RideStatus = rideStatusEntity.entity;

    // Removing undefined since at this point it will be set.
    const park = getSelectedPark(session)!;

    let ridesInfo = await getRidesInfo(park);

    let message = strings.status.common.noData;

    if (ridesInfo !== null) {
      let isRunning = true;
      if (status === RideStatus.Open) {
        message = strings.status.all.openMessage;
      } else {
        message = strings.status.all.closedMessage;
        isRunning = false;
      }

      ridesInfo = ridesInfo.filter(ri => ri.isRunning === isRunning);

      ridesInfo.forEach(ri => {
        message += `* ${ri.name}\n\n`;
      });
    }

    session.endDialog(message);
  })
  .triggerAction({
    // LUIS intent
    matches: "status:all"
  });

lib
  .dialog("ride", [
    async (session, args, next) => {
      session.sendTyping();

      const rideStatusEntity: IEntity = EntityRecognizer.findEntity(
        args.intent.entities,
        "rideStatus"
      );
      const rideNameEntity: IEntity | null = EntityRecognizer.findEntity(
        args.intent.entities,
        "rideName"
      );

      session.dialogData.status = rideStatusEntity.entity;

      // Removing undefined since at this point it will be set.
      const park = getSelectedPark(session)!;

      const ridesInfo = await getRidesInfo(park);

      if (ridesInfo !== null) {
        const rideNames = ridesInfo.map(ri => ri.name);
        session.dialogData.ridesInfo = ridesInfo;

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
        session.endDialog(strings.status.common.noData);
      }
    },
    (session, result: IDialogResult<string>) => {
      const parkName = result.response;

      const ridesInfo: IRideInfo[] = session.dialogData.ridesInfo;
      const status: RideStatus = session.dialogData.status;

      // Removing undefined as the park name comes from this list.
      const rideInfo = ridesInfo.find(ri => ri.name === parkName)!;

      let yesNo = "";

      if (status === RideStatus.Open) {
        yesNo = rideInfo.isRunning
          ? strings.status.ride.yes
          : strings.status.ride.no;
      } else {
        yesNo = !rideInfo.isRunning
          ? strings.status.ride.yes
          : strings.status.ride.no;
      }

      const message = format(
        strings.status.ride.message,
        yesNo,
        rideInfo.name,
        rideInfo.isRunning ? strings.status.ride.open : strings.status.ride.open
      );

      session.endDialog(message);
    }
  ])
  .triggerAction({
    // LUIS intent
    matches: "status:ride"
  });

export default lib;
