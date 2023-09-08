const { Router } = require("express");
const request = require("request");
const router = Router();
const _ = require("underscore");

const priorFHIRBase = "https://prior-auth.davinci.hl7.org/fhir";

router.post("/", (req, res) => {
  req.headers["accept"] = "application/json";
  req.headers["content-type"] = "application/json";
  req.headers["Authorization"] = "Bearer Y3YWq2l08kvFqy50fQJY";
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
        Authorization: 'Bearer Y3YWq2l08kvFqy50fQJY'
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
