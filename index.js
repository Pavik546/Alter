const express = require('express');
const bodyParser = require('body-parser'); // add sequlize file from controller
const routes = require('./routes/route');
const cors = require('cors');
const User = require('./models/user');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const geoip = require('geoip-lite');
const userAgent = require('express-useragent');


const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.SESSION_SECRET




 
app.use(userAgent.express());

mongoose.set('debug', false);
mongoose.connect('mongodb+srv://pavik546:admin@cluster0.cf1cf.mongodb.net/test')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        // console.log(req)
    });
    
  })
  .catch((error) => {
    console.log(error);
  });
   
const port = 10000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
    const swaggerOptions = {
        swaggerDefinition: {
          openapi:'3.0.0',
          info: {
            title:'Url Shorten API',
            description: 'Url Shorten API Documentation',
            version: '1.0.0',
          },
        },
        apis: ['./swagger.js'], 
      };
      const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));  
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limit to all requests
app.use(limiter);

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
  
  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Passport serialization
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  
  // Configure Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      (accessToken, refreshToken, profile, done) => {
        // Process the user profile here
        return done(null, profile);
      }
    )
  );
  
  // Routes
  app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
  });
  
  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    async(req, res) => {
      const payload = {
        id: req.user.id
       
      };


      const filter = { user_id: req.user.id }; // Match based on user_id
      const update = {
        $set: {
          user_name: req.user.displayName,
          user_email: req.user.emails[0].value,
        }
      };
      // Return the updated document if found
      
       await User.findOneAndUpdate(filter, update);
      const token = await jwt.sign(payload, secretKey);
      return res.json({message:`Hello, ${req.user.displayName} your are login sucessfully`,token:token});
    }
  );
  
  app.get('/logout', (req, res) => {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect('/');
    });
  });

  app.use('/api',isAuthenticated,routes)

  app.get('/api/profile', isAuthenticated, (req, res) => {
    res.json({
      user: {
        id: req.user.id,
        name: req.user.displayName,
        email: req.user.emails[0].value,
      },
    });
  });


  async function isAuthenticated(req, res, next) {
    try{
    
    const authHeader = req.headers.authorization; // Get the Authorization header
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }
  
    // Check if the header contains the Bearer token
    const token = authHeader.split(' ')[1]; // Split to get the token part
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = await jwt.verify(token, secretKey);
    if(decoded){
      req.user=decoded
      next()
    }
    else{
      return res.status(401).json({ message: 'Unauthorized' });

    }
  }
  catch(error){
    if(error.message==='invalid token'){
      return res.status(401).json({ message: 'Unauthorized' });

    }
    return res.status(500).json({message:error.message})
  }
    
  }

