require("dotenv").config();
const mongoose = require("mongoose");

const Company = mongoose.model(
  "Company",
  new mongoose.Schema({}, { strict: false, collection: "companies" }),
);

const companies = [
  {
    name: "Google",
    industry: "Technology",
    location: "India",
    description: "Sample directory entry. Verify current openings.",
    website: "https://about.google/",
    careersUrl: "https://careers.google.com/",
    isSample: true,
  },
  {
    name: "Microsoft",
    industry: "Technology",
    location: "India",
    description: "Sample directory entry. Verify current openings.",
    website: "https://www.microsoft.com/",
    careersUrl: "https://careers.microsoft.com/",
    isSample: true,
  },
  {
    name: "TCS",
    industry: "IT Services",
    location: "India",
    description: "Sample directory entry. Verify current openings.",
    website: "https://www.tcs.com/",
    careersUrl: "https://www.tcs.com/careers",
    isSample: true,
  },
  {
    name: "Infosys",
    industry: "IT Services",
    location: "India",
    description: "Sample directory entry. Verify current openings.",
    website: "https://www.infosys.com/",
    careersUrl: "https://www.infosys.com/careers/",
    isSample: true,
  },
  {
    name: "Accenture",
    industry: "Consulting",
    location: "India",
    description: "Sample directory entry. Verify current openings.",
    website: "https://www.accenture.com/",
    careersUrl: "https://www.accenture.com/in-en/careers",
    isSample: true,
  },
  {
    name: "JPMorganChase",
    industry: "Finance",
    location: "India",
    description: "Sample directory entry. Verify current openings.",
    website: "https://www.jpmorganchase.com/",
    careersUrl: "https://careers.jpmorgan.com/",
    isSample: true,
  },
];

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from .env");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  for (const company of companies) {
    await Company.updateOne(
      { name: company.name },
      { $set: company },
      { upsert: true },
    );
  }

  console.log("Company sample data added successfully.");
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
