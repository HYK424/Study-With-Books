const list = [1, 2]; // Type is number[]
const tuple: [number, number] = list;
// ~~~~~ Type 'number[]' is missing the following
//       properties from type '[number, number]': 0, 1
const triple: [number, number, number] = [1, 2, 3];
const double: [number, number] = triple;
// ~~~~~~ '[number, number, number]' is not assignable to '[number, number]'
//          Types of property 'length' are incompatible
//          Type '3' is not assignable to type '2'
