require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const User = require('./models/User');

// Роуты
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const profileRoutes = require('./routes/profile');
const casesRoutes = require('./routes/cases');
const shopRoutes = require('./routes/shop');
const tradeRoutes = require('./routes/trade');
const chatRoutes = require('./routes/chat');
const searchRoutes = require('./routes/search');
const donateRoutes = require('./routes/donate');
const topRoutes = require('./routes/top');
const inventoryRoutes = require('./routes/inventory');
const openCaseRoutes = require('./routes/openCase');

const app = express();

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('? MongoDB connected'))
  .catch(err => console.log('? MongoDB error:', err));

// Middleware
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // ? ОБЯЗАТЕЛЬНО для POST JSON

app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultsecret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport Steam
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new SteamStrategy({
  returnURL: 'http://localhost:5000/auth/steam/return',
  realm: 'http://localhost:5000/',
  apiKey: process.env.STEAM_API_KEY
}, async (identifier, profile, done) => {
  const steamId = profile.id;
  let user = await User.findOne({ steamId });

  if (!user) {
    user = new User({
      steamId,
      personaname: profile.displayName,
      avatar: profile.photos[2].value
    });
    await user.save();
  }

  return done(null, user);
}));

// Роуты
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/cases', casesRoutes);
app.use('/shop', shopRoutes);
app.use('/trade', tradeRoutes);
app.use('/chat', chatRoutes);
app.use('/search', searchRoutes);
app.use('/donate', donateRoutes);
app.use('/top', topRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/open', openCaseRoutes);

// Запуск
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`?? Сервер запущен: http://localhost:${PORT}`));
