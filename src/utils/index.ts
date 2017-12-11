import * as Fuse from "fuse.js";

const fuseOptions: Fuse.FuseOptions = {
  distance: 100,
  location: 0,
  maxPatternLength: 32,
  shouldSort: true,
  threshold: 0.5
};

export function getClosestMatch(input: string, options: string[]) {
  const searchEngine = new Fuse(options, fuseOptions);

  const results = searchEngine.search<number>(input);

  let match: string | null = null;

  if (results.length > 0) {
    match = options[results[0]];
  }

  return match;
}
