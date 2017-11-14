import { Library } from "botbuilder";

// TODO Rename file and library
const lib = new Library("messages");

lib.dialog("goodbye", [
  session => {
    session.send("Bye.");
  }
]);

export default lib;
