//let size = prompt('Input a size for the grid');
drawSquares();
function drawSquares(square) {
  $("#squareContainer").empty();
  for (let row = 0; row < 8; row++) {
    let rowElement = $("<div>");
    rowElement.addClass("row");
    for (let column = 0; column < 8; column++) {
      let squareElement = $("<div>");
      squareElement.addClass("square");
      rowElement.append(squareElement);
    }
    $("#squareContainer").append(rowElement);
  }
}
