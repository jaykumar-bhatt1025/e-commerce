import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

import orderRoutes from './src/routes/order';
import cartRoutes from './src/routes/cart';
import userRoutes from './src/routes/users.route';

import addressRoutes from './src/routes/address.route';

import categoryRoutes from './src/routes/category';
import subCategoryRoutes from './src/routes/subCategory';
import brandRoutes from './src/routes/brand';
import productRoutes from './src/routes/product';
import complaintRoutes from './src/routes/complaint';
import feedbackRoutes from './src/routes/feedback';

dotenv.config();
require('./src/config/sequelize');

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(express.static(`${__dirname}/public`));
app.use(cors());
app.use(bodyParser.json());
app.use('/order', orderRoutes);
app.use('/cart', cartRoutes);

app.use('/', userRoutes);

app.use('/', addressRoutes);

app.use('/category', categoryRoutes);
app.use('/subcategory', subCategoryRoutes);
app.use('/brand', brandRoutes);
app.use('/product', productRoutes);
app.use('/complaint', complaintRoutes);
app.use('/feedback', feedbackRoutes);

module.exports = app;
