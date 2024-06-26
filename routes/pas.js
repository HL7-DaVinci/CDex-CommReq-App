const { Router } = require("express");
const request = require('@cypress/request');
const router = Router();
const _ = require("underscore");

const priorFHIRBase = process.env.PAS_SERVER_URL;
const PAS_auth = "Bearer "+process.env.PAS_SERVER_TOKEN;
router.post("/", (req, res) => {
  req.headers["accept"] = "application/json";
  req.headers["content-type"] = "application/json";
  req.headers["Authorization"] = PAS_auth;
  const { resourceType, parameter } = req.body;
  if(resourceType !== "Bundle") {
    res.status(400).send("Invalid request Body");
  } else {
    const options = {
      method: 'POST',
      url: `${priorFHIRBase}/Claim/$submit`,
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: PAS_auth
      },
      body: JSON.stringify(req.body)
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      res.status(200).send(response.body);
    });
  }
});


pasRequest = async (bundleRequest) => {
  return new Promise((resolve, reject) => {
    request(
      `${priorFHIRBase}/Claim/$submit`,
      { json: true, data: bundleRequest, method: "POST" },
      function (error, resp) {
        if (!error) resolve(resp);
        else {
          resolve(`Request failed: ${error}`);
        }
      }
    );
  });
};

module.exports = router;
