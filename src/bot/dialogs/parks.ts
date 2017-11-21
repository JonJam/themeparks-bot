import { CardAction, Library, Message, SuggestedActions } from "botbuilder";
import themeparks = require("themeparks");

// TODO Move to another module
// TODO Figure out how to use Park from themeparks
const parks = new Map<string, any>();

// TODO Sort this.
// TODO limit to some of the most popular ones
themeparks.AllParks.forEach(Park => {
  const park = new Park();

  parks.set(park.Name, park);
});

const lib = new Library("parks");

lib.dialog("whichPark", [
  function(session) {
    // TODO refactor this.
    const suggestedActions: CardAction[] = [];

    parks.forEach((_val, key) => {
      suggestedActions.push(CardAction.imBack(session, key, key));
    });

    // https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-send-suggested-actions
    const message = new Message(session)
      // TODO replace with strings
      // TODO Update text to say some examples are:
      .text("Which park are you interested in?")
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
