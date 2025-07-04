const express = require("express");
const cookieParse = require("cookie-parser")
const dotenv = require("dotenv");
const path = require("path")
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const password = "jaydhumal23";
const app = express();
dotenv.config();
const PORT = process.env.PORT;
app.use(cookieParse());
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
    res.redirect("/home")
})
app.get("/home", (req, res) => {

    res.cookie("name", "JayDhumalTheBestDeveloperThe10xDeveloperTheBestHackerInTown");
    res.status(200).send("hello")
})
app.get("/read", (req, res) => {
    console.log(req.cookies);
    res.send("Done Reaidng the Cookies")
})
app.get("/hash", (req, res) => {

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash("jaydhumal@200423", salt, (err, hash) => {
            console.log(hash);

        })
    })
    res.send("hash")
})

app.get("/hashcheck", (err, res) => {
    bcrypt.compare("jaydhumal@200423", "$2b$10$Snvxvu2kUvXBW.s3zjFzduYxIrYcivrM.cavVZRQy1CIOdBCSpC96"


        , (err, result) => {
            console.log(result)
        })
    res.send("compared");
})
app.get("/jwtauth", (req, res) => {
    const token = jwt.sign({ email: "yashdhumal@gmail.com" }, password);
    res.cookie("jwttoken", token);
    res.send("cookie chodi re");
})

app.get("/authcheck", (req, res) => {
    try {
        const jwttoken = req.cookies.jwttoken

        console.log(req.cookies.jwttoken)
        const check = jwt.verify(jwttoken, password);
        console.log(check)

        res.send(check);
    }
    catch (err) {
        res.send("" + err)
    }

})
app.listen(PORT, () => {
    console.log("The website is live at localhost:" + PORT)
})