const express = require("express");
const sendMail = require("./mail");
const log = console.log;
var bodyParser = require("body-parser");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Product = require("./models/product");
const expressSanitizer = require("express-sanitizer");
var novostiRoutes = require("./routes/products");

var User = require("./models/user"),
  LocalStrategy = require("passport-local"),
  flash = require("connect-flash"),
  methodOverride = require("method-override"),
  session = require("express-session");
var passport = require("passport");
var async = require("async");
var crypto = require("crypto");

app.use(bodyParser.urlencoded({ extended: true }));

var MongoStore = require("connect-mongo")(session);
mongoose.connect("mongodb://localhost:27017/daniel", { useNewUrlParser: true });

// Data parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("views"));
app.set("view engine", "ejs");

app.use(expressSanitizer());
app.use(methodOverride("_method"));

app.use(
  require("express-session")({
    secret: "bilo sta mozes ovdje napisat nije bitno",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    cookie: { maxAge: 100 * 60 * 100 }
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session(User.authenticate()));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.session = req - session;
  next();
});

// email, subject, text
app.post("/email", (req, res) => {
  const { subject, email, text, first_name } = req.body;
  console.log("Data: ", req.body);

  sendMail(email, subject, text, first_name, function(err, data) {
    if (err) {
      res.status(500).json({ message: "Internal Error :(" });
    } else {
      res.json({ message: "Email sent :D" });
    }
  });
});

app.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    naslov: req.body.naslov,
    podnaslov: req.body.podnaslov,
    slika: req.body.slika
  });
  product
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => console.log(err));

  console.log("Spremljno u bazu");
});

app.get("/", (req, res) => {
  Product.find({}, function(err, data) {
    // note that data is an array of objects, not a single object!
    res.render("index", {
      product: data
    });
  });
});

app.get("/dodajRad", isAdmin, (req, res) => {
  res.render("dodajRad");
});

app.get("/adminPanel", (req, res) => {
  Product.find({}, function(err, data) {
    // note that data is an array of objects, not a single object!
    res.render("adminPanel", {
      product: data
    });
  });
});

app.get("/adminPanel", isAdmin, (req, res) => {
  res.render("adminPanel");
});

app.get("/adminPanel", isAdmin, (req, res) => {
  res.render("adminPanel");
});
/*---------------------------EDIT ARTIKLA-----------------------------------*/

app.get("/:id/edit", function(req, res) {
  Product.findById(req.params.id, function(err, pronadjenartikl) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("editRada", { product: pronadjenartikl });
    }
  });
});

app.put("/:id", function(req, res) {
  req.body.podnaslov = req.sanitize(req.body.naslov);
  Product.findByIdAndUpdate(req.params.id, req.body.product, function(
    err,
    noviartikl
  ) {
    if (err) {
      console.log("error");
    } else console.log("artikl ažuriran: " + noviartikl);
  });

  res.redirect("/adminPanel");
});

/*--------------------------------------------------------------------------*/

/*---------------------------Delete ARTIKLA---------------------------------*/

app.delete("/:id", function(req, res) {
  Product.findByIdAndDelete(req.params.id, function(err, artikl) {
    if (err) {
      console.log("error");
    } else console.log("artikl pobrisan: " + artikl);
  });

  res.redirect("/");
});

/*--------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------*/
app.get("/register", function(req, res) {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("registration");
});

app.post("/register", function(req, res) {
  var newUser = new User({
    username: req.body.username,
    email: req.body.email
  });

  User.findOne({ username: req.body.username }, function(err, user) {
    if (user) {
      req.flash("Postoji user");
      return;
    }
  });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("registration");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/");
      });
    }
  });
});

app.get("/login", function(req, res) {
  if (req.user) {
    req.session = null;
    return res.redirect("/dodajRad");
  }
  res.render("login");
});

app.post(
  "/login",
  usernameToLowerCase,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  }),

  function(req, res) {}
);

app.get("/logout", function(req, res) {
  console.log("Uspjesno ste se odjavili!!!" + req.user);
  req.logout();
  req.session.destroy();

  res.redirect("/login");
});
/*-----------------------------------------------------------------------------------------------*/

function usernameToLowerCase(req, res, next) {
  req.body.username = req.body.username.toLowerCase();
  next();
}

function isAdmin(req, res, next) {
  if (req.user == undefined) {
    return res.redirect("/");
  } else if (req.user.isAdmin == false) {
    return res.redirect("/");
  }
  next();
}

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.session = req - session;
  next();
});

app.listen(app.get("port"), () =>
  console.log("Server is starting on PORT, ", app.get("port+"))
);
