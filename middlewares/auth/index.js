const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const { user, partner } = require("../../models");

exports.signup = (req, res, next) => {
  passport.authenticate("signup", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: err,
      });
    }

    if (!user) {
      return res.status(401).json({
        message: info.message,
      });
    }

    req.user = user;

    next();
  })(req, res, next);
};

passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        let find = await user.findOne({ where: { email: req.body.email } });
        if (find) {
          return res.status(409).json({
            message: "email already in use",
          });
        } else {
          let userSignUp = await user.create(req.body);

          return done(null, userSignUp, {
            message: "User can be created",
          });
        }
      } catch (e) {
        return done(null, false, {
          message: "This email is already in use",
        });
      }
    }
  )
);

exports.signin = (req, res, next) => {
  passport.authenticate("signin", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: err,
      });
    }

    if (!user) {
      return res.status(401).json({
        message: info.message,
      });
    }

    req.user = user;

    next();
  })(req, res, next);
};

passport.use(
  "signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        let userSignIn = await user.findOne({
          where: { email: req.body.email },
        });

        if (!userSignIn) {
          return done(null, false, {
            message: "Email or password is wrong",
          });
        }

        let validate = await bcrypt.compare(password, userSignIn.password);

        if (!validate) {
          return done(null, false, {
            message: "Email or password is wrong",
          });
        }

        return done(null, userSignIn, {
          message: "User can sign in",
        });
      } catch (e) {
        return done(null, false, {
          message: "User can't sign in",
        });
      }
    }
  )
);

exports.signupPartner = (req, res, next) => {
  passport.authenticate("signupPartner", { session: false }, (err, partner, info) => {
    if (err) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: err,
      });
    }

    if (!partner) {
      return res.status(401).json({
        message: info.message,
      });
    }

    req.partner = partner;

    next();
  })(req, res, next);
};

passport.use(
  "signupPartner",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        let find = await partner.findOne({ where: { email: req.body.email } });
        if (find) {
          return res.status(409).json({
            message: "email already in use",
          });
        } else {
          let partnerSignUp = await partner.create(req.body);

          return done(null, partnerSignUp, {
            message: "User Partner can be created",
          });
        }
      } catch (e) {
        console.log(e)
        return done(null, false, {
          message: "This email is already in use",
        });
      }
    }
  )
);

exports.signinPartner = (req, res, next) => {
  passport.authenticate("signinPartner", { session: false }, (err, partner, info) => {
    if (err) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: err,
      });
    }

    if (!partner) {
      return res.status(401).json({
        message: info.message,
      });
    }

    req.partner = partner;

    next();
  })(req, res, next);
};

passport.use(
  "signinPartner",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        let partnerSignIn = await partner.findOne({
          where: { email: req.body.email },
        });

        if (!partnerSignIn) {
          return done(null, false, {
            message: "Email not found",
          });
        }

        let validate = await bcrypt.compare(password, partnerSignIn.password);

        if (!validate) {
          return done(null, false, {
            message: "Wrong password",
          });
        }

        return done(null, partnerSignIn, {
          message: "User Partner can sign in",
        });
      } catch (e) {
        return done(null, false, {
          message: "User Partner can't sign in catch",
        });
      }
    }
  )
);

exports.adminOrUser = (req, res, next) => {
  passport.authorize("adminOrUser", (err, user, info) => {
    if (err) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: err.message,
      });
    }

    if (!user) {
      return res.status(403).json({
        message: info.message,
      });
    }

    req.user = user;

    next();
  })(req, res, next);
};

passport.use(
  "adminOrUser",
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        let userSignIn = await user.findOne({ _id: token.user.id });

        if (
          userSignIn.role.includes("user") ||
          userSignIn.role.includes("admin")
        ) {
          return done(null, token.user);
        }

        return done(null, false, {
          message: "You're not authorized",
        });
      } catch (e) {
        return done(null, false, {
          message: "You're not authorized",
        });
      }
    }
  )
);