import moment = require("moment-timezone");

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

export interface IRideFastPassTime {
  name: string;
  isAvailable: boolean;
  startTime: moment.Moment | null;
  endTime: moment.Moment | null;
}

export interface IRideWaitTime {
  name: string;
  waitTime: number;
  isRunning: boolean;
}
