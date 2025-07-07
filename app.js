const express = require("express");
const app = express();
const cookerParser = require("cookie-parser");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const userModel = require("./model/model.js");
const cookieParser = require("cookie-parser");
dotenv.config();
const PORT = process.env.PORT;
const jwtpass = process.env.jwtpass;

app.set("view engine", "ejs")
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.redirect("/home")
})
app.get("/home", (req, res) => {
    res.clearCookie("token");
    res.render("home")
})
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/home");
})
app.get("/login", (req, res) => {
    res.clearCookie("token");
    res.render("login")
})

app.post("/logincheck", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email })
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                const token = jwt.sign({ email: user.email }, jwtpass);
                res.cookie("token", token);
                res.redirect("loggedin")

            }
            else {
                res.send("something went wrong")
            }
        })
    }
    catch (err) {
        res.send("something went wrong ")
        console.error(err)
    }
})
app.get("/loggedin", async (req, res) => {
    try {

        const user = jwt.verify(req.cookies.token, jwtpass)
        const userName = await userModel.findOne({ email: user.email });
        console.log(userName);
        res.render("logged", { user: userName });
    }
    catch (err) {
        console.error("something went wrong " + err);

    }
})
app.post("/create", async (req, res) => {
    const { name, email, password, age } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) return res.send("something went wrong")

            try {
                const user = await userModel.create({
                    name,
                    email,
                    password: hash,
                    age,
                })

                console.log("successfully created a user !")
                console.log(user);
                const token = jwt.sign({ email: email }, jwtpass);
                console.log(token);
                res.cookie("token", token);
                res.redirect("/loggedin")

            }
            catch (err) {
                res.send("something went wrong")
                console.error("Cannot create Account " + err + " everything ok !!")
            }
        })

    })



})

app.listen(PORT, (req, res) => {
    console.log("your application is live on PORT:" + PORT);
})
