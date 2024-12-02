/*
  --- Part Two ---

  The engineers are surprised by the low number of safe reports until they realize they forgot to tell you about the Problem Dampener.

  The Problem Dampener is a reactor-mounted module that lets the reactor safety systems tolerate a single bad level in what would otherwise be a safe report. It's like the bad level never happened!

  Now, the same rules apply as before, except if removing a single level from an unsafe report would make it safe, the report instead counts as safe.

  More of the above example's reports are now safe:

      7 6 4 2 1: Safe without removing any level.
      1 2 7 8 9: Unsafe regardless of which level is removed.
      9 7 6 2 1: Unsafe regardless of which level is removed.
      1 3 2 4 5: Safe by removing the second level, 3.
      8 6 4 4 1: Safe by removing the third level, 4.
      1 3 6 7 9: Safe without removing any level.

  Thanks to the Problem Dampener, 4 reports are actually safe!

  Update your analysis by handling situations where the Problem Dampener can remove a single level from unsafe reports. How many reports are now safe?
*/

const fs = require('fs').promises;

async function main() {

  // get the input file
  const data = await fs.readFile('input', 'utf8');

  const reports = data.trim().split('\n');

  // count safe reports
  let safe = 0;

  for (let report of reports) {
    // parse report
    const levels = report.split(' ');
    
    // check if safe, allowing also a dampener
    if (isSequenceSafe(levels) || canBecomeSafeWithDampener(levels)) {
      safe++;
    }
  }

  console.log(safe);
}

function isSequenceSafe(report) {
  // Check if the sequence is either strictly increasing or strictly decreasing
  let isAscending = null;

  for (let i = 0; i < report.length - 1; i++) {
    const diff = report[i] - report[i + 1];
    
    if (diff > 0) {
      if (isAscending === null) isAscending = false;
      if (isAscending !== false) return false; // Mixed directions
    } else if (diff < 0) {
      if (isAscending === null) isAscending = true;
      if (isAscending !== true) return false; // Mixed directions
    }
    
    // Check if the absolute difference is within the acceptable range
    if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
      return false;
    }
  }

  return true;
}

function canBecomeSafeWithDampener(report) {
  // Try removing each level and check if it makes the report safe,
  // this is a lazy solution since it's late and I want to go to
  // sleep.
  for (let i = 0; i < report.length; i++) {
    const modifiedReport = [...report.slice(0, i), ...report.slice(i + 1)];
    if (isSequenceSafe(modifiedReport)) {
      return true;
    }
  }
  return false;
}

main();