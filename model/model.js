const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const mongourl = process.env.mongourl + "uAccounts";
try {
    mongoose.connect(mongourl)
    console.log("Successfully connected to database")
}
catch (err) {
    console.error("Sorry cannot connect to the database" + err)
}


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    age: { type: Number, required: true }
})

const userModel = mongoose.model("userAccount", userSchema);
module.exports = userModel;