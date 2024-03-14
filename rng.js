// simple random number generator from:
// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
class RNG {
  constructor(seed) {
    this.seed = seed;
  }
  random() {
    var x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}
export default RNG;
