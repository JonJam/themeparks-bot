import themeparks = require("themeparks");
import moment = require("moment");

// Map of theme park name to class.
const parksMap = new Map(
  themeparks.AllParks.map(Park => {
    // Creating to get name of park.
    const park = new Park();

    // TODO: This seems smelly that storing all created Park objects.
    return [park.Name, park] as [string, typeof park];
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
) {
  const openingTimes = await parksMap.get(parkName).GetOpeningTimesPromise();

  const filteredSchedules = openingTimes.filter(schedule => {
    return moment(schedule.date).isSame(date);
  });

  if (filteredSchedules.length > 0) {
    // TODO unpack result

    return filteredSchedules[0];
  } else {
    return null;
  }
}
