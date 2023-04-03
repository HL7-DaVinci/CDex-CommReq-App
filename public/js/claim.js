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
    let accessToken = JSON.parse(sessionStorage.getItem("tokenResponse"));
    let configProvider = {
      type: "GET",
      url: `${CDEX.payerEndpoint.url}/Claim?patient=${patientId}`,
      contentType: "application/json",
      headers: {
        authorization: `${accessToken.token_type} ${accessToken.access_token}`,
      },
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
    let accessToken = JSON.parse(sessionStorage.getItem("tokenResponse"));
    let configProvider = {
      type: "GET",
      url: `${CDEX.payerEndpoint.url}/Claim/${claim}`,
      contentType: "application/json",
      headers: {
        authorization: `${accessToken.token_type} ${accessToken.access_token}`,
      },
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
    let accessToken = JSON.parse(sessionStorage.getItem("tokenResponse"));
    let configProvider = {
      type: "PUT",
      url: `${endpoint}/Claim/${claim.id}?upsert=true`,
      data: JSON.stringify(claim),
      contentType: "application/json",
      headers: {
        authorization: `${accessToken.token_type} ${accessToken.access_token}`,
      },
    };
    const createdClaim = $.ajax(configProvider).then((response) => {
      console.dir(response);
      return response;
    });
    return createdClaim;
  };
})();
