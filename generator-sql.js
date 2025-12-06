import fs from "fs";

const names = [
  "Andi",
  "Budi",
  "Cici",
  "Dewi",
  "Eka",
  "Fajar",
  "Gina",
  "Hadi",
  "Indra",
  "Joko",
  "Kiki",
  "Lina",
  "Mira",
  "Niko",
  "Oki",
  "Putri",
  "Qori",
  "Riko",
  "Sari",
  "Tono",
  "Umar",
  "Vina",
  "Wati",
  "Xena",
  "Yusuf",
  "Zara",
];

const jobs = [
  "admin",
  "student",
  "technician",
  "manager",
  "developer",
  "designer",
  "teacher",
  "banker",
  "analyst",
  "freelancer",
];

const educations = ["primary", "secondary", "tertiary", "unknown"];
const marital = ["divorced", "married", "single", "unknown"];
const status = ["yes", "no", "unknown"];
const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
const subscribeStatus = ["failure", "nonexistent", "success"];

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function generateOne() {
  return `
INSERT INTO customers (
  name, age, job, education, marital, contact_comunication,
  housing_loan, personal_loan, has_credit, last_day_contacted,
  last_month_contacted, how_many_contacted_now, how_many_contacted_previous,
  days_last_contacted, result_of_last_campaign, predictive_subscribe,
  predictive_score_subscribe
) VALUES (
  '${random(names)} ${random(["A.", "B.", "C.", "D."])}',
  ${randomInt(20, 60)},
  '${random(jobs)}',
  '${random(educations)}',
  '${random(marital)}',
  '${random(["email", "phone", "unknown"])}',
  '${random(status)}',
  '${random(status)}',
  '${random(status)}',
  '${random(days)}',
  '${random(months)}',
  ${randomInt(0, 15)},
  ${randomInt(0, 15)},
  ${randomInt(0, 31)},
  '${random(subscribeStatus)}',
  '${random(subscribeStatus)}',
  ${Math.random().toFixed(2)}
);
`;
}

let output = "";
for (let i = 0; i < 60; i++) {
  output += generateOne();
}

fs.writeFileSync("seed-customers.sql", output);
console.log("Generated seed-customers.sql with 60 rows!");
