import fs from "fs/promises";
import type { Result } from "./experiment";

// get first command line argument
const args = process.argv.slice(2);
const filename = args[0]!;

const text = await fs.readFile(filename, "utf8");
const data_parsed = JSON.parse(text);
const data: Result[] = data_parsed;

var corrects = 0;
var incorrects = 0;
var errors = 0;
var total = 0;

data.forEach((result) => {
  total++;
  if (result.correct === true) {
    corrects++;
  } else if (result.correct === false) {
    incorrects++;
  } else {
    errors++;
  }
});

console.log({ corrects, incorrects, errors, total });
