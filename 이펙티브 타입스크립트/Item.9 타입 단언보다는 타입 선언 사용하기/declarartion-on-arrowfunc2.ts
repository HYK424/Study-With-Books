interface Person {
  name: string;
}
const peopleArrDeclarar2 = ['alice', 'bob', 'jan'].map((name): Person => ({ name })); // Type is Person[]
