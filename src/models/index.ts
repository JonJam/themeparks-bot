import * as moment from "moment-timezone";

interface IAdditionalParkOperatingHours {
  opening: moment.Moment;
  closing: moment.Moment;
  description: string;
}

export interface IParkOperatingHours {
  date: moment.Moment;
  opening: moment.Moment;
  closing: moment.Moment;
  isOpen: boolean;
  additionalHours?: IAdditionalParkOperatingHours[];
}

export interface IRideWaitTime {
  name: string;
  waitTime: number;
  isRunning: boolean;
}

export interface IRideInfo {
  name: string;
  fastPass: boolean;
  isRunning: boolean;
}

// This matches the status LUIS entity.
export enum Status {
  Closed = "closed",
  Open = "open"
}
