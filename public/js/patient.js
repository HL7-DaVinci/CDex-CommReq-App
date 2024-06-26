var PATIENT;
if (!PATIENT) {
    PATIENT = {};
}

var CLAIM;
if (!CLAIM) {
    CLAIM = {};
}

var CDEX;
if (!CDEX) {
    CDEX = {};
}

(function () {
    PATIENT.patientLookup = async (patient) => {
        let accessToken = process.env.PAYER_SERVER_TOKEN;
        let accessTokenType = process.env.PAYER_SERVER_TOKEN_TYPE;
        let url = CDEX.payerEndpoint.url + "/Patient?identifier=" + patient;
        const exists = await $.ajax(url).then((res) => {
            if (res.total > 0) {
                return true
            }
            return false;
        }).catch((error) => {
            console.log(error);
            return false;
        });

        return exists
    }
}());