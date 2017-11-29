import moment = require("moment");

export interface IParkHours {
  date: moment.Moment;
  opening: moment.Moment;
  closing: moment.Moment;
  isOpen: boolean;
  additionalHours?: IAdditionalParkHours[];
}

interface IAdditionalParkHours {
  opening: moment.Moment;
  closing: moment.Moment;
  description: string;
}
