let d;

if (typeof d === undefined) {
  d = 5;
}

let c = 6 + 'a';

if (typeof c === String) c = 5

if (!d) {
  console.log(c)
}

if (typeof c === 'number') {
  let d = 5
  c = d*d //global
}

console.log(c, d, c)

//5
//25 5 25