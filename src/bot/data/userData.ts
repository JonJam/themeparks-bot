import { Session } from "botbuilder";

export function getSelectedPark(session: Session): string | undefined {
  return session.userData.selectedPark;
}

export function setSelectedPark(session: Session, park: string) {
  session.userData.selectedPark = park;
}

export function getShownWelcomeNewUserMessage(
  session: Session
): boolean | undefined {
  return session.userData.shownWelcomeNewUserMessage;
}

export function setShownWelcomeNewUserMessage(
  session: Session,
  shown: boolean
) {
  session.userData.shownWelcomeNewUserMessage = shown;
}
