const express = require('express');
const app = express();
//const https = require("https");
const http = require("http");
const fs = require("fs");
const cors = require('cors');
const { Server } = require('socket.io');
const { createHash } = require('crypto');

const api = require("./api");
const env = require("./config/env");

//db
const db = require('./config/db');
const Collateral = require('./models/Collateral');

const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const path = require("path");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use("/api", api);

// DB connect
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

const server = http.createServer(app);

// const httpsPort = 3306;
// const privateKey = fs.readFileSync("/etc/letsencrypt/live/degenland.tech/privkey.pem");
// const certificate = fs.readFileSync("/etc/letsencrypt/live/degenland.tech/fullchain.pem");

// const credentials = {
//   key: privateKey,
//   cert: certificate,
// }

// const server = https.createServer(credentials, app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

server.listen(5000, () => 'Server is running on port 5000');
// server.listen(httpsPort, () => {
//   console.log(`[degenland.tech] servier is running at port ${httpsPort} as https.`);
// });