import { CardAction, Library, Message, SuggestedActions } from "botbuilder";
import themeparks from "themeparks";

const lib = new Library("parks");

lib.dialog("whichPark", [
  function(session) {
    // TODO Replace with strings
    // TODO Handling a result which isn't expected.

    // https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-send-suggested-actions
    const message = new Message(session)
      .text("Which park are you interested in?")
      .suggestedActions(
        SuggestedActions.create(session, [
          CardAction.imBack(session, "productId=1&color=green", "Green"),
          CardAction.imBack(session, "productId=1&color=blue", "Blue"),
          CardAction.imBack(session, "productId=1&color=red", "Red")
        ])
      );

    session.send(message);
  },
  function(session, results) {
    session.endDialogWithResult(results);
  }
]);

export default lib;
