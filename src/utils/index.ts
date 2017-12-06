import { get } from "fast-levenshtein";

export function getClosestMatch(input: string, options: ReadonlyArray<string>) {
  let highestOptionValue = options[0];
  let highestOptionScore = get(highestOptionValue, input);

  options.forEach(o => {
    const score = get(o, input);

    if (score < highestOptionScore) {
      highestOptionValue = o;
      highestOptionScore = score;
    }
  });

  return highestOptionValue;
}
