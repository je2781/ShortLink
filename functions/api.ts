import bodyParser from 'body-parser';
import express from 'express';
import serverless from 'serverless-http';
import path from 'path';
import mongoose from 'mongoose';
require("dotenv").config();

import shortRoutes from '../routes/shortest';
import { get500Page, getPageNotFound} from '../controllers/error';

const app = express();

//parsing body of client request - for json data
app.use(bodyParser.json());
//parsing body of client request - only for text requests
app.use(bodyParser.urlencoded({ extended: false }));
//funneling static files request to public folder
app.use(express.static(path.join(__dirname, '..', 'public')));

//express app config settings
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.use(shortRoutes);


app.use(getPageNotFound);
app.use(get500Page);


mongoose.connect(process.env.MONGODB_URI!).then((_) => {
  console.log('connected to database')
  app.listen(3000);
}
  );

// module.exports.handler = serverless(app);
