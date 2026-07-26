const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/userModel");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  // .connect(process.env.DATABASE, {
  .connect(DB)
  .then(() => {
    console.log("DB connection successful");
    // console.log(con.connection);
  });

//READ JSON FILE
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

//IMPORT INTO THE DATA BASE
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    console.log("data succefully loaded");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//DELETE ALL DATA FROM COLLECETION
const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log("data deleted succefully");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
// console.log(process.argv);

if (process.argv[2] === "--import") {
  importData();
  console.log(process.argv);
} else if (process.argv[2] === "--delete") {
  console.log(process.argv);
  deleteData();
}
