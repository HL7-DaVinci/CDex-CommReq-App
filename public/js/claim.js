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
        let url = `${CDEX.payerEndpoint.url}/Claim?patient=${patientId}`;
        const claims = await $.ajax(url).then((res) => {
            return res;
        }).catch((error) => {
            console.log(error);
            return error;
        });

        return claims;
    };

    CLAIM.claimLookupById = async (claim) => {
        let url = `${CDEX.payerEndpoint.url}/Claim/${claim}`;
        let existingClaim = await $.ajax(url).then((res) => {
            return res;
        }).catch((error) => {
            console.log(error);
            return {};
        });

        return existingClaim;
    };

    CLAIM.claimUpsert = async (claim, endpoint) => {
        let configProvider = {
            type: 'PUT',
            url: `${endpoint}/Claim/${claim.id}?upsert=true`,
            data: JSON.stringify(claim),
            contentType: "application/json"
        };
        const createdClaim = $.ajax(configProvider).then(response => {
            console.dir(response);
            return response;
        });
        return createdClaim;
    };
}());