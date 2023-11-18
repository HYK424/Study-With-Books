type Pair = [number, number];
type StringList = string[];
type NamedNums = [string, ...number[]];

interface Tuple {
  0: number;
  1: number;
  length: 2;
}

const pairArr: Pair = [11, 21];
const tupleArr: Tuple = [10, 20];
