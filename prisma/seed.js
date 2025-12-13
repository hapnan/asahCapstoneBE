import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import * as csv from "fast-csv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

  // Create a promise to handle the stream properly
  await new Promise((resolve, reject) => {
    fs.createReadStream(path.resolve(__dirname, "bank-additional-full.csv"))
      .pipe(csv.parse({ headers: true, delimiter: ";" }))
      .on("data", (data) => {
        customersData.push({
          name: random(names) + " " + random(["A.", "B.", "C.", "D."]),
          age: data.age ? parseInt(data.age) : randomInt(20, 60),
          campaign: data.campaign ? parseInt(data.campaign) : randomInt(1, 5),
          job: data.job ? data.job : random(jobs),
          education: data.education ? data.education : random(educations),
          marital: data.marital ? data.marital : random(marital),
          contact: data.contact
            ? data.contact
            : random(["cellular", "telephone", "unknown"]),
          day_of_week: data.day_of_week ? data.day_of_week : random(days),
          month: data.month ? data.month : random(months),
          default: data.default ? data.default : random(status),
          housing: data.housing ? data.housing : random(status),
          loan: data.loan ? data.loan : random(status),
          pdays: data.pdays ? parseInt(data.pdays) : randomInt(0, 999),
          previous: data.previous ? parseInt(data.previous) : randomInt(0, 7),
          poutcome: data.poutcome
            ? data.poutcome
            : random(["failure", "nonexistent", "success"]),
          emp_var_rate: data.empvarrate
            ? parseFloat(data.empvarrate)
            : Number((Math.random() * 3 - 1).toFixed(1)),
          cons_price_idx: data.conspriceidx
            ? parseFloat(data.conspriceidx)
            : Number((Math.random() * 2 + 92).toFixed(3)),
          cons_conf_idx: data.consconfidx
            ? parseFloat(data.consconfidx)
            : Number((Math.random() * 10 - 50).toFixed(1)),
          euribor3m: data.euribor3m
            ? parseFloat(data.euribor3m)
            : Number((Math.random() * 5).toFixed(3)),
          nr_employed: data.nremployed
            ? parseInt(data.nremployed)
            : randomInt(4900, 5300),
          has_credit: random(status),
          last_day_contacted: random(days),
          last_month_contacted: random(months),
          how_many_contacted_now: randomInt(0, 15),
          how_many_contacted_previous: randomInt(0, 15),
          days_last_contacted: randomInt(0, 31),
          result_of_last_campaign: random(subscribeStatus),
        });
      })
      .on("end", () => {
        console.log(`Parsed ${customersData.length} customers from CSV`);
        resolve();
      })
      .on("error", (error) => {
        reject(error);
      });
  });

  // Insert data in batches to avoid overwhelming the database
  if (customersData.length > 0) {
    const batchSize = 1000;
    for (let i = 0; i < customersData.length; i += batchSize) {
      const batch = customersData.slice(i, i + batchSize);
      await prisma.customers.createMany({ data: batch });
      console.log(
        `Inserted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} customers`,
      );
    }
    console.log(`Total customers seeded: ${customersData.length}`);
  } else {
    console.log("No customer data to seed");
  }
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
