/*
  --- Part Two ---

  The Elf looks quizzically at you. Did you misunderstand the assignment?

  Looking for the instructions, you flip over the word search to find that this isn't actually an XMAS puzzle; it's an X-MAS puzzle in which you're supposed to find two MAS in the shape of an X. One way to achieve that is like this:

  M.S
  .A.
  M.S

  Irrelevant characters have again been replaced with . in the above diagram. Within the X, each MAS can be written forwards or backwards.

  Here's the same example from before, but this time all of the X-MASes have been kept instead:

  .M.S......
  ..A..MSMS.
  .M.S.MAA..
  ..A.ASMSM.
  .M.S.M....
  ..........
  S.S.S.S.S.
  .A.A.A.A..
  M.M.M.M.M.
  ..........

  In this example, an X-MAS appears 9 times.

  Flip the word search from the instructions back over to the word search side and try again. How many times does an X-MAS appear?
*/

const fs = require('fs').promises;

async function main() {

  // get the input file
  const data = await fs.readFile('input', 'utf8');

  // build the board into an easy to navigate stucture
  board = [];
  const rows = data.split('\n');
  rows.forEach((row) => {
    board.push(row.split(''));
  });

  // traverse entire board to find 'A'
  // locations
  const centralLetterCoordinates = traverseBoardToFindLetter(board, 'A');

  // for each coordinate, validate it
  const validatedXmas = validateXpatterns(board, centralLetterCoordinates);

  console.log(validatedXmas);
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
  return board[y][x];
}

function validateXpatterns (board, centralLetterCoordinates) {


  let valid = 0;

  // get the letters in the 4 corners
  for (let coordinates of centralLetterCoordinates) {
    const corners = getCorners(board, coordinates);  

    if (
      (
        (corners[0] === 'M' && corners[2] === 'S') ||
        (corners[0] === 'S' && corners[2] === 'M')
      ) &&
      (
        (corners[1] === 'M' && corners[3] === 'S') ||
        (corners[1] === 'S' && corners[3] === 'M')
      )
    ) {
      valid ++;
    }

  }

  return valid;
}

function getCorners (board, centralLetterCoordinates) {

  let cornerLetters = [];

  let directionsToCheck = ['NW', 'NE', 'SE', 'SW'];

  for (var directionToCheck of directionsToCheck) {
    cornerLetters.push(getLetterInPath(board, centralLetterCoordinates, directionToCheck, 1));
  }

  return cornerLetters;
}

main ();