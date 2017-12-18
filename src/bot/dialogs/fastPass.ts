import { EntityRecognizer, IEntity, Library } from "botbuilder";
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
        message = strings.fastPass.common.noData;
      }
    }

    session.endDialog(message);
  })
  .triggerAction({
    // LUIS intent
    matches: "fastPass:all"
  });

// TODO implement below
// TODO Remember to check fastpass on theme park

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

      let message = format(strings.fastPass.all.notSupported, park);

      if (supportsFastPass(park) === true) {
      }

      // const ridesInfo = await getRidesInfo(park);

      // if (ridesInfo !== null) {
      //   const rideNames = ridesInfo.map(ri => ri.name);
      //   session.dialogData.ridesInfo = ridesInfo;

      //   let rideName: string | null = null;

      //   if (rideNameEntity !== null) {
      //     // LUIS found a ride name.
      //     rideName = getClosestMatch(rideNameEntity.entity, rideNames);
      //   }

      //   if (rideName !== null) {
      //     const dialogResult: IDialogResult<string> = {
      //       response: rideName
      //     };

      //     // Removing undefined as we do have a next step.
      //     next!(dialogResult);
      //   } else {
      //     const whichRideArgs: IWhichRideArgs = {
      //       rideNames
      //     };

      //     session.beginDialog("rides:whichRide", whichRideArgs);
      //   }
      // } else {
      //   session.endDialog(strings.status.common.noData);
      // }
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
    matches: "fastPass:ride"
  });

export default lib;
