/*
  --- Day 4: Ceres Search ---

  "Looks like the Chief's not here. Next!" One of The Historians pulls out a device and pushes the only button on it. After a brief flash, you recognize the interior of the Ceres monitoring station!

  As the search for the Chief continues, a small Elf who lives on the station tugs on your shirt; she'd like to know if you could help her with her word search (your puzzle input). She only has to find one word: XMAS.

  This word search allows words to be horizontal, vertical, diagonal, written backwards, or even overlapping other words. It's a little unusual, though, as you don't merely need to find one instance of XMAS - you need to find all of them. Here are a few ways XMAS might appear, where irrelevant characters have been replaced with .:

  ..X...
  .SAMX.
  .A..A.
  XMAS.S
  .X....

  The actual word search will be full of letters instead. For example:

  MMMSXXMASM
  MSAMXMSMSA
  AMXSXMAAMM
  MSAMASMSMX
  XMASAMXAMM
  XXAMMXXAMA
  SMSMSASXSS
  SAXAMASAAA
  MAMMMXMMMM
  MXMXAXMASX

  In this word search, XMAS occurs a total of 18 times; here's the same word search again, but where letters not involved in any XMAS have been replaced with .:

  ....XXMAS.
  .SAMXMS...
  ...S..A...
  ..A.A.MS.X
  XMASAMX.MM
  X.....XA.A
  S.S.S.S.SS
  .A.A.A.A.A
  ..M.M.M.MM
  .X.X.XMASX

  Take a look at the little Elf's word search. How many times does XMAS appear?
*/

const fs = require('fs').promises;

const wordToLookFor = 'XMAS';

async function main() {

  // get the input file
  const data = await fs.readFile('input', 'utf8');

  // build the board into an easy to navigate stucture
  board = [];
  const rows = data.split('\n');
  rows.forEach((row) => {
    board.push(row.split(''));
  });

  const wordSize = wordToLookFor.length;

  // find coordinates of first letter
  const firstLetter = wordToLookFor[0];

  // traverse entire board to find first letter
  // locations
  const firstLetterCoordinates = traverseBoardToFindLetter(board, firstLetter);
  const lastLetter = wordToLookFor[wordToLookFor.length - 1];

  const trails = buildTrails(board, firstLetterCoordinates, lastLetter, wordSize);

  // for each trail, validate it
  const validatedTrails = validateTrails(board, trails);

  console.log(validatedTrails.length);
}

function buildTrails(board, firstLetterCoordinates, lastLetter, wordSize) {
  let trails = [];

  // for each first letter coordinates, run the star finder
  for (let i = 0; i < firstLetterCoordinates.length; i++) {
    const headCoordinates = firstLetterCoordinates[i];
    
    const matches = starFinder(board, headCoordinates, wordSize - 1, lastLetter);
    trails = trails.concat(matches);
  }

  return trails;
}

function traverseBoardToFindLetter(board, letterToLookFor) {
  let letterCoordinates = [];

  // calculate grid dimensions
  const gridX = board[0].length;
  const gridY = board.length;

  for (let y = 0; y < gridY; y++) {
    for (let x = 0; x < gridX; x++) {

      if (board[y][x] === letterToLookFor) {
        letterCoordinates.push([x, y]);
      }

    }
  }

  return letterCoordinates;
}

function starFinder(board, startPositon, reach, letterToLookFor) {

  let matches = [];

  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

  for(let i = 0; i < directions.length; i++) {

    const direction = directions[i];
    
    var match = getLetterInPath(board, startPositon, direction, reach);

    if (match === null) continue;

    const letter = match[0];
    const coordinates = match[1];

    if (letterToLookFor === letter) {
      matches.push({
        direction: direction,
        head: startPositon,
        tail: coordinates,
      });
    }
  }

  return matches;

}

function getLetterInPath (board, startPositon, direction, reach){
  let x = startPositon[0];
  let y = startPositon[1];

  switch (direction){
    case 'N':
      // decrease Y
      y -= reach; 
      break;
    case 'NE':
      // decrease Y and increase X
      y -= reach; 
      x += reach;
      break;
    case 'E':
      // increase X
      x += reach;
      break;
    case 'SE':
      // increase Y and increase X
      y += reach;
      x += reach;
      break;
    case 'S':
      // increase Y
      y += reach;
      break;
    case 'SW':
      // increase Y and decrease X
      y += reach;
      x -= reach;
      break;
    case 'W':
      // decrease X
      x -= reach;
      break;
    case 'NW':
      // decrease Y and decrease X
      y -= reach;
      x -= reach;
      break;
  }

  const gridX = board[0].length;
  const gridY = board.length;

  if (x < 0 || y < 0 || x > (gridX - 1) || y > (gridY - 1)) return null;
  return [board[y][x], [x, y]];
}

function validateTrails (board, trails) {

  let validatedTrails = [];

  // iterate all the trails
  outerCheck: for (let trail of trails) {


    let lettersToCheck = wordToLookFor.length - 2;

    for (let j = 1; j <= lettersToCheck; j++) {
      // if no match skip to the next trail
      if (getLetterInPath(board, trail.head, trail.direction, j)[0] !== wordToLookFor[j]) continue outerCheck;
    }

    validatedTrails.push(trail);
  }

  return validatedTrails;
}

main ();