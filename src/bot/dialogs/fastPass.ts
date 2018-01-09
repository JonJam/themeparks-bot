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
      // Removing undefined as we have either obtained this from the user or from storage.
      const park = result.response!;

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
    }
  ])
  .triggerAction({
    // LUIS intent
    matches: "fastPass:all"
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
    async (session, result: IDialogResult<string>, skip) => {
      const rideNameEntity: IEntity | null = session.dialogData.rideNameEntity;
      // Removing undefined as we have either obtained this from the user or from storage.
      const park = result.response!;

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
          skip!(dialogResult);
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
      const rideName = result.response;

      const ridesInfo: IRideInfo[] = session.dialogData.ridesInfo;

      // Removing undefined as the park name comes from this list.
      const rideInfo = ridesInfo.find(ri => ri.name === rideName)!;

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
