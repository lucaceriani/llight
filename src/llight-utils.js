export default {
    randInt,
    randFloat,
    randArray,
}

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function randArray(array, n = 1) {
    if (n <= 1) {
        return array[randInt(0, array.length - 1)];
    } else {
        let newArr = [...array];
        // shuffle the array
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = newArr[i];
            newArr[i] = newArr[j];
            newArr[j] = temp;
        }

        // get first n elements
        return newArr.slice(0, n);
    }
}

