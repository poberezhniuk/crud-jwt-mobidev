const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const cookieParser = require('cookie-parser');

const keys = require('../config/keys');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');
console.log(path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, '/views'));

// database connection
mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log('[OK] Database Connected!');
  })
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('pages/home.ejs'));
app.get('/cities', requireAuth, (req, res) => res.render('pages/cities'));

app.use(authRoutes);

// Cookies
app.get('/set-cookies', (req, res) => {
  res.cookie('newUser', false);
  res.cookie('isEmployee', true, { secure: true });

  res.send('you got cookies');
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`[OK] Server started on port ${port}!`));

// Implement colorfully logs
