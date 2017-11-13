import { Session } from "botbuilder";

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
export default function defaultDialog(session: Session) {
  session.send("You said: %s", session.message.text);
}
