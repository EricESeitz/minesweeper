var myHeading = document.querySelector('h1');
myHeading.textContent = 'Test of main.js implementation of code';

//Testing for global scope of array, successfully called!
var arr = createArray(3, 3);

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

function TestFunction(x, y)
{
    alert('Coordinates: (' + x + ', ' + y + ')');
}

