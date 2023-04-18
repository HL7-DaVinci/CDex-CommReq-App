const { Router } = require("express");
const request = require("request");
const router = Router();
const _ = require("underscore");

const data = require("../attachments.json");

const axios = require("axios");

const baseurl = "https://api.logicahealth.org/DaVinciCDexPayer/data";

router.post("/", (req, res) => {
  req.headers["accept"] = "application/fhir+json;charset=UTF-8";
  req.headers["content-type"] = "application/fhir+json;charset=UTF-8";
  const { resourceType, parameter } = req.body;
  let operationOutcome = {
    resourceType: "OperationOutcome",
    id: "outcome_fatal",
    issue: [
      {
        severity: "fatal",
        code: "not-found",
        details: {
          text: `Patient not found.`,
        },
      },
    ],
  };

  let claimExists = true;
  let memberId = "";
  let claimId = "";
  let attchId = "";
  let attchType = "";
  let resource = "";
  let existingClaim = "";
  const attachmentResource = Date.now();

  if (parameter && resourceType === "Parameters") {
    parameter.forEach((element) => {
      if (element.name === "MemberId") {
        memberId = element.valueIdentifier.value;
      } else if (element.name === "TrackingId") {
        claimId = element.valueString;
      } else if (element.name === "Attachment") {
        if (element.part[2].resource.resourceType === "Bundle") {
          attchId = element.part[2].resource.entry[3].resource.id;
          resource = element.part[2].resource.entry[3].resource;
          attchType = element.part[2].resource.entry[3].resource.resourceType;
        } else {
          attchId = element.part[3].resource.id;
          resource = element.part[3].resource;
          attchType = element.part[3].resource.resourceType;
        }
      }
    });
    //*******************
    patientLookup(memberId).then((value) => {
      if (value.resourceType != "Patient") {
        res.send(operationOutcome);
      } else {
        return claimLookup(claimId).then((value) => {
          if (value.resourceType !== "Claim") {
            existingClaim = "";
            claimExists = false;
            operationOutcome = {
              resourceType: "OperationOutcome",
              id: "outcome_noclaim",
              issue: [
                {
                  severity: "warning",
                  code: "informational",
                  details: {
                    text: "Claim not found - will create base claim.",
                  },
                },
              ],
            };
          } else {
            existingClaim = value;
            claimExists = true;
          }
          let resourceId = resource.id
            ? resource.id
            : `CDex-${resource.resourceType}-${attachmentResource}`;
          return createResource(resource, resourceId).then((value) => {
            return createParameter(req, resourceId).then((value) => {
              upsertClaim(
                claimId,
                memberId,
                `${resource.resourceType}/${resourceId}`,
                existingClaim,
                value
              ).then((value) => {
                if (claimExists) {
                  operationOutcome = {
                    resourceType: "OperationOutcome",
                    id: "outcome_ok",
                    issue: [
                      {
                        severity: "informational",
                        code: "informational",
                        details: {
                          text: "Claim found and attachment saved.",
                        },
                      },
                    ],
                  };
                }
                res.send(operationOutcome);
              });
            });
          });
        });
      }
    });
    //*******************
    let resourceId = resource.id
      ? resource.id
      : `CDex-${resource.resourceType}-${attachmentResource}`;
    return createParameter(req, resourceId).then((value) => {
      res.send(value); //Operation outcome should be the response
    });
  }
});

createParameter = async (req, attachmentResource) => {
  return new Promise((resolve) => {
    req.headers["content-type"] = "application/fhir+json";
    req.headers["Accept"] = "application/fhir+json";
    request.put(
      {
        headers: { "content-type": "application/fhir+json" },
        url: `${baseurl}/Parameters/${
          req.body.id ? req.body.id : `Parameter-with-${attachmentResource}`
        }`,
        body: req.body,
        json: true,
      },
      function (parerr, parresp, parbody) {
        if (!parerr) resolve(parbody);
      }
    );
  });
};

createBinary = async (attch, attachmentResource) => {
  return new Promise((resolve) => {
    const binaryBody = {
      resourceType: "Binary",
      id: `CDex-${attachmentResource}`,
      contentType: "application/pdf",
      data: `${attch.attachment.data}`,
    };
    request.put(
      {
        headers: { "content-type": "application/fhir+json" },
        url: `${baseurl}/Binary/CDex-${attachmentResource}`,
        body: binaryBody,
        json: true,
      },
      function (binerr, binresp, binbody) {
        if (!binerr) resolve(binbody);
      }
    );
  });
};

createResource = async (attch, attachmentResource) => {
  if (attch.resourceType === "Bundle") {
    return;
  }
  return new Promise((resolve) => {
    request.put(
      {
        headers: { "content-type": "application/fhir+json" },
        url: `${baseurl}/${attch.resourceType}/${attachmentResource}`,
        body: attch.content,
        json: true,
      },
      function (binerr, binresp, binbody) {
        if (!binerr) resolve(binbody);
      }
    );
  });
};

claimLookup = async (claimId) => {
  return new Promise((resolve, reject) => {
    request(
      `${baseurl}/Claim/${claimId}`,
      { json: true },
      function (claimerror, claimresp, claimbody) {
        if (!claimerror) resolve(claimbody);
      }
    );
  });
};

patientLookup = async (memberId) => {
  return new Promise((resolve) => {
    request(
      `${baseurl}/Patient/${memberId}`,
      { json: true },
      (err, resp, body) => {
        if (!err) resolve(body);
      }
    );
  });
};

upsertClaim = async (
  claimId,
  memberId,
  reference,
  existingClaim,
  parameter
) => {
  let claimBody = "";
  let supportingInfo = [];
  if (reference.includes("Bundle/")) {
    parameter.parameter.forEach((param) => {
      if (param.name === "Attachment") {
        param.part.forEach((parts) => {
          if (parts.name === "Content") {
            parts.resource.entry.forEach((entry) => {
              if (entry.resource.content) {
                supportingInfo.push({
                  sequence: param.part[0].valueString,
                  category: 1,
                  valueReference: {
                    reference: `${entry.resource.resourceType}/${entry.resource.id}`,
                  },
                });
              }
            });
          }
        });
      }
    });
  } else {
    supportingInfo.push({
      sequence: 1,
      category: 1,
      valueReference: {
        reference: `${reference}`,
      },
    });
  }
  if (existingClaim === "") {
    claimBody = {
      resourceType: "Claim",
      id: `${claimId}`,
      identifier: `${claimId}`,
      status: "active",
      type: "institutional",
      use: "claim",
      patient: {
        reference: `Patient/${memberId}`,
      },
      created: "2022-07-01T07:58:44.000+00:00",
      provider: "cdex-example-practitioner",
      priority: "normal",
      insurance: [
        {
          sequence: 1,
          focal: true,
          identifier: {
            system: "http://CedarArmsMedicalCenter.com/claim",
            value: "MED-00050",
          },
          coverage: {
            reference: "#coverage-1",
          },
        },
      ],
      supportingInfo: supportingInfo,
      total: "1234",
    };
  } else {
    claimBody = existingClaim;
    claimBody.supportingInfo = supportingInfo;
  }

  return new Promise((resolve) => {
    request.put(
      {
        headers: { "content-type": "application/fhir+json" },
        url: `${baseurl}/Claim/${claimId}?upsert=true`,
        body: claimBody,
        json: true,
      },
      function (claimerr, claimresp, claimbody) {
        if (!claimerr) {
          resolve(claimbody);
        } else {
          console.dir(claimerr);
        }
      }
    );
  });
};

module.exports = router;
