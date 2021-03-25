const express = require('express');
const app = express();
const axios = require('axios').default;
// const CircuitBreaker = require('opossum');

var cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({
      message:"hello from aws ec2 instance"
  })
});


app.listen(5000, () => {
    console.log("microservice-1 is listening on port 5000");
});

