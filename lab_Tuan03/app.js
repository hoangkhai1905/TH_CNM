require('dotenv').config();
const express = require('express');
const session = require('express-session');

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');

app.use('/', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);

// Redirect root to products
app.get('/', (req, res) => {
  res.redirect('/products');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Using AWS DynamoDB for data storage');
});

module.exports = app;
