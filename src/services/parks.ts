import themeparks = require("themeparks");

// Map of theme park name to class.
const parksMap = new Map(
  themeparks.AllParks.map(Park => {
    // Creating to get name of park.
    const park = new Park();

    // TODO Replace any with Park from themeparks
    return [park.Name, Park] as [string, any];
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
