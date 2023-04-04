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

// const input =
//   "Edo € 5.0752M 5.0752M Our establishment offers fair trade to 0 / 200k all: You can trust our 01.59.07 services! Gold Leather Price 862 (96%) Price 194 (97%) Weight 75 Weight 16 5.1K 14.45K Cloth Peanuts Price 247 (99%f) Price 110 (100%) Weight 22 Weight 10 12.24K 21.624K Bananas Agate Price 50 (100%) Price 1.006K (101%) Weight 4 Weight 100 37.4K 4.76K Meat Tobacco Price 92 (102%) Price 513 (103%) Weight 6 Weight 50 24.548K 82K Porcelain Tea Leaves Price 832 (104%) Price 481 (107%) Weight 57 Weight 37 5.304K 8.296K Alcohol Price 728 (86%) Weight 65 Sold out Purchase Sell";
// const matchedCity = matchCityName(input.substring(0, 20));

// console.log(
//   `Matched city for input "${input.substring(0, 50)}" is "${matchedCity}".`
// );
module.exports = matchCityName;
