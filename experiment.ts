import OpenAI from "openai";
import fs from "fs/promises";
import { randomUUID } from "crypto";
import { openai_apiKey } from "./secret";

const openai = new OpenAI({
  apiKey: openai_apiKey,
});

export type Result = {
  input: string;
  expected_output: string;
  actual_output: string;
  full_output: string;
  correct: boolean | undefined;
};

const results: Result[] = [];

function add_result(result: Result) {
  console.log(result);
  results.push(result);
}

async function test(a: number, x: number, b: number, y: number) {
  const input = `${a} * ${x} + ${b} * ${y}`;
  const expected_output = `${a * x + b * y}`;
  const response = await openai.chat.completions.create({
    // model: "gpt-4",
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          // "The user will provide a simple arithmetic expression. Your task is the evaluate the expression. Use any method you like to solve the problem. The very last line of your response should be JUST the number that is your final answer.",
          "The user will provide a simple arithmetic expression. Your task is the evaluate the expression. Use a step-by-step approach to solve the problem. The very last line of your response should be JUST the number that is your final answer.",
      },
      { role: "user", content: input },
    ],
  });

  try {
    const full_output = response.choices[0]!.message.content!;
    const actual_output = full_output.trim().split("\n").pop()!.trim();
    add_result({
      input,
      expected_output,
      actual_output,
      full_output,
      correct: `${a * x + b * y}` === actual_output,
    });
  } catch (error) {
    add_result({
      input,
      expected_output,
      actual_output: "Error",
      full_output: "Error",
      correct: undefined,
    });
  }
}

function randomNumberInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  for (let i = 0; i < 100; i++) {
    const a = randomNumberInRange(0, 100);
    const x = randomNumberInRange(0, 10000000000000);
    const b = randomNumberInRange(0, 100);
    const y = randomNumberInRange(0, 10000000000000);
    await test(a, x, b, y);
  }
  await fs.writeFile(`results/${randomUUID()}.json`, JSON.stringify(results));
}

main();
