interface Identified {
  id: string;
}
interface Person2 {
  name: string;
}
interface Lifespan {
  birth: Date;
  death?: Date;
}

type PersonSpan = Person2 & Lifespan;
const ps: PersonSpan = {
  name: 'Alan Turing',
  birth: new Date('1912/06/23'),
  death: new Date('1954/06/07'),
}; // OK

type K = keyof (Person2 | Lifespan); //never
type J = keyof Identified; //"id"
