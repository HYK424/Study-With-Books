interface Person {
  name: string;
}
const people = ['alice', 'bob', 'jan'].map((name) => ({ name } as Person));
// { name: string; }[]... but we want Person[]
