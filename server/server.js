require('dotenv').config();
const express = require('express');
const massive = require('massive');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const session = require('express-session');

const app = express();
const {
  SERVER_PORT,
  SESSION_SECRET,
  DOMAIN,
  CLIENT_ID,
  CLIENT_SECRET,
  CALLBACK_URL,
  CONNECTION_STRING
} = process.env;

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: SESSION_SECRET
}));

massive(CONNECTION_STRING).then( db => {
  app.set('db', db)
});

app.use(express.static(__dirname + './../build'));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Auth0Strategy({
  domain: DOMAIN,
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: CALLBACK_URL
}, (accessToken, refreshToken, extraParams, profile, done) => {
  // db calls
  const db = app.get('db');
  // really important condition
  db.find_user([profile.id]).then(userResult => {
    if (!userResult[0]) { // returns empty arr if user not found
      db.create_user([profile.displayName, profile.id, profile.picture]).then(createUser => {
        return done(null, createUser[0].id);
      })
    } else {
      return done(null, userResult[0].id)
    }
  });



  //we don't need below done because we need to use above condition done 
  //done(null, profile); //you breakpoint here and see what is it in the profile!!!!
}));

// runs one time when u login
passport.serializeUser((id, done) => { //we are only taking id from auth_profile.i
  // puts profile info in the session
  done(null, id);
});

// runs before each endbpoint is hit, after login
passport.deserializeUser((id, done) => { //go get the id from session && deserializer only work with session
  // puts info on req.user !!!  => also u can access req.session.passport. 
  app.get('db').find_session_user([id]).then (loggedInUser => {
    done(null, loggedInUser[0]);
  });
  // done(null, id);
});

// Login
app.get('/auth', passport.authenticate('auth0'));

// Callback url
app.get('/auth/callback', passport.authenticate('auth0', {
  successRedirect: 'http://localhost:3000/#/private', // hash should be there //need to move  3000 to 3002 before build process
  failureRedirect: 'http://localhost:3000'  //need to move  3000 to 3002 before build process
}));

app.get('/auth/me', (req, res) => {
  if (req.user) {
    res.status(200).send(req.user);
  } else {
    res.status(401).send('nice try');
  }
});

app.get('/auth/logout', (req, res) => {
  req.logOut(); // .logout() built in method to kill session
  res.redirect('http://localhost:3000/') //need to move  3000 to 3002 before build process
});

app.listen(SERVER_PORT, () => console.log(`Server is up: ${SERVER_PORT}`))