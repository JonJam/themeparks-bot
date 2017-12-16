import { EntityRecognizer, IEntity, Library } from "botbuilder";
import { RideStatus } from "../../models";
import { getRidesInfo } from "../../services/parks";
import strings from "../../strings";
import { getSelectedPark } from "../data/userData";

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

    let message = strings.status.commom.noData;

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

export default lib;
