const fuzz = require("fuzzball");
const cities = require("../data/cities.js");

function matchCityName(input) {
  let match = null;
  let highestScore = 0;

  cities.forEach((city) => {
    const score = fuzz.ratio(input, city);
    if (score > highestScore) {
      highestScore = score;
      match = city;
    }
  });

  return match;
}

module.exports = matchCityName;
