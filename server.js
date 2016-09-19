const express = require('express')
const app = express()


app.get('/', function (req, res) {
  
  const result = {
    ipaddress: req.headers['x-forwarded-for'],
    language: req.headers['accept-language'].split(',')[0],
    software: req.headers['user-agent'].match(/\(([^)]+)\)/)[1]
  }
  
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(result, null))
  
  //console.dir(result)
})


app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
})
