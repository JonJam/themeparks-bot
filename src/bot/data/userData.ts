import { IRecognizeContext, Session } from "botbuilder";

export function getSelectedPark(session: Session): string | undefined {
  return session.userData.selectedPark;
}

export function setSelectedPark(session: Session, park: string) {
  session.userData.selectedPark = park;
}

export function getFirstRun(context: IRecognizeContext): boolean | undefined {
  return context.userData.firstRun;
}

export function setFirstRun(session: Session, shown: boolean) {
  session.userData.firstRun = shown;
}
