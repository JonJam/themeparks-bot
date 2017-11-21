import { CardAction, Library, Message, SuggestedActions } from "botbuilder";
import { suggestedParks } from "../../services/parks";

const lib = new Library("parks");

lib.dialog("whichPark", [
  function(session) {
    const suggestedActions: CardAction[] = suggestedParks.map(parkName => {
      return CardAction.imBack(session, parkName, parkName);
    });

    // https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-send-suggested-actions
    const message = new Message(session)
      // TODO replace with strings
      .text("Which park are you interested in? For example:")
      .suggestedActions(SuggestedActions.create(session, suggestedActions));

    session.send(message);
  },
  function(session, results) {
    // TODO handle a result which isn't expected.
    // TODO Handle ambigious e.g. Magic Kingdom whether it is paris or orlando.
    session.endDialogWithResult(results);
  }
]);

export default lib;
