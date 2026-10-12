require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        "img-src": ["'self'", "data:", "https:"],
      },
    },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const companySchema = new mongoose.Schema(
  {},
  {
    strict: false,
    collection: "companies",
  },
);

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const Company = mongoose.model("Company", companySchema);
const ContactMessage = mongoose.model("ContactMessage", contactSchema);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.get("/api/companies", async (req, res) => {
  try {
    const companies = await Company.find({}).limit(100).lean();
    res.json(companies);
  } catch (error) {
    console.error("Companies error:", error.message);
    res.status(500).json({ error: "Unable to load companies." });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof subject !== "string" ||
      !subject.trim() ||
      typeof message !== "string" ||
      message.trim().length < 10 ||
      message.trim().length > 2000
    ) {
      return res.status(400).json({
        error: "Please provide valid contact form details.",
      });
    }

    await ContactMessage.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    res.status(201).json({ message: "Your message was saved successfully." });
  } catch (error) {
    console.error("Contact error:", error.message);
    res.status(500).json({ error: "Unable to save your message." });
  }
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing from your .env file.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Atlas connected successfully.");

    app.listen(PORT, () => {
      console.log(`HireSphere running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
