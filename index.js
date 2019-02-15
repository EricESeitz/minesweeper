let validGridSize = false;
let gridSize = parseInt(Number(prompt("Input a size for the grid")));

while (validGridSize == false) {  

  if (gridSize < 2 || gridSize % 1 !== 0) {
    alert("Invalid input. Enter an integer between 2 and 100");
    gridSize = parseInt(Number(prompt("Input a size for the grid")));
  }
  else if (gridSize > 100 || gridSize % 1 !== 0) {
    alert("Invalid input. Enter an integer between 2 and 100");
    gridSize = parseInt(Number(prompt("Input a size for the grid")));
  }
  else {
    validGridSize = true;
  }
}

//Creates n-dimensional array. Source below
//https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript/966938#966938
function createArray(length) {
  let arr = new Array(length || 0),
      i = length;

  if (arguments.length > 1) {
      let args = Array.prototype.slice.call(arguments, 1);
      while(i--) arr[length-1 - i] = createArray.apply(this, args);
  }
  
  return arr;
}//end of n-dimensional arr

//Creates Global 2D array matching user-defined grid size
let arr = createArray(gridSize, gridSize);

//Testing function, fills the array with random numbers
//to test 'connection' between clickable grid and array
/*
arrayFillerRandom();
function arrayFillerRandom()
{
  for (let i = 0; i < gridSize; i++)
  {
    for (let k = 0; k < gridSize; k++)
    {
    arr[i][k] = Math.floor(Math.random() * 101); //returns random number between 0 and 100;
    }
  }

}
*/

//For storing values in the 2D array, used to create unique instance 'objects'. Can be called on by arr[x][y].<property>
function squareProperties(isClicked, isBomb, isFlagged, numNeighborMines, testingClickTimes)
{
  this.isClicked = isClicked;
  this.isBomb = isBomb;
  this.isFlagged = isFlagged;
  this.numNeighborMines = numNeighborMines;
  this.testingClickTimes = testingClickTimes;
}
//fills array with "squareProperties" object, will be used to store properties
//of the grid squares (i.e isClicked - if square has been clicked before. isBomb - if it is a mine space)
arrayFiller();
function arrayFiller()
{
  for (let i = 0; i < gridSize; i++)
  {
    for (let k = 0; k < gridSize; k++)
    {
    arr[i][k] = new squareProperties(0, 0, 0, 0, 0);  //initial assignment, all properties 0
    }
  }
}

//Assigns 'isBomb' = 1 to random coordinates. 2/15: temp hard coded value until user asked for number of mines at start
randomMineAssign();
function randomMineAssign()
{
  let userNumOfMines = 3;  //temporary hard value until we ask user for number of mines

  for (let i = 1; i <= userNumOfMines; i++)
  {
    do
    {
      xCoord = Math.floor(Math.random() * gridSize); //returns random number between 0 and gridSize-1;
      yCoord = Math.floor(Math.random() * gridSize); //returns random number between 0 and gridSize-1;
    }while(arr[xCoord][yCoord].isBomb != 0);   //Loop through random coordinates until a non-mine space is found (avoid multiple assignments to same square)
    arr[xCoord][yCoord].isBomb = 1;   //assign isBomb property. 0 - No, 1 - Yes
  }
}

//Going square by square, check all neighboring mines one by one. 
//If bomb found, itterate numMinesFound up by one. Set final value to arr[x][y]
checkNumNeighboringMines();
function checkNumNeighboringMines()
{
  let numMinesFound = 0;
  for (let x = 0; x < gridSize; x++)
  {
    for (let y = 0; y < gridSize; y++)  //loop through every square in grid, starting at (0,0) to gridSize-1
    {
      numMinesFound = 0;

      if ((x-1) >= 0)
      {
        if (arr[x-1][y].isBomb == 1)  //Left
        numMinesFound++;
      }
      if ((x+1) < gridSize)
      {
        if (arr[x+1][y].isBomb == 1)  //Right
        numMinesFound++;
      }
      if ((y-1) >= 0)
      {
        if (arr[x][y-1].isBomb == 1)  //Up
        numMinesFound++;
      }
      if ((y+1) < gridSize)
      {
        if (arr[x][y+1].isBomb == 1)  //Down
        numMinesFound++;
      }
      if ((x-1) >= 0 && (y-1) >= 0)
      {
        if (arr[x-1][y-1].isBomb == 1)  //Upper left corner
        numMinesFound++;
      }
      if ((x+1) < gridSize && (y-1) >= 0)
      {
        if (arr[x+1][y-1].isBomb == 1)  //Upper right corner
        numMinesFound++;
      }
      if ((x-1) >= 0 && (y+1) < gridSize)
      {
        if (arr[x-1][y+1].isBomb == 1)  //lower left corner
        numMinesFound++;
      }
      if ((x+1) < gridSize && (y+1) < gridSize)
      {
        if (arr[x+1][y+1].isBomb == 1)  //lower right corner
        numMinesFound++;
      }
      
      arr[x][y].numNeighborMines = numMinesFound; //assigns the final number of mines found to orig. (x,y) coordinates
    }
  }
}

drawSquares();
function drawSquares(square) {
  $("#squareContainer").empty();
  for (let row = 0; row < gridSize; row++) {
    let rowElement = $("<div>");
    rowElement.addClass("row");
    for (let column = 0; column < gridSize; column++) {
      let squareElement = $("<div>");
      squareElement.addClass("square");
      squareElement.attr("data-x-coordinate", column);
      squareElement.attr("data-y-coordinate", row);
      rowElement.append(squareElement);
    }
    $("#squareContainer").append(rowElement);
  }
}

$(".square").on("click", function() {
  const elementClicked = $(this);
  const xPos = elementClicked.attr("data-x-coordinate");
  const yPos = elementClicked.attr("data-y-coordinate");
  onClicked(xPos, yPos);
});

//on user clicking on a grid square. **Just For testing: should display (x, y) coordinates on grid click, plus number of times a spesific square has been clicked on
function onClicked(x, y)
{
  arr[x][y].testingClickTimes = arr[x][y].testingClickTimes + 1;  //increments testingClickTimes up by one for each click
    alert('Coordinates: (' + x + ', ' + y + ')' + "\nIs Bomb? (0/No, 1/Yes): " + arr[x][y].isBomb + "\nNum Neighboring Mines: " + arr[x][y].numNeighborMines);
}
