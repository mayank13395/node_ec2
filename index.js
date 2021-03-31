const express = require('express');
const app = express();
const axios = require('axios').default;
const CircuitBreaker = require('opossum');


var cors = require('cors');
app.use(cors());
const randomFailure = (echo) => {
    console.log("echo:-",Math.random());
    return Math.random()>0.5 ? Promise.reject("\n") : Promise.resolve(echo);
  };

const microservicesApi = (id) => {
    const url = id==1?'http://localhost:3000/':'http://localhost:5000/'
   return axios.get(url);
}
  
  const options = {
    timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
    errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
    resetTimeout: 30000 // After 30 seconds, try again.
  };
  const breaker = new CircuitBreaker(microservicesApi, options);

 app.get('/', (req, res) => {
     let id = req.query.id;
     console.log("service:-",id);
    //  console.log("server-2 called");
    breaker.fire(id)
      .then((result) => {
          console.log("result:-",result);
        result += `success: ${breaker.stats.successes}`;
        res.status(200).send(result);
      })
      .catch((err) => {
          console.log("err:-",err);
        res.status(500).send(err);
      });

    // breaker.fallback(() => 'Sorry, out of service right now');
    // breaker.on('fallback', (result) => reportFallbackEvent(result));
  });
app.listen(4000,()=>{
    console.log("----------------------------------------------------");
    console.log("microservice-2 is listening on port 4000");
})
