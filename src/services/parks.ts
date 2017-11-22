import themeparks = require("themeparks");

// Map of theme park name to class.
export const parksMap = new Map(
  themeparks.AllParks.map(Park => {
    // Creating to get name of park.
    const park = new Park();

    // TODO Replace any with Park from themeparks
    return [park.Name, Park] as [string, any];
  })
);
