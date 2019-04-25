var CDEX;
if (!CDEX) {
    CDEX = {};
}

(function () {

  CDEX.clientSettings = {
    "client_id": "bed3bfd0-17d1-473f-90ac-c006fec5e9c9",
    "scope"    : "patient/*.* openid profile"
  };

  CDEX.submitEndpoint = "/CommunicationRequest?_id=";

  CDEX.providerEndpoints = [{
      "name": "DaVinci CDex Provider (Open)",
      "type": "open",
      "url": "https://api-v8-r4.hspconsortium.org/DaVinciCDexProvider/open"
  }
  ];

  // default configuration
  CDEX.configSetting = 0; // HSPC Provider Demo (Open)
  CDEX.providerEndpoint = CDEX.providerEndpoints[CDEX.configSetting];

  CDEX.menu = {
      "DocRef": {
          "name": "Structure Document Clinical Note Type",
          "description": "Clinical Note Type",
          "values": [
              {
                  "name": "History and Physical Note",
                  "generalCode": "34117-2"
              },
              {
                  "name": "Progress Note",
                  "generalCode": "11506-3"
              },
              {
                  "name": "Referral Note",
                  "generalCode": "57133-1"
              },
              {
                  "name": "Consultation Note",
                  "generalCode": "11488-4"
              },
              {
                  "name": "Procedure Note",
                  "generalCode": "28570-0"
              },
              {
                  "name": "Care Plan",
                  "generalCode": "18776-5"
              },
              {
                  "name": "Continuity of Care Document",
                  "generalCode": "34133-9"
              }
          ],
        },
      "FHIRQuery": {
          "name": "Structured Data Codes",
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
      },
      "FreeText": {
          "name": "Free text",
          "description": "Enter Text"
      }

  };

  CDEX.operationPayload = {
        "resourceType": "CommunicationRequest",
        "id": "RESOURCE_ID",
        "meta": {
            "versionId": "1",
        },
        "text": {
            "status": "generated",
            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Request for Condition resources</div>"
        },
        "identifier": [
            {
                "system": "http://www.jurisdiction.com/insurer/123456",
                "value": "ABC123"
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

          ],
        "occurrenceDateTime": "2016-06-10T11:01:10-08:00",
        "authoredOn": "TIMESTAMP",
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

    CDEX.extensionDocRef = {
        "extension": [
            {
                "url": "URL", //"http://hl7.org/fhir/us/davinci-cdex/StructureDefinition/cdex-payload-clinical-note-type"
                "valueCodeableConcept": {
                    "coding": [
                        {
                            "system": "http://loinc.org",
                            "code": "CODE"
                        }
                    ]
                }
            }
        ],
        "contentString": "CONTENT"
    };

  CDEX.extensionQuery = {
        "extension": [
            {
                "url": "http://hl7.org/fhir/us/davinci-cdex/StructureDefinition/cdex-payload-query-string",
                "valueString": "VALUE_STRING"
            }
        ],
        "contentString": "CONTENT"
    };

    CDEX.contentString = {
        "contentString": "CONTENT"
    };

}());
