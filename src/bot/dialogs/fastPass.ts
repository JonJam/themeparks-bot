import { EntityRecognizer, IDialogResult, IEntity, Library } from "botbuilder";
import { format } from "util";
import { IRideInfo } from "../../models";
import { getRidesInfo, supportsFastPass } from "../../services/parks";
import strings from "../../strings";
import { getClosestMatch } from "../../utils";
import { getSelectedPark } from "../data/userData";
import { IWhichRideArgs } from "./rides";

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
        message = strings.fastPass.common.noData;
      }
    }

    session.endDialog(message);
  })
  .triggerAction({
    // LUIS intent
    matches: "fastPass:all"
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
        session.endDialog(strings.fastPass.common.noData);
      }
    },
    (session, result: IDialogResult<string>) => {
      const parkName = result.response;

      const ridesInfo: IRideInfo[] = session.dialogData.ridesInfo;

      // Removing undefined as the park name comes from this list.
      const rideInfo = ridesInfo.find(ri => ri.name === parkName)!;

      const message = format(
        rideInfo.fastPass === true
          ? strings.fastPass.ride.yesMessage
          : strings.fastPass.ride.noMessage,
        rideInfo.name
      );

      session.endDialog(message);
    }
  ])
  .triggerAction({
    // LUIS intent
    matches: "fastPass:ride"
  });

export default lib;
