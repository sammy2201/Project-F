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
  quizCreatorEmail: String,
  quizQuestions: [
    {
      Question: { type: String },
      Options: {
        one: { type: String },
        two: { type: String },
        three: { type: String },
        four: { type: String },
      },
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
    const [quiz, username] = await Promise.all([Quiz.find(), User.find()]);
    if (quiz) {
      res.json({ quiz: quiz, typeOfUser_inserver: typeOfUser_inserver });
    } else {
      res.send("Video not found");
    }
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

app.get("/getuserinfo", async (req, res) => {
  var userinfo = {};
  const username = await User.find();

  username.forEach((user) => {
    if (user.username === username_inserver) {
      userinfo = {
        userThatLoggedin: username_inserver,
        typeOfUser_userThatLoggedin: typeOfUser_inserver,
        nameofuserthatloggedin: user.name,
        //    videoArray: user.CreatedVideoId,
      };
    }
  });
  res.json(userinfo);
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

app.post("/uploadquiz", async function (req, res) {
  if (username_inserver === "" || typeOfUser_inserver === "user") {
    res.json("NOTOK");
  } else {
    const { title, createdby, questions, user_info } = req.body;
    const questions_array = JSON.parse(req.body.questions);
    if (username_inserver != "") {
      if (typeOfUser_inserver == "admin") {
        try {
          const quiz_Questions = questions_array.map((q) => ({
            Question: q.questions,
            Options: {
              one: q.o1,
              two: q.o2,
              three: q.o3,
              four: q.o4,
            },
            CorrectAnswer: q.co,
          }));
          const quiz = new Quiz({
            quizTitle: title,
            quizCreatedBy: createdby,
            quizCreatorEmail: user_info.userThatLoggedin,
            quizQuestions: quiz_Questions,
          });
          await quiz.save();
          res.json("OK");
        } catch (error) {
          console.error("Error saving to MongoDB:", error);
          res.status(400).send(error);
        }
      } else {
        res.json("adminlogin");
        console.log("adminlogin");
      }
    } else {
      res.json("adminlogin");
      console.log("not at all login");
    }
  }
});

app.post("/quiz", async (req, res) => {
  const quiz_title = req.body.path;
  if (username_inserver === "") {
    res.json("NOTOK");
  } else {
    try {
      const quiz = await Quiz.find({ quizTitle: quiz_title });
      const username = await User.find({ username: username_inserver });
      //  const [quiz, username] = await Promise.all([Quiz.find(), User.find()]);
      if (quiz) {
        res.json({
          quiz: quiz,
          typeOfUser_inserver: typeOfUser_inserver,
          username: username,
        });
      } else {
        res.send("Video not found");
      }
    } catch (error) {
      res.send("Error fetching video");
    }
  }
});

app.post("/usernewpoints", async (req, res) => {
  const { userid, quizid, points } = req.body;

  try {
    const updatedQuizData = {
      quizId: quizid,
      quizPoints: points.toString(),
    };

    const userdetails = await User.findOneAndUpdate(
      { _id: userid },
      { $push: { quizData: updatedQuizData } },
      { new: true }
    );

    if (!userdetails) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User details after update:", userdetails);
    res.status(200).json({ message: "Quiz details updated successfully" });
  } catch (error) {
    console.error("Error updating quiz details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/////////////////////////////listen/////////////////////////////////

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}

app.listen(port, function () {
  console.log("in port 3001");
});
