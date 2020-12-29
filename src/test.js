// Array.prototype.shuffle = function () {
//     var input = this;
//     for (var i = input.length - 1; i >= 0; i--) {
//         var randomIndex = Math.floor(Math.random() * (i + 1));
//         var itemAtIndex = input[randomIndex];
//         input[randomIndex] = input[i];
//         input[i] = itemAtIndex;
//     }
//     return input;
// }
// var tempArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// tempArray.shuffle();
// // and the result is...
// alert(tempArray);

let arr1 = [];
for (let i = 0; i < 10000; i++) {
    arr1.push(parseInt(Math.random() * 10));
}
console.log(arr1);

function sort(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = arr[j];
        arr[j] = arr[i];
        arr[i] = tmp;
    }
    return arr;
}

console.time('a');
sort(arr1);
console.timeEnd('a');

function randomsort(a, b) {
    return Math.random() > .5 ? -1 : 1;
}

console.time('b');
arr1.sort(randomsort);
console.timeEnd('b');


function shuffle(arr) {
    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
        var index = parseInt(Math.random() * (len - i));
        var temp = arr[index];
        arr[index] = arr[len - i - 1];
        arr[len - i - 1] = temp;
    }
    return arr;
}

console.time('c');
shuffle(arr1);
console.timeEnd('c');


//快速排序函数
var quickSort = function (arr) {
    if (arr.length <= 1) {
        return arr;
    }

    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr.splice(pivotIndex, 1); //将基准分离出

    var left = [];
    var right = [];

    for (var i = 0; i < arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat([pivot], quickSort(right));

};

console.time('d');
quickSort(arr1);
console.timeEnd('d');

console.time('d');
arr1.sort((a, b) => {
    return a - b;
})
console.timeEnd('d');