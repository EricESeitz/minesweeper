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
  var arr = new Array(length || 0),
      i = length;

  if (arguments.length > 1) {
      var args = Array.prototype.slice.call(arguments, 1);
      while(i--) arr[length-1 - i] = createArray.apply(this, args);
  }

  return arr;
}//end of n-dimensional arr

//2D array matching uer-defined grid size
var arr = createArray(gridSize, gridSize);

drawSquares();
function drawSquares(square) {
  $("#squareContainer").empty();
  for (let row = 0; row < gridSize; row++) {
    let rowElement = $("<div>");
    rowElement.addClass("row");
    for (let column = 0; column < gridSize; column++) {
      //Eric: Changed "<div>"" to "<div onclick ...>""
      let squareElement = $("<div onclick = alert('Clicked!');>");
      //let squareElement = $("<div onclick = alert('Clicked!');>");
      squareElement.addClass("square");
      squareElement.attr("x_coordinate", row);
      squareElement.attr("y_coordinate", column);
      rowElement.append(squareElement);
    }
    $("#squareContainer").append(rowElement);
  }
}

//testing function for 2D arr, should display (x, y) coordinates on grid click
function TestFunction(x)
{
    alert('Coordinates: (' + x + ', ' + x + ')');
}