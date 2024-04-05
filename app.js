const express = require('express');
var cors =require('cors')
require('dotenv').config();
require('./Models/db');

const userRouter = require('./Routes/user');
const shopRouter =require('./Routes/shop');
const shopItemRouter =require('./Routes/shopItem');
const customer =require('./Routes/customer');
const order =require('./Routes/order');
const app = express();

app.use(cors())
app.use(express.json());
app.use(userRouter);
app.use(shopRouter);
app.use(shopItemRouter);
app.use(customer);
app.use(order);

app.listen(8000, () => {
  console.log('Port is listening');
});
