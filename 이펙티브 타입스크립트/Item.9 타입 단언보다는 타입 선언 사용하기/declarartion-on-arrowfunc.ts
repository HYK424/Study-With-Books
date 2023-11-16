interface Person {
  name: string;
}
const peopleArrDeclarar = ['alice', 'bob', 'jan'].map((name) => {
  const person: Person = { name };
  return person;
}); // Type is Person[]
