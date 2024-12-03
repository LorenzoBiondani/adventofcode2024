/*
  --- Part Two ---

  As you scan through the corrupted memory, you notice that some of the conditional statements are also still intact. If you handle some of the uncorrupted conditional statements in the program, you might be able to get an even more accurate result.

  There are two new instructions you'll need to handle:

      The do() instruction enables future mul instructions.
      The don't() instruction disables future mul instructions.

  Only the most recent do() or don't() instruction applies. At the beginning of the program, mul instructions are enabled.

  For example:

  xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))

  This corrupted memory is similar to the example from before, but this time the mul(5,5) and mul(11,8) instructions are disabled because there is a don't() instruction before them. The other mul instructions function normally, including the one at the end that gets re-enabled by a do() instruction.

  This time, the sum of the results is 48 (2*4 + 8*5).

  Handle the new instructions; what do you get if you add up all of the results of just the enabled multiplications?
*/

const fs = require('fs').promises;

async function main() {

  // get the input file
  const data = await fs.readFile('input', 'utf8');

  // time to pull out a magic regex, also match
  // do and don't statements
  // the match creates a structure like this:
  // [0] complete match -> mul(100,200)
  // [1] command -> mul
  // [2] first number -> 100 (only if command = mul)
  // [3] second number -> 200 (only if command = mul)
  // [4] command -> do
  // [5] command -> don't
  // I can't figure out how to make all of the commands
  // evaluate in the same group, I don't really care
  const validOperations = data.matchAll(/(mul)\((\d{1,3}),(\d{1,3})\)|(do)\(\)|(don't)\(\)/g);

  // keep track of total
  let total = 0;

  let isComputationEnabled = true;
  
  for (const operation of validOperations) {

    // match the command
    switch (operation[1]??operation[4]??operation[5]) {
      case 'mul':
        // check if computation is enabled
        if (!isComputationEnabled) continue;

        // calculate multiplication value and add it to the total
        total += parseInt(operation[2]) * parseInt(operation[3]);
        break;
      case 'do':
        // enable computation
        isComputationEnabled = true;
        break;
      case 'don\'t':
        // disable computation
        isComputationEnabled = false;
        break;
    }
  }

  console.log(total);
}

main ();