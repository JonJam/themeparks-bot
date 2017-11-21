import { CardAction, Library, Message, SuggestedActions } from "botbuilder";
// import themeparks = require("themeparks");

const lib = new Library("parks");

lib.dialog("whichPark", [
  function(session) {
    // https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-send-suggested-actions
    const message = new Message(session)
      // TODO replace with strings
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
    // TODO handle a result which isn't expected.
    session.endDialogWithResult(results);
  }
]);

export default lib;
