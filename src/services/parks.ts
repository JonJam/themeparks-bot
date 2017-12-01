import moment = require("moment-timezone");
import { AllParks, Park } from "themeparks";
import { IParkOperatingHours } from "../models";

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

export async function getOperatingHours(
  parkName: string,
  date: moment.Moment
): Promise<IParkOperatingHours | null> {
  const park = parksMap.get(parkName) as Park;

  const openingTimes = await park.GetOpeningTimesPromise();

  const filteredSchedules = openingTimes.filter(schedule => {
    return moment(schedule.date).isSame(date);
  });

  if (filteredSchedules.length > 0) {
    const schedule = filteredSchedules[0];

    const opening = moment.tz(schedule.openingTime, park.Timezone);
    const closing = moment.tz(schedule.closingTime, park.Timezone);

    let additionalHours;

    if (schedule.special !== undefined) {
      additionalHours = schedule.special.map(s => {
        return {
          closing: moment.tz(s.closingTime, park.Timezone),
          description: s.type,
          opening: moment.tz(s.openingTime, park.Timezone)
        };
      });
    }

    let isOpen = false;

    if (schedule.type === "Operating") {
      const currentTimeInTimeZone = moment().tz(park.Timezone);

      isOpen = currentTimeInTimeZone.isBetween(opening, closing);

      if (
        !isOpen &&
        additionalHours &&
        additionalHours.find(a =>
          currentTimeInTimeZone.isBetween(a.opening, a.closing)
        )
      ) {
        // Current time is outside the normal park operating hours, if there are additional hours then
        // try find one for current time. If there is, then it is open.
        isOpen = true;
      }
    }

    return {
      additionalHours,
      closing,
      date,
      isOpen,
      opening
    };
  } else {
    return null;
  }
}
