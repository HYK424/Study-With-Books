interface Person3 {
  name: string;
}

const alice: Person3 = { name: 'Alice' }; // Type is Person
const bob = { name: 'Bob' } as Person3; // Type is Person
