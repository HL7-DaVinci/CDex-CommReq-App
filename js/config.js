var CDEX;
if (!CDEX) {
    CDEX = {};
}

(function () {

  CDEX.clientSettings = {
    "client_id": "bed3bfd0-17d1-473f-90ac-c006fec5e9c9",
    "scope"    : "patient/*.* openid profile"
  };

  CDEX.submitEndpoint = "/CommunicationRequest?_id=cdex-example-solicited-attachment-request$submit-data";

  CDEX.providerEndpoints = [{
      "name": "DaVinci CDex Provider (Open)",
      "type": "open",
      "url": "https://api-v8-r4.hspconsortium.org/DaVinciCDexProvider/open"
  }
    ,
    {
      "name": "DaVinci CDex Provider",
      "type": "secure-smart",
      "url": "https://api-v8-r4.hspconsortium.org/DaVinciCDexProvider/data",
      "clientID": "4a71a430-0316-4e2a-8477-7671d7d3b862",
      "scope": "user/*.write"
    }
  ];

  // default configuration
  CDEX.configSetting = 0; // HSPC Payer Demo (Open)
  CDEX.providerEndpoint = CDEX.providerEndpoints[CDEX.configSetting];

  CDEX.menu = {
      "DocRef": ["type1", "type2", "type3", "type4"],
      "FHIRQuery": [
          {
              "name": "What are the A1C results after 2018-01-01 for this patient?",
              "FHIRQueryString": "Observation?patient=[the patient's id]&date=ge2018-01-01&code=4548-4",
          },
          {
              "name": "What are the patient's vital sign measurements in reverse chronological order?",
              "FHIRQueryString": "Observation?_sort=-date&patient=[this patient's id]&category=vital-signs"
          },
          {
              "name": "What are the patient's active conditions?",
              "FHIRQueryString": "Condition?patient=[this patient's id]&clinicalstatus=active"
          },
          {
              "name": "What is the patient's current smoking status?",
              "FHIRQueryString": "Observation?patient=1032702&code=72166-2&_sort=-date&_count=1"
          },
          {
              "name": "What medications is the patient taking?",
              "FHIRQueryString": "MedicationStatement?patient=[this patient's id]"
          },
          {
              "name": "What devices does the patient have?",
              "FHIRQueryString": "Device?patient=[this patient's id]"
          },
          {
              "name": "What procedures has the patient had?",
              "FHIRQueryString": "Procedure?patient=[this patient's id]"
          },
          {
              "name": "Who is the patient's Primary Care Provider?",
              "FHIRQueryString": "Patient/this patient's id"
          },
          {
              "name": "What type of health insurance does the patient have?",
              "FHIRQueryString": "Coverage?patient=[this patient's id]&status=active"
          }],
      "Input": []

  };

  CDEX.operationPayload = {
        "resourceType": "CommunicationRequest",
        "identifier": [
            {
                "system": "http://www.jurisdiction.com/insurer/123456",
                "value": "ABC123",
                "_value": {
                    "fhir_comments": [
                        "  this is the value to which the response will refer  "
                    ]
                }
            }
        ],
        "groupIdentifier": {
        "value": "12345"
        },
        "status": "active",
        "category": [
        {
            "coding": [
                    {
                        "system": "http://acme.org/messagetypes",
                        "code": "SolicitedAttachmentRequest"
                    }
                ]
            }
        ],
        "priority": "routine",
        "medium": [
        {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationMode",
                        "code": "WRITTEN",
                        "display": "written"
                    }
                ],
                "text": "written"
            }
        ],
        "subject": {
            "reference": "Patient/cdex-example-patient"
         },
        "about": [
            {
                "reference": "Claim/cdex-example-claim"
            }
        ],
        "encounter": {
            "reference": "Encounter/cdex-example-encounter"
        },
          "payload": [
              {
                  "contentString": ""
              }
          ],
        "occurrenceDateTime": "2016-06-10T11:01:10-08:00",
        "authoredOn": "2019-04-17T10:41:46.496Z",
        "requester": {
        "reference": "Practitioner/cdex-example-practitioner"
    },
        "recipient": [
        {
            "reference": "Organization/cdex-example-provider"
        }
    ],
        "sender": {
        "reference": "Organization/cdex-example-payer"
    }

  };

}());
