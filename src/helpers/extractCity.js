const fuzz = require("fuzzball");

const cities = [
  "Aden",
  "Alexandria",
  "Amsterdam",
  "Athens",
  "Basrah",
  "Boston",
  "Brunei",
  "Buenos Aires",
  "Calicut",
  "Kolkata",
  "Cape Town",
  "Cayenne",
  "Ceylon",
  "Copenhagen",
  "Darwin",
  "Edo",
  "Hamburg",
  "Hangzhou",
  "Istanbul",
  "Jamaica",
  "Las Palmas",
  "Lisbon",
  "London",
  "Luanda",
  "Malacca",
  "Manila",
  "Marseille",
  "Mozambique",
  "Nantes",
  "Nassau",
  "Panama City",
  "Pinjarra",
  "Quanzhou",
  "Rio De Janeiro",
  "Santo Domingo",
  "Seville",
  "St. George's",
  "Stockholm",
  "Tunis",
  "Venice",
];

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
