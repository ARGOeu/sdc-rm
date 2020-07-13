const express = require('express')
const https = require('https');
const axios = require('axios');
const app = express()
const bodyParser = require("body-parser");
const router = express.Router();
var config = require('./config.json');

const remoteURL = config.remote_url;
const cors = require('cors')

const rateLimit = require("express-rate-limit");
 
const limiter = rateLimit({
  windowMs: config.ratelimit_window_ms,
  max: config.ratelimit_max_requests
});
 
app.use(cors());
app.use(limiter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/api/',(request,response) => {
    data = request.body

    axios.get(remoteURL
    ,
      {
       httpsAgent: new https.Agent({
        rejectUnauthorized: false
        })})
      .then((remoteResp) => {
        response.send(remoteResp.data);
      }, (error) => {
        console.log(error);
        response.send("error");
      });
   
});



app.use("/", router);
const port = config.port


app.listen(port, () => console.log(`rm-proxy-app listening...`))
