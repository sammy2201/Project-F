const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const findOrCreate = require("mongoose-findorcreate");
const cors = require("cors");
const { log } = require("console");
const bodyParser = require("body-parser");
const { create } = require("domain");
require("dotenv").config();

var username_inserver = "";
var typeOfUser_inserver = "";

const app = express();
app.use(express.static(__dirname + "/public"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "Our secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/quizDb", {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
});
////////////////////////////Schema//////////////////////////////

const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    unique: true,
  },
  password: String,
  typeOfUser: String,
  quizData: [
    {
      quizId: {
        type: String,
      },
      quizPoints: {
        type: String,
      },
    },
  ],
});

const quizSchema = new mongoose.Schema({
  quizTitle: String,
  quizCreatedBy: String,
  quizQuestions: [
    {
      Question: { type: String },
      Options: [
        {
          one: { type: String },
          two: { type: String },
          three: { type: String },
          four: { type: String },
        },
      ],
      CorrectAnswer: { type: String },
    },
  ],
});

//////////////////////////////////////////////////////////////////
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

//////////////////////////model//////////////////////////////////
const User = new mongoose.model("User", userSchema);
const Quiz = new mongoose.model("Quiz", quizSchema);

/////////////////////////passport///////////////////////////////

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

////////////////////////////////////get////////////////////////////////
app.get("/", async (req, res) => {
  try {
    res.json({ typeOfUser_inserver: typeOfUser_inserver });
  } catch (error) {
    res.send("Error fetching video");
  }
});

app.get("/getData", async (req, res) => {
  try {
    res.json("hi ra lucha");
  } catch (error) {
    res.send("Error fetching video");
  }
});
////////////////////////////////////post////////////////////////////////
app.post("/login", async function (req, res) {
  const { username, password } = req.body;
  const user = new User({
    username: username,
    password: password,
    typeOfUser: "user",
  });
  req.login(user, async function (err) {
    if (err) {
      res.json("NOTOK");
    } else {
      passport.authenticate("local")(req, res, async function () {
        try {
          const docs = await User.find({
            typeOfUser: "user",
            username: username,
          });
          if (docs.length !== 0) {
            res.json("OK");
            username_inserver = username;
            typeOfUser_inserver = "user";
          } else {
            console.log("you are an admin");
            res.json("NOTOK");
          }
        } catch (err) {
          console.error(err);
        }
      });
    }
  });
});

app.post("/adminlogin", async function (req, res) {
  const { username, password } = req.body;
  const user = new User({
    username: username,
    password: password,
    typeOfUser: "admin",
  });
  req.login(user, async function (err) {
    if (err) {
      res.json("NOTOK");
    } else {
      passport.authenticate("local")(req, res, async function () {
        try {
          const docs = await User.find({
            typeOfUser: "admin",
            username: username,
          });
          if (docs.length !== 0) {
            res.json("OK");
            username_inserver = username;
            typeOfUser_inserver = "admin";
          } else {
            console.log("you are an user");
            res.json("NOTOK");
          }
        } catch (err) {
          console.error(err);
        }
      });
    }
  });
});

app.post("/register", function (req, res) {
  const { username, password, name } = req.body;
  User.register(
    new User({
      username: username,
      name: name,
      typeOfUser: "user",
    }),
    password,
    function (err, user) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function () {});
        res.json("OK");
        username_inserver = username;
        typeOfUser_inserver = "user";
        console.log("Type of user = ", typeOfUser_inserver);
      }
    }
  );
});

app.post("/adminregister", function (req, res) {
  const { username, password, name } = req.body;
  User.register(
    new User({
      username: username,
      name: name,
      typeOfUser: "admin",
    }),
    password,
    async function (err, user) {
      if (err) {
        console.log(err);
        return res.json("NOTOK");
      }
      await passport.authenticate("local")(req, res, function () {});
      res.json("OK");
      username_inserver = username;
      typeOfUser_inserver = "admin";
    }
  );
});

/////////////////////////////listen/////////////////////////////////

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}

app.listen(port, function () {
  console.log("in port 3001");
});
