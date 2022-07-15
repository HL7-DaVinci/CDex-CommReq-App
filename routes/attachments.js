const { Router } = require('express');
const request = require('request');
const router = Router();
const _ = require('underscore');

const data = require('../attachments.json');

const axios = require('axios');

//Movies
router.get('/', (req, res) => {
    res.json(data);
});

router.post('/', (req, res) => {
    const { resourceType, parameter } = req.body;
    let operationOutcome = {
        "resourceType": "OperationOutcome",
        "id": "outcome_fatal",
        "issue": [
            {
                "severity": "fatal",
                "code": "not-found",
                "details": {
                    "text": `Patient not found.`
                }
            }
        ]
    };

    let claimExists = true;
    let memberId = '';
    let claimId = '';
    let attch;
    let attchId = '';
    let attchType = '';

    if (resourceType && parameter && resourceType === 'Parameters') {
        const baseurl = "https://api.logicahealth.org/DaVinciCDexProvider/open";

        parameter.forEach(element => {
            if (element.name === 'MemberId') {
                memberId = element.valueIdentifier.value;
            } else if (element.name === 'TrackingId') {
                claimId = element.valueString;
            } else if (element.name === 'Attachment') {
                attchId = element.resource.id;
                attch = element.resource.content[0];
                attchType = element.resource.content[0].attachment.contentType;
            }
        });
        return new Promise(resolve => {
            request(`${baseurl}/Patient/${memberId}`, { json: true }, (err, resp, body) => {
                if (!err)
                    resolve(body);
            })
        }).then(value => {
            if (value.resourceType != "Patient") {
                res.send(operationOutcome);
            } else {
                return new Promise((resolve, reject) => {
                    request(`${baseurl}/Claim?_id=${claimId}`, { json: true }, function (claimerror, claimresp, claimbody) {
                        if (!claimerror)
                            resolve(claimbody);
                    })
                }).then(value => {
                    if (value.total == 0) {
                        claimExists = false;
                        operationOutcome = {
                            "resourceType": "OperationOutcome",
                            "id": "outcome_noclaim",
                            "issue": [
                                {
                                    "severity": "warning",
                                    "code": "informational",
                                    "details": {
                                        "text": "Claim not found - will create base claim."
                                    }
                                }
                            ]
                        }
                    }
                    if (attchType == 'application/pdf') {
                        return new Promise((resolve) => {
                            request.post(`${baseurl}/Binary`, attch.attachment, function (binerr, binresp, binbody) {
                                if (!binerr)
                                    resolve(binbody);
                            })
                        }).then(value => {
                            return new Promise((resolve) => {
                                request.post(`${baseurl}/Parameters`, req.body, function (parerr, parresp, parbody) {
                                    if (!parerr)
                                        resolve(parbody);
                                })
                            }).then(value => {
                                const claimBody = {
                                    "resourceType": "Claim",
                                    "id": `${claimId}`,
                                    "identifier": `${claimId}`,
                                    "status": "active",
                                    "type": "institutional",
                                    "use": "claim",
                                    "patient": {
                                        "reference": `Patient/${memberId}`
                                    },
                                    "created": "2022-07-01T07:58:44.000+00:00",
                                    "provider": "cdex-example-practitioner",
                                    "priority": "normal",
                                    "insurance": [
                                        {
                                            "sequence": 1,
                                            "focal": true,
                                            "identifier": {
                                                "system": "http://CedarArmsMedicalCenter.com/claim",
                                                "value": "MED-00050"
                                            },
                                            "coverage": {
                                                "reference": "#coverage-1"
                                            }
                                        }
                                    ],
                                    "supportingInfo": [
                                        {
                                            "sequence": 1,
                                            "category": {
                                                "text": "sample text"
                                            },
                                            "valueReference": {
                                                "reference": `Binary/${attchId}`
                                            }
                                        }
                                    ],
                                    "total": "1234"
                                }
                                console.dir(claimBody);
                                new Promise((resolve) => {
                                    request.put({
                                        headers: { 'content-type': 'application/json' },
                                        url: `${baseurl}/Claim/${claimId}?upsert=true`,
                                        body: claimBody,
                                        json: true
                                    }, function (claimerr, claimresp, claimbody) {
                                        if (!claimerr) {
                                            console.log('--------------------------------------------');
                                            console.dir(claimbody);
                                            resolve(claimbody);
                                        } else
                                            console.dir(claimerr);
                                    })
                                }).then(value => {
                                    if (claimExists) {
                                        operationOutcome = {
                                            "resourceType": "OperationOutcome",
                                            "id": "outcome_ok",
                                            "issue": [
                                                {
                                                    "severity": "informational",
                                                    "code": "informational",
                                                    "details": {
                                                        "text": "Claim found and attachment saved."
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                    res.send(operationOutcome)
                                })
                            })
                        })
                    }
                })
            }
        })


    }
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, director, year, rating } = req.body;
    if (title && director && year && rating) {
        _.each(data, (movie, i) => {
            if (movie.id == id) {
                movie.title = title;
                movie.director = director;
                movie.year = year;
                movie.rating = rating;
            }
        });
        res.json(data);
    }
    else {
        res.status(500).json({ "error": "There was an error." });
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    _.each(data, (movie, i) => {
        if (movie.id == id) {
            data.splice(i, 1);
        }
    });
    res.send(data);
})

patientLookup = async (patient) => {
    let url = "https://api.logicahealth.org/DaVinciCDexProvider/open/Patient?identifier=" + patient;
    await axios.get(url).then((res) => {
        if (res.data.total === 0) {
            return false;
        } else {
            return true
        }
    }).catch((error) => {
        return error;
    });
}

module.exports = router;