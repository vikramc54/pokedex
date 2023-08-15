const person1 = {
  name: 'Fora',
  address: {
    city: 'Casterly Rock',
    state: 'westeros'
  }
};

const person2 = {...person1};
const person3 = person1;

person2.name = 'Jonh Snow';
person2.address.city = 'White Harbor';
person1.address.city = 'Kings land';

console.log(person1.address.city, person2.address.city);
