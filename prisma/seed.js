import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
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

const prisma = new PrismaClient({ adapter });

async function main() {
  const customersData = [];

  for (let i = 0; i < 60; i++) {
    customersData.push({
      name: random(names) + " " + random(["A.", "B.", "C.", "D."]),
      age: randomInt(20, 60),
      campaign: randomInt(1, 5),
      job: random(jobs),
      education: random(educations),
      marital: random(marital),
      contact: random(["cellular", "telephone", "unknown"]),
      day_of_week: random(days),
      month: random(months),
      default: random(status),
      housing: random(status),
      loan: random(status),
      duration: randomInt(0, 500),
      pdays: randomInt(0, 999),
      previous: randomInt(0, 7),
      poutcome: random(["failure", "nonexistent", "success"]),
      emp_var_rate: Number((Math.random() * 3 - 1).toFixed(1)),
      cons_price_idx: Number((Math.random() * 2 + 92).toFixed(3)),
      cons_conf_idx: Number((Math.random() * 10 - 50).toFixed(1)),
      euribor3m: Number((Math.random() * 5).toFixed(3)),
      nr_employed: randomInt(4900, 5300),
      has_credit: random(status),
      last_day_contacted: random(days),
      last_month_contacted: random(months),
      how_many_contacted_now: randomInt(0, 15),
      how_many_contacted_previous: randomInt(0, 15),
      days_last_contacted: randomInt(0, 31),
      result_of_last_campaign: random(subscribeStatus),
    });
  }

  await prisma.customers.createMany({ data: customersData });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
// function generateOne() {
//   return `
// INSERT INTO customers (
//   name, age, job, education, marital, contact_comunication,
//   housing_loan, personal_loan, has_credit, last_day_contacted,
//   last_month_contacted, how_many_contacted_now, how_many_contacted_previous,
//   days_last_contacted, result_of_last_campaign, predictive_subscribe,
//   predictive_score_subscribe
// ) VALUES (
//   '${random(names)} ${random(["A.", "B.", "C.", "D."])}',
//   ${randomInt(20, 60)},
//   '${random(jobs)}',
//   '${random(educations)}',
//   '${random(marital)}',
//   '${random(["email", "phone", "unknown"])}',
//   '${random(status)}',
//   '${random(status)}',
//   '${random(status)}',
//   '${random(days)}',
//   '${random(months)}',
//   ${randomInt(0, 15)},
//   ${randomInt(0, 15)},
//   ${randomInt(0, 31)},
//   '${random(subscribeStatus)}',
//   '${random(subscribeStatus)}',
//   ${Math.random().toFixed(2)}
// );
// `;
// }

// let output = "";
// for (let i = 0; i < 60; i++) {
//   output += generateOne();
// }

// fs.writeFileSync("seed-customers.sql", output);
// console.log("Generated seed-customers.sql with 60 rows!");
