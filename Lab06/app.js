const express = require('express')
const path = require('path')
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');

const app = express();

app.set('view engine',  'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})