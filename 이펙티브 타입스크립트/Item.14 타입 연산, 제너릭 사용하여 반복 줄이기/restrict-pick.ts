interface Name {
  first: string;
  last: string;
}

type FirstLast = Pick<Name, 'first' | 'last'>; // OK
type FirstMiddle = Pick<Name, 'first' | 'middle'>;
// ~~~~~~~~~~~~~~~~~~
// Type '"middle"' is not assignable
// to type '"first" | "last"'
