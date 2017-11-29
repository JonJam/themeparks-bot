import { AllParks, Park } from "themeparks";
import moment = require("moment");
import { IParkHours } from "../models";

// Map of theme park name to class.
const parksMap = new Map<string, Park>(
  AllParks.map(ParkClass => {
    // Creating to get name of park.
    const park = new ParkClass();

    // TODO: This seems smelly that storing all created Park objects.
    return [park.Name, park] as [string, Park];
  })
);

const names: string[] = [];

for (const key of parksMap.keys()) {
  names.push(key);
}

export const parkNames: ReadonlyArray<string> = names.sort((a, b) => {
  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;
});

export async function getOpenAndCloseTimes(
  parkName: string,
  date: moment.Moment
): Promise<IParkHours | null> {
  const park = parksMap.get(parkName) as Park;

  const openingTimes = await park.GetOpeningTimesPromise();

  const filteredSchedules = openingTimes.filter(schedule => {
    return moment(schedule.date).isSame(date);
  });

  if (filteredSchedules.length > 0) {
    const schedule = filteredSchedules[0];

    let additionalHours = undefined;

    if (schedule.special !== undefined) {
      additionalHours = schedule.special.map(s => {
        return {
          opening: moment(s.openingTime),
          closing: moment(s.closingTime),
          description: s.type
        };
      });
    }

    return {
      date: moment(schedule.date),
      opening: moment(schedule.openingTime),
      closing: moment(schedule.closingTime),
      isOpen: schedule.type === "Operating",
      additionalHours
    };
  } else {
    return null;
  }
}
