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

drawSquares();
function drawSquares(square) {
  $("#squareContainer").empty();
  for (let row = 0; row < gridSize; row++) {
    let rowElement = $("<div>");
    rowElement.addClass("row");
    for (let column = 0; column < gridSize; column++) {
      let squareElement = $("<div>");
      squareElement.addClass("square");
      squareElement.attr("x_coordinate", row);
      squareElement.attr("y_coordinate", column);
      rowElement.append(squareElement);
    }
    $("#squareContainer").append(rowElement);
  }
}
