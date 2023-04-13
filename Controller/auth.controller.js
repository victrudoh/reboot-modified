 const bcrypt = require("bcryptjs");

const User = require("../Models/user.model");
const Order = require("../Models/order.model");

module.exports = {
  getLoginController: async (req, res) => {
    let message = req.flash("error");
    //so the error message box will not always be active
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render("auth/login", {
      pageTitle: "Login",
      path: "login",
      errorMessage: message,
      role: null,
    });
  },

  postLoginController: (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Invalid email or password");
          return res.redirect("/login");
        }
        bcrypt
          .compare(password, user.password)
          .then((passwordMatch) => {
            if (passwordMatch) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              return req.session.save((err) => {
                //this is not too important, you can remove it and the console.log and just redirect
                console.log(err, "postLoginController 2nd log");
                if (user.role === "user") {
                  console.log('this user is: ', user.role);
                  res.redirect("/");
                } else if (user.role === "admin") {
                  console.log("this user is: ", user.role);
                  res.redirect("/admin/dashboard");
                } else if (user.role === "cashier") {
                  console.log("this user is: ", user.role);
                  res.redirect("/cashier/dashboard");
                }
              });
            }
            req.flash("error", "Invalid email or password");
            res.redirect("/login");
          })
          .catch((err) => {
            console.log(err, "postLoginController 1st log");
            res.redirect("/login");
          });
      })
      .catch((err) => console.log(err, "postLoginController"));
  },

  postLogoutController: (req, res, next) => {
    req.session.destroy((err) => {
      console.log(err, "postLogoutController");
      res.redirect("/");
    });
  },

  getSignupController: async (req, res) => {
    let message = req.flash("error");
    //so the error message box will not always be active
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render("auth/signup", {
      pageTitle: "Signup",
      path: "signup",
      errorMessage: message,
      role: null,
    });
  },

  postSignupController: async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const physicalAddress = req.body.physicalAddress;
    const gender = req.body.gender;
    const role = req.body.role;

    User.findOne({ email: email })
      .then((emailExists) => {
        if (emailExists) {
          req.flash("error", "email already exists, try another?");
          return res.redirect("/signup");
        }
        return bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            const user = new User({
              username: username,
              email: email,
              password: hashedPassword,
              physicalAddress: physicalAddress,
              gender: gender,
              role: role,
              cart: { items: [] },
            });
            return user.save();
          })
          .then((result) => {
            res.redirect("/login");
          });
      })
      .catch((err) => {
        console.log(err, "postSignupController");
      });
  },

  getProfileController: async (req, res) => {
    const user = await User.findOne({ username: req.user.username });

    res.render("auth/profile", {
      pageTitle: "profile",
      path: "profile",
      role: req.user?.role,
      user: user,
    });
  },

  getEditProfileController: async (req, res) => {
    const user = await User.findOne({ username: req.user.username });

    res.render("auth/edit_profile", {
      pageTitle: "profile",
      path: "profile",
      role: req.user?.role,
      user: user,
    });
  },

  postEditProfileController: async (req, res) => {
    const userId = req.body.id;
    const UpdatedUsername = req.body.username;
    const UpdatedEmail = req.body.email;
    const UpdatedPassword = req.body.password;
    const UpdatedPhysicalAddress = req.body.physicalAddress;
    const UpdatedGender = req.body.gender;
    const UpdatedRole = req.body.role;

    const user = await User.findById(userId);

    user.username = UpdatedUsername;
    user.email = UpdatedEmail;
    user.password = UpdatedPassword;
    user.physicalAddress = UpdatedPhysicalAddress;
    user.gender = UpdatedGender;
    user.role = UpdatedRole;

    await user.save();
    console.log("User profile Updated....");

    return res.redirect("/profile");
  },

};
