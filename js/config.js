var CDEX;
if (!CDEX) {
    CDEX = {};
}

(function () {

  CDEX.clientSettings = {
    "client_id": "bed3bfd0-17d1-473f-90ac-c006fec5e9c9",
    "scope"    : "patient/*.* openid profile"
  };

  CDEX.submitEndpoint = "/CommunicationRequest/";
  CDEX.submitTaskEndpoint = "/Task/";

  CDEX.providerEndpoints = [{
      "name": "HSPC CDex Provider (Open)",
      "type": "open",
      "url": "https://api.logicahealth.org/DaVinciCDexProvider/open"
  }
  ];

  //Change URL and Name if you want to change the destination of returned Communication to this CommunicationRequest
  CDEX.payerEndpoint = {
      "name": "HSPC CDex Payer (Open)",
      "type": "open",
      "url": "https://api.logicahealth.org/DaVinciCDexPayer/open"
  };

  // default configuration
  CDEX.configSetting = 0; // HSPC Provider Demo (Open)
  CDEX.providerEndpoint = CDEX.providerEndpoints[CDEX.configSetting];

   CDEX.scenarioDescription = {
        "description" : "In this scenario, the user works for a payer and wishes to\n" +
            "            request clinical data from the provider to support\n" +
            "            a post-payment audit. In the next screens, the user\n" +
            "            will select clinical documents, specific clinical\n" +
            "            data, or create a general information request that\n" +
            "            will be sent to and fulfilled by the provider. The\n" +
            "            selection options are examples and not wholly representative\n" +
            "            of all therequested  data available. Data that can be\n" +
            "            represented in FHIR and supported by the provider system\n" +
            "            could be created using the CDex approach."
   }

  CDEX.menu = {
      "DocRef": {
          "name": "Clinical Notes",
          "description": "Type",
          "values": [
              {
                  "name": "History and Physical Notes",
                  "generalCode": "34117-2"
              },
              {
                  "name": "Progress Notes",
                  "generalCode": "11506-3"
              },
              {
                  "name": "Referral Notes",
                  "generalCode": "57133-1"
              },
              {
                  "name": "Consultation Notes",
                  "generalCode": "11488-4"
              },
              {
                  "name": "Procedure Notes",
                  "generalCode": "28570-0"
              },
              {
                  "name": "Care Plans",
                  "generalCode": "18776-5"
              },
              {
                  "name": "Continuity of Care Documents",
                  "generalCode": "34133-9"
              }
          ],
        },
      "FHIRQuery": {
          "name": "Structured Data",
          "description": "Request",
          "values": [
              {
                  "name": "What are the A1C results after 2018-01-01 for this patient?",
                  "FHIRQueryString": "Observation?patient=[this patient's id]&date=ge2018-01-01&code=4548-4",
              },
              {
                  "name": "What are the patient's vital sign measurements in reverse chronological order?",
                  "FHIRQueryString": "Observation?_sort=-date&patient=[this patient's id]&category=vital-signs"
              },
              {
                  "name": "What are the patient's active conditions?",
                  "FHIRQueryString": "Condition?patient=[this patient's id]&clinical-status=active"
              },
              {
                  "name": "What is the patient's current smoking status?",
                  "FHIRQueryString": "Observation?patient=[this patient's id]&code=72166-2&_sort=-date&_count=1"
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
                  "FHIRQueryString": "Patient/[this patient's id]"
              },
              {
                  "name": "What type of health insurance does the patient have?",
                  "FHIRQueryString": "Coverage?patient=[this patient's id]&status=active"
              }
          ]
      }

  };

  CDEX.operationPayload = {
    "resourceType": "CommunicationRequest",
    "contained": [
        {
            "resourceType": "Organization",
            "id": "ORGANIZATIONID",
            "identifier": [
                {
                    "system": "SYSTEMURL",
                    "value": "SYSTEMNAME"
                }
            ]
        }],
    "id": "RESOURCE_ID",
    "status": "active",
    "priority": "routine",
    "subject": {
        "reference": "Patient/cdex-example-patient"
     },
    "authoredOn": "TIMESTAMP",
    "recipient": [{
        "reference": "ORGANIZATIONID"
    }]
  };

  CDEX.taskPayload = {
    "resourceType": "Task",
    "id": "RESOURCEID",
    "meta": {
        "profile": [
            "http://hl7.org/fhir/us/davinci-hrex/StructureDefinition/hrex-task-data-request"
        ]
    },
    "basedOn": [
      {
        "reference": "Claim/cdex-example-claim"
      }
    ],
    "status": "requested",
    "intent": "order",
    "code": {
        "coding": [
          {
            "system": "http://hl7.org/fhir/us/davinci-hrex/CodeSystem/hrex-temp",
            "code": "data-request"
          }
        ]
    },
    "for": {
      "reference": "Patient/cdex-example-patient"
    },
    "authoredOn": "TIMESTAMP",
    "lastModified": "TIMESTAMP",
    "requester": {
      "reference": "Organization/cdex-example-payer"
    },
    "owner": {
      "reference": "Organization/cdex-example-payer"
    },
    "reasonCode": {
        "text": "Support prior authorization decision-making"
    },
    "reasonReference": {
        "reference": "Claim/cdex-example-claim"
    },
    "input": []
  };

  CDEX.extensionDocRef = {
        "type": {
            "coding": [
                {
                "system": "http://hl7.org/fhir/us/davinci-hrex/CodeSystem/hrex-temp",
                "code": "data-code"
                }
            ]
        },
        "valueCodeableConcept": {
            "coding": [
                {
                "system": "http://loinc.org",
                "code": "CODE"
                }
            ],
            "text": "DESCRIPTION"
        }
  };

  CDEX.extensionQuery = {
        "type": {
          "coding": [
            {
              "system": "http://hl7.org/fhir/us/davinci-hrex/CodeSystem/hrex-temp",
              "code": "data-query"
            }
          ]
        },
        "valueString": "VALUE_STRING",
        "text": "DESCRIPTION"
  };

}());
