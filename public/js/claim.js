var CLAIM;
if (!CLAIM) {
  CLAIM = {};
}

var PATIENT;
if (!PATIENT) {
  PATIENT = {};
}

var CDEX;
if (!CDEX) {
  CDEX = {};
}

(function () {
  CLAIM.claimLookupByPatient = async (patientId) => {
    let accessToken = window.PAYER_SERVER_TOKEN;
    let accessTokenType = window.PAYER_SERVER_TOKEN_TYPE;

    let configProvider = {
      type: "GET",
      url: `${CDEX.payerEndpoint.url}/Claim?patient=${patientId}`,
      contentType: "application/json",
      headers: {
        authorization: `${accessTokenType} ${accessToken}`
      }
    };
    const claims = await $.ajax(configProvider)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });

    return claims;
  };

  CLAIM.claimLookupById = async (claim) => {
    let accessToken = window.PAYER_SERVER_TOKEN;
    let accessTokenType = window.PAYER_SERVER_TOKEN_TYPE;

    let configProvider = {
      type: "GET",
      url: `${CDEX.payerEndpoint.url}/Claim/${claim}`,
      contentType: "application/json",
      headers: {
        authorization: `${accessTokenType} ${accessToken}`
      }
    };
    let existingClaim = await $.ajax(configProvider)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.log(error);
        return {};
      });

    return existingClaim;
  };

  CLAIM.claimUpsert = async (claim, endpoint) => {
    let accessToken = window.PAYER_SERVER_TOKEN;
    let accessTokenType = window.PAYER_SERVER_TOKEN_TYPE;

    let configProvider = {
      type: "PUT",
      url: `${endpoint}/Claim/${claim.id}`,
      data: JSON.stringify(claim),
      contentType: "application/fhir+json",
      headers: {
        authorization: `${accessTokenType} ${accessToken}`
      }
    };
    const createdClaim = $.ajax(configProvider).then((response) => {
      return response;
    });
    return createdClaim;
  };
})();
