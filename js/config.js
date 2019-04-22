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
      "FHIRQuery": [{"name": "Observation", "FHIRQueryString": "Observation?category=vital-signs"},
          {"name": "Encounter", "FHIRQueryString": "Encounter?status=planned"}],
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
