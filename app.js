require('dotenv').config();
require('express-async-errors');

// security packages
const helmet = require("helmet");
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authenticationMiddleware = require('./middleware/authentication')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


// router middlewares
const jobsRouter = require('./routes/jobs')
const authenticationRouter = require('./routes/auth')

app.set('trust proxy', 1);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

const limiter = rateLimiter({
  windowMs: 1 * 60 * 1000,
  max: 5
})

app.use(limiter);


// extra packages

// routes
app.use('/api/v1/jobs', authenticationMiddleware, jobsRouter);
app.use('/api/v1/auth', authenticationRouter);

app.get('/', (req, res) => {
  res.status(200).send('jobs api');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
 
const start = async () => {
  await connectDB(process.env.MONGO_URI)
  try {
    app.listen(port, '0.0.0.0', () =>
      console.log(`Server is listening on port ${port}`)
  );
  } catch (error) {
    console.log(error);
  }
};

start();
