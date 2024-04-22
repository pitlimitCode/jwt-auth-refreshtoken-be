const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
const jwt = require('jsonwebtoken');

app.use(cors());


// Expired limit time in seconds, need *1000 if use js Date miliseconds
const varCdTime = 10 ;
const toGTM7 = 7*60*60 // use GMT +7, need plus value with 7 Hours

let tokenExpired = -1;
let options = {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZone: "UTC",
};

app.get('/', (req, res) => { res.send('BackEnd Success') })

app.post('/login', (req, res) => { 
  let token = jwt.sign({}, 'secretKey', { expiresIn: varCdTime });
  jwt.verify(token, 'secretKey', function(err, decoded) {
    tokenExpired = decoded.exp;
  });
  tokenExpired = new Intl.DateTimeFormat("en-GB", options).format(tokenExpired*1000 + toGTM7*1000);
  return res.send({token, tokenExpired, varCdTime});
})

app.post('/refresh', (req, res) => { 
  // const headers = req.headers;
  // res.send({headers, token});

  const reqBody = req.body.jwt;
  // console.log(reqBody)
  jwt.verify(reqBody, 'secretKey', function(err, decoded) {
    if (err) {
      err = { token: 'expired' }
      // console.log({decoded})
      return res.send(err);
    } else {

      // tokenExpired = decoded.exp;
      // console.log({decoded, intv: decoded.iat-decoded.exp, tokenExpired})
      let token = jwt.sign({}, 'secretKey', { expiresIn: varCdTime });
      jwt.verify(token, 'secretKey', function(err, decoded) {
        tokenExpired = decoded.exp;
        // console.log({decoded, tokenExpired})
      });
      // const newDate = ((new Date()))+(varCdTime*1000);
      tokenExpired = new Intl.DateTimeFormat("en-GB", options).format(tokenExpired*1000 + toGTM7*1000)
      // console.log(tokenExpired);
      return res.send({token, tokenExpired});
    }
  });
  
})

// app.get('/users', db.getUsers)
// const getUsers = (request, response) => {
//   pool.query('SELECT * FROM v1 ORDER BY id DESC', (error, results) => {
//     if (error) { throw error }
//     response.status(200).send(results.rows)
//   })
// }

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server running on ${port}`));

// branch3