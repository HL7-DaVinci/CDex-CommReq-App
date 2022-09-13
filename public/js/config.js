var CDEX;
if (!CDEX) {
  CDEX = {};
}

(function () {

  CDEX.clientSettings = {
    "client_id": "bed3bfd0-17d1-473f-90ac-c006fec5e9c9",//"619c591e-8957-43d8-9b6d-21489025177c",
    "scope": "launch patient/*.* openid profile"
  };

  CDEX.submitEndpoint = "/CommunicationRequest";
  CDEX.submitTaskEndpoint = "/Task";
  CDEX.submitSubscriptionEndpoint = "/Subscription";

  CDEX.providerEndpoints = [{
    "name": "DaVinci CDex Provider (Open)",
    "display": "open",
    "url": "https://api.logicahealth.org/DaVinciCDexProvider/open"
  },
  {
    "name": "DaVinci CDex Provider (Data)",
    "display": "data",
    "url": "https://api.logicahealth.org/DaVinciCDexProvider/data"
  }
  ];

  //Change URL and Name if you want to change the destination of returned Communication to this CommunicationRequest
  CDEX.payerEndpoint = {
    "name": "DaVinci CDex Payer (Open)",
    "display": "open",
    "url": "https://api.logicahealth.org/DaVinciCDexPayer/open"
  };

  // default configuration
  CDEX.configSetting = 0; // HSPC Provider Demo (Open)
  CDEX.providerEndpoint = CDEX.providerEndpoints[CDEX.configSetting];

  CDEX.taskScenarioDescription = {
    "description": "In this scenario, the user works for a payer and wishes to\n" +
      "            request clinical data from the provider to support\n" +
      "            a post-payment audit. In the next screens, the user\n" +
      "            will select clinical documents, specific clinical\n" +
      "            data, or create a general information request that\n" +
      "            will be sent to and fulfilled by the provider. The\n" +
      "            selection options are examples and not wholly representative\n" +
      "            of all the requested  data available. Data that can be\n" +
      "            represented in FHIR and supported by the provider system\n" +
      "            could be created using the CDex approach."
  }

  CDEX.directQueryScenarioDescription = {
    "description": "Here is the scenario description for Direct Query"
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

  CDEX.purposeOfUse = {
    "Purpose": {
      "name": "Purpose",
      "description": "Purpose of use",
      "values": [
        {
          "name": "Coverage under policy or program",
          "codeSystem": "v3-ActReason",
          "generalCode": "COVERAGE"
        },
        {
          "name": "Claim attachment",
          "codeSystem": "v3-ActReason",
          "generalCode": "CLMATTCH"
        },
        {
          "name": "Coverage authorization",
          "codeSystem": "v3-ActReason",
          "generalCode": "COVAUTH"
        },
        {
          "name": "Health quality improvement",
          "codeSystem": "v3-ActReason",
          "generalCode": "HQUALIMP"
        },
        {
          "name": "Healthcare delivery management",
          "codeSystem": "v3-ActReason",
          "generalCode": "HDM"
        },
        {
          "name": "Coordination of care",
          "codeSystem": "v3-ActReason",
          "generalCode": "COC"
        },
        {
          "name": "Treatment",
          "codeSystem": "v3-ActReason",
          "generalCode": "TREAT"
        },
        {
          "name": "Care planning",
          "codeSystem": "cdex-temp",
          "generalCode": "care-planning"
        },
        {
          "name": "Social risk",
          "codeSystem": "cdex-temp",
          "generalCode": "social-risk"
        },
        {
          "name": "Payment not otherwise specified",
          "codeSystem": "cdex-temp",
          "generalCode": "payment-nos"
        },
        {
          "name": "Operations not otherwise specified",
          "codeSystem": "cdex-temp",
          "generalCode": "operations-nos"
        }
      ],
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
    "basedOn": [
      {
        "reference": "CommunicationRequest/cdex-example-communication-request"
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
      "reference": CDEX.payerEndpoint.url + "/Organization/cdex-example-payer"
    },
    "owner": {
      "reference": "Organization/cdex-example-provider"
    },
    "reasonCode": {
      "text": "Support prior authorization decision-making"
    },
    "reasonReference": {
      "reference": CDEX.payerEndpoint.url + "/Claim/cdex-example-claim"
    },
    "input": []
  };

  CDEX.subscriptionPayload = {
    "resourceType": "Subscription",
    "status": "requested",
    "reason": "Subscribe to the task",
    "criteria": "Task?_id=TASKID",
    "channel": {
      "display": "rest-hook",
      "endpoint": CDEX.payerEndpoint.url,
      "payload": "application/fhir+json"
    }
  };

  CDEX.claimPayloadAttachment = {
    "resourceType": "Claim",
    "id": "",
    "identifier": "",
    "status": "active",
    "type": "institutional",
    "use": "claim",
    "patient": {
      "reference": ""
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
    "supportingInfo": {
      "sequence": 1,
      "category": 1,
      "valueReference": {
        "reference": ""
      }
    },
    "total": "1000"
  }

  CDEX.attachmentPayload = {
    "resourceType": "Parameters",
    "id": "",
    "parameter": [
      {
        "name": "AttachTo",
        "valueCode": ""
      },
      {
        "name": "TrackingId",
        "valueString": ""
      },
      {
        "name": "OrganizationId",
        "valueIdentifier": {
          "system": "http://hl7.org/fhir/sid/us-npi",
          "value": "CDex-Test-Organization"
        }
      },
      {
        "name": "ProviderId",
        "valueIdentifier": {
          "system": "http://hl7.org/fhir/sid/us-npi",
          "value": "CDex-Test-Provider"
        }
      },
      {
        "name": "MemberId",
        "valueIdentifier": {
          "system": "http://example.org/cdex/member-ids",
          "value": ""
        }
      },
      {
        "name": "ServiceDate",
        "valueDate": ""
      },
      {
        "name": "Attachment",
        "part": [
          {
            "name": "LineItem",
            "valueString": "1"
          },
          {
            "name": "Code",
            "valueCodeableConcept": {
              "coding": [
                {
                  "system": "http://loinc.org",
                  "code": "",
                  "display": ""
                }
              ]
            }
          },
          {
            "name": "Content",
            "resource": {
            }
          }
        ],
      }
    ]
  }

  CDEX.attachmentRequestedPayload = {
    "resourceType": "Parameters",
    "id": "",
    "parameter": [
      {
        "name": "AttachTo",
        "valueCode": ""
      },
      {
        "name": "TrackingId",
        "valueString": ""
      },
      {
        "name": "OrganizationId",
        "valueIdentifier": {
          "system": "http://hl7.org/fhir/sid/us-npi",
          "value": "CDex-Test-Organization"
        }
      },
      {
        "name": "ProviderId",
        "valueIdentifier": {
          "system": "http://hl7.org/fhir/sid/us-npi",
          "value": "CDex-Test-Provider"
        }
      },
      {
        "name": "MemberId",
        "valueIdentifier": {
          "system": "http://example.org/cdex/member-ids",
          "value": ""
        }
      },
      {
        "name": "ServiceDate",
        "valueDate": ""
      }
    ]
  }

  CDEX.attachmentToAdd = {
    "name": "Attachment",
    "part": [
      {
        "name": "LineItem",
        "valueString": "1"
      },
      {
        "name": "Code",
        "valueCodeableConcept": {
          "coding": [
            {
              "system": "http://loinc.org",
              "code": "",
              "display": ""
            }
          ]
        }
      },
      {
        "name": "Content",
        "resource": {
        }
      }
    ],
  }

  CDEX.binaryPayload = {
    "resourceType": "Binary",
    "contentType": "",
    "data": ""
  }

  CDEX.documentReferencePayload = {
    "resourceType": "DocumentReference",
    "id": "",
    "status": "current",
    "content": [
      {
        "attachment": {
          "contentType": "application/pdf",
          "data": "",
          "title": ""
        }
      }
    ]
  }

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

  CDEX.pouRef = {
    "type": {
      "coding": [
        {
          "system": "http://hl7.org/fhir/us/davinci-cdex/CodeSystem/cdex-temp",
          "code": "purpose-of-use"
        }
      ]
    },
    "valueCodeableConcept": {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/",
          "code": "COVERAGE"
        }
      ]
    }
  };

  CDEX.docSignRef = {
    "type": {
      "coding": [
        {
          "system": "http://hl7.org/fhir/us/davinci-cdex/CodeSystem/cdex-temp",
          "code": "signature-flag"
        }
      ]
    },
    "valueBoolean": true
  };

  CDEX.searchCriteria = {
    "criteria": [
      {
        "name": "Observation",
        "value": "Observation"
      },
      {
        "name": "Condition",
        "value": "Condition"
      },
      {
        "name": "Observation - HbA1c",
        "value": "Observation - HbA1c"
      },
      {
        "name": "Custom Scenario",
        "value": "custom"
      }
    ]
  };

  CDEX.claimParameters = {
    "criteria": [
      {
        "name": "Created",
        "value": "date"
      }
    ]
  };

  CDEX.observationParameters = {
    "criteria": [
      {
        "name": "Code",
        "value": "code"
      },
      {
        "name": "Date",
        "value": "date"
      }
    ]
  };

  CDEX.conditionParameters = {
    "criteria": [
      {
        "name": "Clinical status",
        "value": "clinical-status",
        "sub": []
      },
      {
        "name": "Provenance",
        "value": "_revinclude",
        "sub": []
      }
    ]
  };

  CDEX.documentReferenceParameters = {
    "criteria": [
      {
        "name": "Type",
        "value": "type"
      },
      {
        "name": "Category",
        "value": "category"
      }
    ]
  };

  CDEX.medicationParameters = {
    "criteria": [
      {
        "name": "Medication code",
        "value": "code"
      }
    ]
  };

  CDEX.docRefCodes = {
    "docRefCodeList": [
      {
        "Code": "55107-7",
        "Display": "Addendum Document"
      },
      {
        "Code": "74155-3",
        "Display": "ADHD action plan"
      },
      {
        "Code": "51851-4",
        "Display": "Administrative note"
      },
      {
        "Code": "67851-6",
        "Display": "Admission evaluation note"
      },
      {
        "Code": "34744-3",
        "Display": "Nurse Admission evaluation note"
      },
      {
        "Code": "34873-0",
        "Display": "Surgery Admission evaluation note"
      },
      {
        "Code": "68552-9",
        "Display": "Emergency medicine Emergency department Admission evaluation note"
      },
      {
        "Code": "67852-4",
        "Display": "Hospital Admission evaluation note"
      },
      {
        "Code": "68471-2",
        "Display": "Cardiology Hospital Admission evaluation note"
      },
      {
        "Code": "68483-7",
        "Display": "Cardiology Medical student Hospital Admission evaluation note"
      },
      {
        "Code": "64058-1",
        "Display": "Critical Care Medicine Hospital Admission evaluation note"
      },
      {
        "Code": "64070-6",
        "Display": "Critical care medicine Medical student Hospital Admission evaluation note"
      },
      {
        "Code": "64053-2",
        "Display": "General medicine Hospital Admission evaluation note"
      },
      {
        "Code": "64054-0",
        "Display": "General medicine Medical student Hospital Admission evaluation note"
      },
      {
        "Code": "34862-3",
        "Display": "General medicine Physician attending Hospital Admission evaluation note"
      },
      {
        "Code": "64062-3",
        "Display": "Pulmonary Hospital Admission evaluation note"
      },
      {
        "Code": "64078-9",
        "Display": "Pulmonary Medical student Hospital Admission evaluation note"
      },
      {
        "Code": "64066-4",
        "Display": "Surgery Medical student Hospital Admission evaluation note"
      },
      {
        "Code": "64060-7",
        "Display": "Thoracic surgery Hospital Admission evaluation note"
      },
      {
        "Code": "64074-8",
        "Display": "Thoracic surgery Medical student Hospital Admission evaluation note"
      },
      {
        "Code": "51849-8",
        "Display": "Admission history and physical note"
      },
      {
        "Code": "34763-3",
        "Display": "General medicine Admission history and physical note"
      },
      {
        "Code": "47039-3",
        "Display": "Hospital Admission history and physical note"
      },
      {
        "Code": "34094-3",
        "Display": "Cardiology Hospital Admission history and physical note"
      },
      {
        "Code": "57830-2",
        "Display": "Admission request Document"
      },
      {
        "Code": "48765-2",
        "Display": "Allergies and adverse reactions Document"
      },
      {
        "Code": "74152-0",
        "Display": "Anaphylaxis action plan"
      },
      {
        "Code": "61359-6",
        "Display": "Patient Anesthesia consent"
      },
      {
        "Code": "57055-6",
        "Display": "Antepartum summary note"
      },
      {
        "Code": "56446-8",
        "Display": "Appointment summary Document"
      },
      {
        "Code": "51848-0",
        "Display": "Assessment note"
      },
      {
        "Code": "68814-3",
        "Display": "Pediatrics Assessment note"
      },
      {
        "Code": "64064-9",
        "Display": "Pastoral care Hospital Assessment note"
      },
      {
        "Code": "51847-2",
        "Display": "Assessment + Plan note"
      },
      {
        "Code": "69981-9",
        "Display": "Asthma action plan"
      },
      {
        "Code": "74154-6",
        "Display": "Autism action plan"
      },
      {
        "Code": "71230-7",
        "Display": "Birth certificate Document"
      },
      {
        "Code": "72134-0",
        "Display": "Cancer event report"
      },
      {
        "Code": "55108-5",
        "Display": "Clinical presentation Document"
      },
      {
        "Code": "73568-8",
        "Display": "Communication of critical results [Description] Document"
      },
      {
        "Code": "74144-7",
        "Display": "Complex medical conditions action plan"
      },
      {
        "Code": "55109-3",
        "Display": "Complications Document"
      },
      {
        "Code": "34095-0",
        "Display": "Comprehensive history and physical note"
      },
      {
        "Code": "34096-8",
        "Display": "Nursing facility Comprehensive history and physical note"
      },
      {
        "Code": "63485-7",
        "Display": "Computer generated recommendation Document"
      },
      {
        "Code": "55110-1",
        "Display": "Conclusions Document"
      },
      {
        "Code": "34098-4",
        "Display": "Conference note"
      },
      {
        "Code": "34097-6",
        "Display": "Nursing facility Conference note"
      },
      {
        "Code": "47040-1",
        "Display": "Consultation 2nd opinion"
      },
      {
        "Code": "47041-9",
        "Display": "Hospital Consultation 2nd opinion"
      },
      {
        "Code": "59284-0",
        "Display": "Patient Consent"
      },
      {
        "Code": "11488-4",
        "Display": "Consult note"
      },
      {
        "Code": "34099-2",
        "Display": "Cardiology Consult note"
      },
      {
        "Code": "34756-7",
        "Display": "Dentistry Consult note"
      },
      {
        "Code": "34758-3",
        "Display": "Dermatology Consult note"
      },
      {
        "Code": "34760-9",
        "Display": "Diabetology Consult note"
      },
      {
        "Code": "34879-7",
        "Display": "Endocrinology Consult note"
      },
      {
        "Code": "34761-7",
        "Display": "Gastroenterology Consult note"
      },
      {
        "Code": "34764-1",
        "Display": "General medicine Consult note"
      },
      {
        "Code": "34776-5",
        "Display": "Geriatric medicine Consult note"
      },
      {
        "Code": "34779-9",
        "Display": "Hematology+Medical Oncology Consult note"
      },
      {
        "Code": "34781-5",
        "Display": "Infectious disease Consult note"
      },
      {
        "Code": "72555-6",
        "Display": "Interventional radiology Consult note"
      },
      {
        "Code": "34783-1",
        "Display": "Kinesiotherapy Consult note"
      },
      {
        "Code": "34785-6",
        "Display": "Mental health Consult note"
      },
      {
        "Code": "34795-5",
        "Display": "Nephrology Consult note"
      },
      {
        "Code": "34798-9",
        "Display": "Neurological surgery Consult note"
      },
      {
        "Code": "34797-1",
        "Display": "Neurology Consult note"
      },
      {
        "Code": "34800-3",
        "Display": "Nutrition and dietetics Consult note"
      },
      {
        "Code": "34777-3",
        "Display": "Obstetrics and Gynecology Consult note"
      },
      {
        "Code": "34803-7",
        "Display": "Occupational medicine Consult note"
      },
      {
        "Code": "34855-7",
        "Display": "Occupational therapy Consult note"
      },
      {
        "Code": "34805-2",
        "Display": "Oncology Consult note"
      },
      {
        "Code": "34807-8",
        "Display": "Ophthalmology Consult note"
      },
      {
        "Code": "34810-2",
        "Display": "Optometry Consult note"
      },
      {
        "Code": "34812-8",
        "Display": "Oral and Maxillofacial Surgery Consult note"
      },
      {
        "Code": "34814-4",
        "Display": "Orthopaedic surgery Consult note"
      },
      {
        "Code": "34816-9",
        "Display": "Otolaryngology Consult note"
      },
      {
        "Code": "34820-1",
        "Display": "Pharmacy Consult note"
      },
      {
        "Code": "34822-7",
        "Display": "Physical medicine and rehabilitation Consult note"
      },
      {
        "Code": "34824-3",
        "Display": "Physical therapy Consult note"
      },
      {
        "Code": "34826-8",
        "Display": "Plastic surgery Consult note"
      },
      {
        "Code": "34828-4",
        "Display": "Podiatry Consult note"
      },
      {
        "Code": "34788-0",
        "Display": "Psychiatry Consult note"
      },
      {
        "Code": "34791-4",
        "Display": "Psychology Consult note"
      },
      {
        "Code": "34103-2",
        "Display": "Pulmonary Consult note"
      },
      {
        "Code": "34831-8",
        "Display": "Radiation oncology Consult note"
      },
      {
        "Code": "73575-3",
        "Display": "Radiology Consult note"
      },
      {
        "Code": "34833-4",
        "Display": "Recreational therapy Consult note"
      },
      {
        "Code": "34837-5",
        "Display": "Respiratory therapy Consult note"
      },
      {
        "Code": "34839-1",
        "Display": "Rheumatology Consult note"
      },
      {
        "Code": "34841-7",
        "Display": "Social work Consult note"
      },
      {
        "Code": "34845-8",
        "Display": "Speech-language pathology+Audiology Consult note"
      },
      {
        "Code": "34847-4",
        "Display": "Surgery Consult note"
      },
      {
        "Code": "34849-0",
        "Display": "Thoracic surgery Consult note"
      },
      {
        "Code": "34851-6",
        "Display": "Urology Consult note"
      },
      {
        "Code": "34853-2",
        "Display": "Vascular surgery Consult note"
      },
      {
        "Code": "51846-4",
        "Display": "Emergency department Consult note"
      },
      {
        "Code": "34104-0",
        "Display": "Hospital Consult note"
      },
      {
        "Code": "68619-6",
        "Display": "Adolescent medicine Hospital Consult note"
      },
      {
        "Code": "68633-7",
        "Display": "Allergy and immunology Hospital Consult note"
      },
      {
        "Code": "68639-4",
        "Display": "Audiology Hospital Consult note"
      },
      {
        "Code": "68486-0",
        "Display": "Cardiology Medical student Hospital Consult note"
      },
      {
        "Code": "68648-5",
        "Display": "Child and adolescent psychiatry Hospital Consult note"
      },
      {
        "Code": "68651-9",
        "Display": "Clinical biochemical genetics Hospital Consult note"
      },
      {
        "Code": "68661-8",
        "Display": "Clinical genetics Hospital Consult note"
      },
      {
        "Code": "64072-2",
        "Display": "Critical care medicine Medical student Hospital Consult note"
      },
      {
        "Code": "68551-1",
        "Display": "Dermatology Hospital Consult note"
      },
      {
        "Code": "68670-9",
        "Display": "Developmental-behavioral pediatrics Hospital Consult note"
      },
      {
        "Code": "64056-5",
        "Display": "General medicine Medical student Hospital Consult note"
      },
      {
        "Code": "68681-6",
        "Display": "Multi-specialty program Hospital Consult note"
      },
      {
        "Code": "68685-7",
        "Display": "Neonatal perinatal medicine Hospital Consult note"
      },
      {
        "Code": "68694-9",
        "Display": "Neurological surgery Hospital Consult note"
      },
      {
        "Code": "68705-3",
        "Display": "Neurology with special qualifications in child neurology Hospital Consult note"
      },
      {
        "Code": "68566-9",
        "Display": "Obstetrics and Gynecology Hospital Consult note"
      },
      {
        "Code": "68570-1",
        "Display": "Occupational therapy Hospital Consult note"
      },
      {
        "Code": "68575-0",
        "Display": "Ophthalmology Hospital Consult note"
      },
      {
        "Code": "68716-0",
        "Display": "Pain medicine Hospital Consult note"
      },
      {
        "Code": "68469-6",
        "Display": "Pastoral care Hospital Consult note"
      },
      {
        "Code": "68727-7",
        "Display": "Pediatric cardiology Hospital Consult note"
      },
      {
        "Code": "68892-9",
        "Display": "Pediatric dermatology Hospital Consult note"
      },
      {
        "Code": "68897-8",
        "Display": "Pediatric endocrinology Hospital Consult note"
      },
      {
        "Code": "68746-7",
        "Display": "Pediatric gastroenterology Hospital Consult note"
      },
      {
        "Code": "68757-4",
        "Display": "Pediatric hematology-oncology Hospital Consult note"
      },
      {
        "Code": "68765-7",
        "Display": "Pediatric infectious diseases Hospital Consult note"
      },
      {
        "Code": "68869-7",
        "Display": "Pediatric nephrology Hospital Consult note"
      },
      {
        "Code": "68874-7",
        "Display": "Pediatric otolaryngology Hospital Consult note"
      },
      {
        "Code": "68787-1",
        "Display": "Pediatric pulmonology Hospital Consult note"
      },
      {
        "Code": "68879-6",
        "Display": "Pediatric rheumatology Hospital Consult note"
      },
      {
        "Code": "68802-8",
        "Display": "Pediatric surgery Hospital Consult note"
      },
      {
        "Code": "68864-8",
        "Display": "Pediatric transplant hepatology Hospital Consult note"
      },
      {
        "Code": "68812-7",
        "Display": "Pediatric urology Hospital Consult note"
      },
      {
        "Code": "68821-8",
        "Display": "Pediatrics Hospital Consult note"
      },
      {
        "Code": "68586-7",
        "Display": "Pharmacy Hospital Consult note"
      },
      {
        "Code": "68590-9",
        "Display": "Physical therapy Hospital Consult note"
      },
      {
        "Code": "68597-4",
        "Display": "Plastic surgery Hospital Consult note"
      },
      {
        "Code": "68837-4",
        "Display": "Primary care Hospital Consult note"
      },
      {
        "Code": "34102-4",
        "Display": "Psychiatry Hospital Consult note"
      },
      {
        "Code": "64080-5",
        "Display": "Pulmonary Medical student Hospital Consult note"
      },
      {
        "Code": "68846-5",
        "Display": "Speech-language pathology Hospital Consult note"
      },
      {
        "Code": "64068-0",
        "Display": "Surgery Medical student Hospital Consult note"
      },
      {
        "Code": "64076-3",
        "Display": "Thoracic surgery Medical student Hospital Consult note"
      },
      {
        "Code": "68852-3",
        "Display": "Transplant surgery Hospital Consult note"
      },
      {
        "Code": "34100-8",
        "Display": "Intensive care unit Consult note"
      },
      {
        "Code": "51854-8",
        "Display": "Long term care facility Consult note"
      },
      {
        "Code": "51845-6",
        "Display": "Outpatient Consult note"
      },
      {
        "Code": "34749-2",
        "Display": "Anesthesiology Outpatient Consult note"
      },
      {
        "Code": "34101-6",
        "Display": "General medicine Outpatient Consult note"
      },
      {
        "Code": "47042-7",
        "Display": "Counseling note"
      },
      {
        "Code": "34864-9",
        "Display": "Mental health Counseling note"
      },
      {
        "Code": "34869-8",
        "Display": "Pharmacy Counseling note"
      },
      {
        "Code": "34865-6",
        "Display": "Psychiatry Counseling note"
      },
      {
        "Code": "34866-4",
        "Display": "Psychology Counseling note"
      },
      {
        "Code": "34872-2",
        "Display": "Social work Counseling note"
      },
      {
        "Code": "55111-9",
        "Display": "Current imaging procedure descriptions Document"
      },
      {
        "Code": "74148-8",
        "Display": "Cystic fibrosis action plan"
      },
      {
        "Code": "64297-5",
        "Display": "Death certificate"
      },
      {
        "Code": "74208-0",
        "Display": "Demographic information + History of occupation Document"
      },
      {
        "Code": "51899-3",
        "Display": "Details Document"
      },
      {
        "Code": "74150-4",
        "Display": "Diabetes type I action plan"
      },
      {
        "Code": "74151-2",
        "Display": "Diabetes type II action plan"
      },
      {
        "Code": "47048-4",
        "Display": "Diagnostic interventional study report Interventional radiology"
      },
      {
        "Code": "70004-7",
        "Display": "Diagnostic study note"
      },
      {
        "Code": "68611-3",
        "Display": "Adolescent medicine Diagnostic study note"
      },
      {
        "Code": "68625-3",
        "Display": "Allergy and immunology Diagnostic study note"
      },
      {
        "Code": "68635-2",
        "Display": "Audiology Diagnostic study note"
      },
      {
        "Code": "68641-0",
        "Display": "Child and adolescent psychiatry Diagnostic study note"
      },
      {
        "Code": "68652-7",
        "Display": "Clinical genetics Diagnostic study note"
      },
      {
        "Code": "68673-3",
        "Display": "Multi-specialty program Diagnostic study note"
      },
      {
        "Code": "68687-3",
        "Display": "Neurological surgery Diagnostic study note"
      },
      {
        "Code": "68556-0",
        "Display": "Neurology Diagnostic study note"
      },
      {
        "Code": "68696-4",
        "Display": "Neurology with special qualifications in child neurology Diagnostic study note"
      },
      {
        "Code": "68557-8",
        "Display": "Obstetrics and Gynecology Diagnostic study note"
      },
      {
        "Code": "68577-6",
        "Display": "Orthopaedic surgery Diagnostic study note"
      },
      {
        "Code": "68708-7",
        "Display": "Pain medicine Diagnostic study note"
      },
      {
        "Code": "68718-6",
        "Display": "Pediatric cardiology Diagnostic study note"
      },
      {
        "Code": "68748-3",
        "Display": "Pediatric hematology-oncology Diagnostic study note"
      },
      {
        "Code": "68767-3",
        "Display": "Pediatric nephrology Diagnostic study note"
      },
      {
        "Code": "68778-0",
        "Display": "Pediatric pulmonology Diagnostic study note"
      },
      {
        "Code": "68794-7",
        "Display": "Pediatric surgery Diagnostic study note"
      },
      {
        "Code": "68855-6",
        "Display": "Pediatric transplant hepatology Diagnostic study note"
      },
      {
        "Code": "68804-4",
        "Display": "Pediatric urology Diagnostic study note"
      },
      {
        "Code": "68604-8",
        "Display": "Radiology Diagnostic study note"
      },
      {
        "Code": "68640-2",
        "Display": "Audiology Hospital Diagnostic study note"
      },
      {
        "Code": "68706-1",
        "Display": "Neurology with special qualifications in child neurology Hospital Diagnostic study note"
      },
      {
        "Code": "68788-9",
        "Display": "Pediatric pulmonology Hospital Diagnostic study note"
      },
      {
        "Code": "68822-6",
        "Display": "Pediatrics Hospital Diagnostic study note"
      },
      {
        "Code": "74213-0",
        "Display": "Discharge instructions"
      },
      {
        "Code": "60280-5",
        "Display": "Emergency department Discharge instructions"
      },
      {
        "Code": "8653-8",
        "Display": "Hospital Discharge instructions"
      },
      {
        "Code": "18842-5",
        "Display": "Discharge summary"
      },
      {
        "Code": "68612-1",
        "Display": "Adolescent medicine Discharge summary"
      },
      {
        "Code": "68626-1",
        "Display": "Allergy and immunology Discharge summary"
      },
      {
        "Code": "68642-8",
        "Display": "Child and adolescent psychiatry Discharge summary"
      },
      {
        "Code": "68653-5",
        "Display": "Clinical genetics Discharge summary"
      },
      {
        "Code": "68663-4",
        "Display": "Developmental-behavioral pediatrics Discharge summary"
      },
      {
        "Code": "68674-1",
        "Display": "Multi-specialty program Discharge summary"
      },
      {
        "Code": "68688-1",
        "Display": "Neurological surgery Discharge summary"
      },
      {
        "Code": "68697-2",
        "Display": "Neurology with special qualifications in child neurology Discharge summary"
      },
      {
        "Code": "34745-0",
        "Display": "Nurse Discharge summary"
      },
      {
        "Code": "68558-6",
        "Display": "Obstetrics and Gynecology Discharge summary"
      },
      {
        "Code": "68572-7",
        "Display": "Ophthalmology Discharge summary"
      },
      {
        "Code": "68578-4",
        "Display": "Orthopaedic surgery Discharge summary"
      },
      {
        "Code": "68709-5",
        "Display": "Pain medicine Discharge summary"
      },
      {
        "Code": "68719-4",
        "Display": "Pediatric cardiology Discharge summary"
      },
      {
        "Code": "68733-5",
        "Display": "Pediatric endocrinology Discharge summary"
      },
      {
        "Code": "68738-4",
        "Display": "Pediatric gastroenterology Discharge summary"
      },
      {
        "Code": "68749-1",
        "Display": "Pediatric hematology-oncology Discharge summary"
      },
      {
        "Code": "68768-1",
        "Display": "Pediatric nephrology Discharge summary"
      },
      {
        "Code": "68773-1",
        "Display": "Pediatric otolaryngology Discharge summary"
      },
      {
        "Code": "68779-8",
        "Display": "Pediatric pulmonology Discharge summary"
      },
      {
        "Code": "68795-4",
        "Display": "Pediatric surgery Discharge summary"
      },
      {
        "Code": "68856-4",
        "Display": "Pediatric transplant hepatology Discharge summary"
      },
      {
        "Code": "68805-1",
        "Display": "Pediatric urology Discharge summary"
      },
      {
        "Code": "68815-0",
        "Display": "Pediatrics Discharge summary"
      },
      {
        "Code": "68591-7",
        "Display": "Plastic surgery Discharge summary"
      },
      {
        "Code": "68831-7",
        "Display": "Primary care Discharge summary"
      },
      {
        "Code": "59259-2",
        "Display": "Psychiatry Discharge summary"
      },
      {
        "Code": "68841-6",
        "Display": "Speech-language pathology Discharge summary"
      },
      {
        "Code": "59258-4",
        "Display": "Emergency department Discharge summary"
      },
      {
        "Code": "34105-7",
        "Display": "Hospital Discharge summary"
      },
      {
        "Code": "68823-4",
        "Display": "Pediatrics Hospital Discharge summary"
      },
      {
        "Code": "34106-5",
        "Display": "Physician Hospital Discharge summary"
      },
      {
        "Code": "55112-7",
        "Display": "Document summary"
      },
      {
        "Code": "34895-3",
        "Display": "Education note"
      },
      {
        "Code": "34897-9",
        "Display": "Diabetology Education note"
      },
      {
        "Code": "67854-0",
        "Display": "Geriatric medicine Education note"
      },
      {
        "Code": "68477-9",
        "Display": "Nurse Hospital Education note"
      },
      {
        "Code": "68605-5",
        "Display": "Recreational therapy Hospital Education note"
      },
      {
        "Code": "67855-7",
        "Display": "Outpatient Education note"
      },
      {
        "Code": "34902-7",
        "Display": "Geriatric medicine Outpatient Education note"
      },
      {
        "Code": "34107-3",
        "Display": "Patient's home Education note"
      },
      {
        "Code": "34856-5",
        "Display": "Evaluation and management of anticoagulation note"
      },
      {
        "Code": "34859-9",
        "Display": "Evaluation and management of hyperlipidemia"
      },
      {
        "Code": "34860-7",
        "Display": "Evaluation and management of hypertension"
      },
      {
        "Code": "70005-4",
        "Display": "Evaluation and management of smoking cessation"
      },
      {
        "Code": "64142-3",
        "Display": "Hospital Evaluation and management of smoking cessation"
      },
      {
        "Code": "34857-3",
        "Display": "Evaluation and management of substance abuse note"
      },
      {
        "Code": "72267-8",
        "Display": "Evaluation of mental and physical incapacity certificate Document"
      },
      {
        "Code": "47420-5",
        "Display": "Functional status assessment note"
      },
      {
        "Code": "47043-5",
        "Display": "Group counseling note"
      },
      {
        "Code": "34787-2",
        "Display": "Mental health Group counseling note"
      },
      {
        "Code": "34790-6",
        "Display": "Psychiatry Group counseling note"
      },
      {
        "Code": "34793-0",
        "Display": "Psychology Group counseling note"
      },
      {
        "Code": "34843-3",
        "Display": "Social work Group counseling note"
      },
      {
        "Code": "34114-9",
        "Display": "Hospital Group counseling note"
      },
      {
        "Code": "64290-0",
        "Display": "Health insurance card"
      },
      {
        "Code": "64291-8",
        "Display": "Health insurance-related form"
      },
      {
        "Code": "57024-2",
        "Display": "Health Quality Measure document"
      },
      {
        "Code": "64289-2",
        "Display": "Health record cover sheet"
      },
      {
        "Code": "51897-7",
        "Display": "Healthcare Associated Infection report Document"
      },
      {
        "Code": "56444-3",
        "Display": "Healthcare communication Document"
      },
      {
        "Code": "74146-2",
        "Display": "Heart disease action plan"
      },
      {
        "Code": "34117-2",
        "Display": "History and physical note"
      },
      {
        "Code": "68614-7",
        "Display": "Adolescent medicine History and physical note"
      },
      {
        "Code": "68622-0",
        "Display": "Advanced heart failure and transplant cardiology History and physical note"
      },
      {
        "Code": "68628-7",
        "Display": "Allergy and immunology History and physical note"
      },
      {
        "Code": "68637-8",
        "Display": "Audiology History and physical note"
      },
      {
        "Code": "68644-4",
        "Display": "Child and adolescent psychiatry History and physical note"
      },
      {
        "Code": "68655-0",
        "Display": "Clinical genetics History and physical note"
      },
      {
        "Code": "68665-9",
        "Display": "Developmental-behavioral pediatrics History and physical note"
      },
      {
        "Code": "68676-6",
        "Display": "Multi-specialty program History and physical note"
      },
      {
        "Code": "68683-2",
        "Display": "Neonatal perinatal medicine History and physical note"
      },
      {
        "Code": "68690-7",
        "Display": "Neurological surgery History and physical note"
      },
      {
        "Code": "68699-8",
        "Display": "Neurology with special qualifications in child neurology History and physical note"
      },
      {
        "Code": "68560-2",
        "Display": "Obstetrics and Gynecology History and physical note"
      },
      {
        "Code": "68573-5",
        "Display": "Ophthalmology History and physical note"
      },
      {
        "Code": "68580-0",
        "Display": "Orthopaedic surgery History and physical note"
      },
      {
        "Code": "68711-1",
        "Display": "Pain medicine History and physical note"
      },
      {
        "Code": "68721-0",
        "Display": "Pediatric cardiology History and physical note"
      },
      {
        "Code": "68731-9",
        "Display": "Pediatric dermatology History and physical note"
      },
      {
        "Code": "68735-0",
        "Display": "Pediatric endocrinology History and physical note"
      },
      {
        "Code": "68740-0",
        "Display": "Pediatric gastroenterology History and physical note"
      },
      {
        "Code": "68751-7",
        "Display": "Pediatric hematology-oncology History and physical note"
      },
      {
        "Code": "68760-8",
        "Display": "Pediatric infectious diseases History and physical note"
      },
      {
        "Code": "68770-7",
        "Display": "Pediatric nephrology History and physical note"
      },
      {
        "Code": "68775-6",
        "Display": "Pediatric otolaryngology History and physical note"
      },
      {
        "Code": "68781-4",
        "Display": "Pediatric pulmonology History and physical note"
      },
      {
        "Code": "68791-3",
        "Display": "Pediatric rheumatology History and physical note"
      },
      {
        "Code": "68797-0",
        "Display": "Pediatric surgery History and physical note"
      },
      {
        "Code": "68858-0",
        "Display": "Pediatric transplant hepatology History and physical note"
      },
      {
        "Code": "68807-7",
        "Display": "Pediatric urology History and physical note"
      },
      {
        "Code": "68817-6",
        "Display": "Pediatrics History and physical note"
      },
      {
        "Code": "28626-0",
        "Display": "Physician History and physical note"
      },
      {
        "Code": "68592-5",
        "Display": "Plastic surgery History and physical note"
      },
      {
        "Code": "68833-3",
        "Display": "Primary care History and physical note"
      },
      {
        "Code": "68599-0",
        "Display": "Psychiatry History and physical note"
      },
      {
        "Code": "68843-2",
        "Display": "Speech-language pathology History and physical note"
      },
      {
        "Code": "34774-0",
        "Display": "Surgery History and physical note"
      },
      {
        "Code": "68849-9",
        "Display": "Transplant surgery History and physical note"
      },
      {
        "Code": "11492-6",
        "Display": "Provider-unspecifed, History and physical note"
      },
      {
        "Code": "34115-6",
        "Display": "Medical student Hospital History and physical note"
      },
      {
        "Code": "68825-9",
        "Display": "Pediatrics Hospital History and physical note"
      },
      {
        "Code": "67856-5",
        "Display": "Nursing facility History and physical note"
      },
      {
        "Code": "34116-4",
        "Display": "Physician Nursing facility History and physical note"
      },
      {
        "Code": "74264-3",
        "Display": "HIV summary registry report Document"
      },
      {
        "Code": "74149-6",
        "Display": "Inflammatory bowel disease action plan"
      },
      {
        "Code": "28636-9",
        "Display": "Provider-unspecified Initial assessment"
      },
      {
        "Code": "28581-7",
        "Display": "Chiropractic medicine Initial assessment note"
      },
      {
        "Code": "68553-7",
        "Display": "Hematology+Medical Oncology Initial assessment note"
      },
      {
        "Code": "18740-1",
        "Display": "Speech-language pathology Initial assessment note"
      },
      {
        "Code": "47044-3",
        "Display": "Hospital Initial assessment note"
      },
      {
        "Code": "64065-6",
        "Display": "Case manager Hospital Initial assessment note"
      },
      {
        "Code": "68470-4",
        "Display": "Respiratory therapy Hospital Initial assessment note"
      },
      {
        "Code": "34119-8",
        "Display": "Nursing facility Initial assessment note"
      },
      {
        "Code": "34120-6",
        "Display": "Outpatient Initial assessment note"
      },
      {
        "Code": "34118-0",
        "Display": "Patient's home Initial assessment note"
      },
      {
        "Code": "74209-8",
        "Display": "Injury event summary Document"
      },
      {
        "Code": "74188-4",
        "Display": "InterRAI Acute Care (AC) Hospital Document"
      },
      {
        "Code": "74194-2",
        "Display": "InterRAI Community Health Assessment (CHA) Document"
      },
      {
        "Code": "74191-8",
        "Display": "InterRAI Community Health Assessment - Assisted Living Supplement (CHA-AL) Document"
      },
      {
        "Code": "74190-0",
        "Display": "InterRAI Community Health Assessment - Deafblind Supplement (CHA-Db) Document"
      },
      {
        "Code": "74193-4",
        "Display": "InterRAI Community Health Assessment - Functional Supplement (CHA-FS) Document"
      },
      {
        "Code": "74192-6",
        "Display": "InterRAI Community Health Assessment - Mental Health Supplement (CHA-MH) Document"
      },
      {
        "Code": "74197-5",
        "Display": "InterRAI Contact Assessment (CA) Document"
      },
      {
        "Code": "74187-6",
        "Display": "InterRAI Emergency Screener for Psychiatry (ESP) Document"
      },
      {
        "Code": "74196-7",
        "Display": "InterRAI Home Care (HC) Document"
      },
      {
        "Code": "74195-9",
        "Display": "InterRAI Long Term Care Facility (LTCF) Document"
      },
      {
        "Code": "74189-2",
        "Display": "InterRAI Palliative Care (PC) Document"
      },
      {
        "Code": "34121-4",
        "Display": "Interventional procedure note"
      },
      {
        "Code": "34896-1",
        "Display": "Cardiology Interventional procedure note"
      },
      {
        "Code": "34899-5",
        "Display": "Gastroenterology Interventional procedure note"
      },
      {
        "Code": "55113-5",
        "Display": "Key images Document Radiology"
      },
      {
        "Code": "57056-4",
        "Display": "Labor and delivery admission history and physical note"
      },
      {
        "Code": "57057-2",
        "Display": "Labor and delivery summary note"
      },
      {
        "Code": "64299-1",
        "Display": "Legal document"
      },
      {
        "Code": "51852-2",
        "Display": "Letter"
      },
      {
        "Code": "68684-0",
        "Display": "Neonatal perinatal medicine Letter"
      },
      {
        "Code": "68866-3",
        "Display": "Pediatric nephrology Letter"
      },
      {
        "Code": "68593-3",
        "Display": "Plastic surgery Letter"
      },
      {
        "Code": "68609-7",
        "Display": "Hospital Letter"
      },
      {
        "Code": "68620-4",
        "Display": "Adolescent medicine Hospital Letter"
      },
      {
        "Code": "68624-6",
        "Display": "Advanced heart failure and transplant cardiology Hospital Letter"
      },
      {
        "Code": "68634-5",
        "Display": "Allergy and immunology Hospital Letter"
      },
      {
        "Code": "68649-3",
        "Display": "Child and adolescent psychiatry Hospital Letter"
      },
      {
        "Code": "68662-6",
        "Display": "Clinical genetics Hospital Letter"
      },
      {
        "Code": "68671-7",
        "Display": "Developmental-behavioral pediatrics Hospital Letter"
      },
      {
        "Code": "68555-2",
        "Display": "Hematology+Medical Oncology Hospital Letter"
      },
      {
        "Code": "68682-4",
        "Display": "Multi-specialty program Hospital Letter"
      },
      {
        "Code": "68686-5",
        "Display": "Neonatal perinatal medicine Hospital Letter"
      },
      {
        "Code": "68695-6",
        "Display": "Neurological surgery Hospital Letter"
      },
      {
        "Code": "68707-9",
        "Display": "Neurology with special qualifications in child neurology Hospital Letter"
      },
      {
        "Code": "68567-7",
        "Display": "Obstetrics and Gynecology Hospital Letter"
      },
      {
        "Code": "68571-9",
        "Display": "Occupational therapy Hospital Letter"
      },
      {
        "Code": "68576-8",
        "Display": "Ophthalmology Hospital Letter"
      },
      {
        "Code": "68585-9",
        "Display": "Orthopaedic surgery Hospital Letter"
      },
      {
        "Code": "68717-8",
        "Display": "Pain medicine Hospital Letter"
      },
      {
        "Code": "68728-5",
        "Display": "Pediatric cardiology Hospital Letter"
      },
      {
        "Code": "68893-7",
        "Display": "Pediatric dermatology Hospital Letter"
      },
      {
        "Code": "68898-6",
        "Display": "Pediatric endocrinology Hospital Letter"
      },
      {
        "Code": "68747-5",
        "Display": "Pediatric gastroenterology Hospital Letter"
      },
      {
        "Code": "68758-2",
        "Display": "Pediatric hematology-oncology Hospital Letter"
      },
      {
        "Code": "68766-5",
        "Display": "Pediatric infectious diseases Hospital Letter"
      },
      {
        "Code": "68870-5",
        "Display": "Pediatric nephrology Hospital Letter"
      },
      {
        "Code": "68875-4",
        "Display": "Pediatric otolaryngology Hospital Letter"
      },
      {
        "Code": "68789-7",
        "Display": "Pediatric pulmonology Hospital Letter"
      },
      {
        "Code": "68880-4",
        "Display": "Pediatric rheumatology Hospital Letter"
      },
      {
        "Code": "68803-6",
        "Display": "Pediatric surgery Hospital Letter"
      },
      {
        "Code": "68865-5",
        "Display": "Pediatric transplant hepatology Hospital Letter"
      },
      {
        "Code": "68813-5",
        "Display": "Pediatric urology Hospital Letter"
      },
      {
        "Code": "68826-7",
        "Display": "Pediatrics Hospital Letter"
      },
      {
        "Code": "68598-2",
        "Display": "Plastic surgery Hospital Letter"
      },
      {
        "Code": "68838-2",
        "Display": "Primary care Hospital Letter"
      },
      {
        "Code": "68847-3",
        "Display": "Speech-language pathology Hospital Letter"
      },
      {
        "Code": "68853-1",
        "Display": "Transplant surgery Hospital Letter"
      },
      {
        "Code": "57058-0",
        "Display": "Maternal discharge summary note"
      },
      {
        "Code": "64285-0",
        "Display": "Medical history screening form"
      },
      {
        "Code": "60590-7",
        "Display": "Medication dispensed.brief Document"
      },
      {
        "Code": "60593-1",
        "Display": "Medication dispensed.extended Document"
      },
      {
        "Code": "70006-2",
        "Display": "Medication management note"
      },
      {
        "Code": "68587-5",
        "Display": "Pharmacy Hospital Medication management note"
      },
      {
        "Code": "61357-0",
        "Display": "Medication pharmaceutical advice.brief Document"
      },
      {
        "Code": "61356-2",
        "Display": "Medication pharmaceutical advice.extended Document"
      },
      {
        "Code": "56445-0",
        "Display": "Medication summary Document"
      },
      {
        "Code": "74145-4",
        "Display": "Multiple sclerosis action plan"
      },
      {
        "Code": "74147-0",
        "Display": "Muscular dystrophy action plan"
      },
      {
        "Code": "59268-3",
        "Display": "Neonatal care report"
      },
      {
        "Code": "34109-9",
        "Display": "Note"
      },
      {
        "Code": "68615-4",
        "Display": "Adolescent medicine Note"
      },
      {
        "Code": "68621-2",
        "Display": "Advanced heart failure and transplant cardiology Note"
      },
      {
        "Code": "68629-5",
        "Display": "Allergy and immunology Note"
      },
      {
        "Code": "34750-0",
        "Display": "Anesthesiology Note"
      },
      {
        "Code": "68636-0",
        "Display": "Audiology Note"
      },
      {
        "Code": "34752-6",
        "Display": "Cardiology Note"
      },
      {
        "Code": "68645-1",
        "Display": "Child and adolescent psychiatry Note"
      },
      {
        "Code": "68650-1",
        "Display": "Clinical biochemical genetics Note"
      },
      {
        "Code": "68656-8",
        "Display": "Clinical genetics Note"
      },
      {
        "Code": "34754-2",
        "Display": "Critical Care Medicine Note"
      },
      {
        "Code": "28618-7",
        "Display": "Dentistry Note"
      },
      {
        "Code": "34759-1",
        "Display": "Dermatology Note"
      },
      {
        "Code": "68666-7",
        "Display": "Developmental-behavioral pediatrics Note"
      },
      {
        "Code": "34861-5",
        "Display": "Diabetology Note"
      },
      {
        "Code": "34878-9",
        "Display": "Emergency medicine Note"
      },
      {
        "Code": "34898-7",
        "Display": "Endocrinology Note"
      },
      {
        "Code": "34762-5",
        "Display": "Gastroenterology Note"
      },
      {
        "Code": "34765-8",
        "Display": "General medicine Note"
      },
      {
        "Code": "34767-4",
        "Display": "General medicine Medical student Note"
      },
      {
        "Code": "34768-2",
        "Display": "General medicine Nurse Note"
      },
      {
        "Code": "34769-0",
        "Display": "General medicine Physician attending Note"
      },
      {
        "Code": "34780-7",
        "Display": "Hematology+Medical Oncology Note"
      },
      {
        "Code": "34782-3",
        "Display": "Infectious disease Note"
      },
      {
        "Code": "34794-8",
        "Display": "Interdisciplinary Note"
      },
      {
        "Code": "34784-9",
        "Display": "Kinesiotherapy Note"
      },
      {
        "Code": "34786-4",
        "Display": "Mental health Note"
      },
      {
        "Code": "68677-4",
        "Display": "Multi-specialty program Note"
      },
      {
        "Code": "34796-3",
        "Display": "Nephrology Note"
      },
      {
        "Code": "34799-7",
        "Display": "Neurological surgery Note"
      },
      {
        "Code": "34905-0",
        "Display": "Neurology Note"
      },
      {
        "Code": "68700-4",
        "Display": "Neurology with special qualifications in child neurology Note"
      },
      {
        "Code": "34746-8",
        "Display": "Nurse Note"
      },
      {
        "Code": "34801-1",
        "Display": "Nutrition and dietetics Note"
      },
      {
        "Code": "34778-1",
        "Display": "Obstetrics and Gynecology Note"
      },
      {
        "Code": "34802-9",
        "Display": "Occupational medicine Note"
      },
      {
        "Code": "28578-3",
        "Display": "Occupational therapy Note"
      },
      {
        "Code": "34806-0",
        "Display": "Oncology Note"
      },
      {
        "Code": "34808-6",
        "Display": "Ophthalmology Note"
      },
      {
        "Code": "34811-0",
        "Display": "Optometry Note"
      },
      {
        "Code": "34813-6",
        "Display": "Oral and Maxillofacial Surgery Note"
      },
      {
        "Code": "34815-1",
        "Display": "Orthopaedic surgery Note"
      },
      {
        "Code": "34817-7",
        "Display": "Otolaryngology Note"
      },
      {
        "Code": "34858-1",
        "Display": "Pain medicine Note"
      },
      {
        "Code": "34906-8",
        "Display": "Pastoral care Note"
      },
      {
        "Code": "51855-5",
        "Display": "Patient Note"
      },
      {
        "Code": "68722-8",
        "Display": "Pediatric cardiology Note"
      },
      {
        "Code": "68889-5",
        "Display": "Pediatric dermatology Note"
      },
      {
        "Code": "68894-5",
        "Display": "Pediatric endocrinology Note"
      },
      {
        "Code": "68741-8",
        "Display": "Pediatric gastroenterology Note"
      },
      {
        "Code": "68752-5",
        "Display": "Pediatric hematology-oncology Note"
      },
      {
        "Code": "68761-6",
        "Display": "Pediatric infectious diseases Note"
      },
      {
        "Code": "68867-1",
        "Display": "Pediatric nephrology Note"
      },
      {
        "Code": "68871-3",
        "Display": "Pediatric otolaryngology Note"
      },
      {
        "Code": "68782-2",
        "Display": "Pediatric pulmonology Note"
      },
      {
        "Code": "68854-9",
        "Display": "Pediatric rehabilitation medicine Note"
      },
      {
        "Code": "68876-2",
        "Display": "Pediatric rheumatology Note"
      },
      {
        "Code": "68881-2",
        "Display": "Pediatric surgery Note"
      },
      {
        "Code": "68859-8",
        "Display": "Pediatric transplant hepatology Note"
      },
      {
        "Code": "68882-0",
        "Display": "Pediatric urology Note"
      },
      {
        "Code": "68818-4",
        "Display": "Pediatrics Note"
      },
      {
        "Code": "34821-9",
        "Display": "Pharmacy Note"
      },
      {
        "Code": "34823-5",
        "Display": "Physical medicine and rehabilitation Note"
      },
      {
        "Code": "28579-1",
        "Display": "Physical therapy Note"
      },
      {
        "Code": "34827-6",
        "Display": "Plastic surgery Note"
      },
      {
        "Code": "34829-2",
        "Display": "Podiatry Note"
      },
      {
        "Code": "68834-1",
        "Display": "Primary care Note"
      },
      {
        "Code": "28628-6",
        "Display": "Psychiatry Note"
      },
      {
        "Code": "34792-2",
        "Display": "Psychology Note"
      },
      {
        "Code": "34830-0",
        "Display": "Pulmonary Note"
      },
      {
        "Code": "34832-6",
        "Display": "Radiation oncology Note"
      },
      {
        "Code": "34834-2",
        "Display": "Recreational therapy Note"
      },
      {
        "Code": "68839-0",
        "Display": "Research Note"
      },
      {
        "Code": "34838-3",
        "Display": "Respiratory therapy Note"
      },
      {
        "Code": "34840-9",
        "Display": "Rheumatology Note"
      },
      {
        "Code": "28653-4",
        "Display": "Social work Note"
      },
      {
        "Code": "28571-8",
        "Display": "Speech-language pathology Note"
      },
      {
        "Code": "34846-6",
        "Display": "Speech-language pathology+Audiology Note"
      },
      {
        "Code": "34848-2",
        "Display": "Surgery Note"
      },
      {
        "Code": "34773-2",
        "Display": "Surgery Physician attending Note"
      },
      {
        "Code": "68848-1",
        "Display": "Transplant surgery Note"
      },
      {
        "Code": "34852-4",
        "Display": "Urology Note"
      },
      {
        "Code": "34111-5",
        "Display": "Emergency department Note"
      },
      {
        "Code": "57053-1",
        "Display": "Nurse Emergency department Note"
      },
      {
        "Code": "34112-3",
        "Display": "Hospital Note"
      },
      {
        "Code": "64069-8",
        "Display": "Critical care medicine Physician attending Hospital Note"
      },
      {
        "Code": "68827-5",
        "Display": "Pediatrics Hospital Note"
      },
      {
        "Code": "64077-1",
        "Display": "Pulmonary Physician attending Hospital Note"
      },
      {
        "Code": "64073-0",
        "Display": "Thoracic surgery Physician attending Hospital Note"
      },
      {
        "Code": "34113-1",
        "Display": "Nursing facility Note"
      },
      {
        "Code": "34108-1",
        "Display": "Outpatient Note"
      },
      {
        "Code": "34753-4",
        "Display": "Cardiology Outpatient Note"
      },
      {
        "Code": "34110-7",
        "Display": "Diabetology Outpatient Note"
      },
      {
        "Code": "34766-6",
        "Display": "General medicine Outpatient Note"
      },
      {
        "Code": "68601-4",
        "Display": "Psychiatry Outpatient Note"
      },
      {
        "Code": "34850-8",
        "Display": "Thoracic surgery Outpatient Note"
      },
      {
        "Code": "34854-0",
        "Display": "Vascular surgery Outpatient Note"
      },
      {
        "Code": "68672-5",
        "Display": "Geriatric medicine Skilled nursing facility Note"
      },
      {
        "Code": "34748-4",
        "Display": "Telephone encounter Note"
      },
      {
        "Code": "34139-6",
        "Display": "Nurse Telephone encounter Note"
      },
      {
        "Code": "34844-1",
        "Display": "Social work Telephone encounter Note"
      },
      {
        "Code": "74166-0",
        "Display": "Occupational summary note"
      },
      {
        "Code": "74156-1",
        "Display": "Oncology treatment plan and summary Document"
      },
      {
        "Code": "64300-7",
        "Display": "Organ donation consent"
      },
      {
        "Code": "60591-5",
        "Display": "Patient summary Document"
      },
      {
        "Code": "60592-3",
        "Display": "Patient summary.unexpected contact Document"
      },
      {
        "Code": "57834-4",
        "Display": "Patient transportation request Document"
      },
      {
        "Code": "48768-6",
        "Display": "Payment sources Document"
      },
      {
        "Code": "53576-5",
        "Display": "Personal health monitoring report Document"
      },
      {
        "Code": "64296-7",
        "Display": "Personal health monitoring report Automated"
      },
      {
        "Code": "72170-4",
        "Display": "Photographic image Unspecified body region Document"
      },
      {
        "Code": "56447-6",
        "Display": "Plan of care note"
      },
      {
        "Code": "64295-9",
        "Display": "Nurse Plan of care note"
      },
      {
        "Code": "51900-9",
        "Display": "Population Summary note"
      },
      {
        "Code": "67860-7",
        "Display": "Postoperative evaluation and management note"
      },
      {
        "Code": "67861-5",
        "Display": "Ophthalmology Postoperative evaluation and management note"
      },
      {
        "Code": "34875-5",
        "Display": "Surgery Postoperative evaluation and management note"
      },
      {
        "Code": "34880-5",
        "Display": "Surgery Nurse Postoperative evaluation and management note"
      },
      {
        "Code": "68610-5",
        "Display": "Hospital Postoperative evaluation and management note"
      },
      {
        "Code": "68606-3",
        "Display": "Surgery Hospital Postoperative evaluation and management note"
      },
      {
        "Code": "34867-2",
        "Display": "Ophthalmology Outpatient Postoperative evaluation and management note"
      },
      {
        "Code": "64298-3",
        "Display": "Power of attorney"
      },
      {
        "Code": "74207-2",
        "Display": "Prehospital summary Document"
      },
      {
        "Code": "67862-3",
        "Display": "Preoperative evaluation and management note"
      },
      {
        "Code": "68616-2",
        "Display": "Adolescent medicine Preoperative evaluation and management note"
      },
      {
        "Code": "68623-8",
        "Display": "Advanced heart failure and transplant cardiology Preoperative evaluation and management note"
      },
      {
        "Code": "34751-8",
        "Display": "Anesthesiology Preoperative evaluation and management note"
      },
      {
        "Code": "68638-6",
        "Display": "Audiology Preoperative evaluation and management note"
      },
      {
        "Code": "68657-6",
        "Display": "Clinical genetics Preoperative evaluation and management note"
      },
      {
        "Code": "68550-3",
        "Display": "Dermatology Preoperative evaluation and management note"
      },
      {
        "Code": "68678-2",
        "Display": "Multi-specialty program Preoperative evaluation and management note"
      },
      {
        "Code": "68691-5",
        "Display": "Neurological surgery Preoperative evaluation and management note"
      },
      {
        "Code": "68701-2",
        "Display": "Neurology with special qualifications in child neurology Preoperative evaluation and management note"
      },
      {
        "Code": "34747-6",
        "Display": "Nurse Preoperative evaluation and management note"
      },
      {
        "Code": "68562-8",
        "Display": "Obstetrics and Gynecology Preoperative evaluation and management note"
      },
      {
        "Code": "34809-4",
        "Display": "Ophthalmology Preoperative evaluation and management note"
      },
      {
        "Code": "68581-8",
        "Display": "Orthopaedic surgery Preoperative evaluation and management note"
      },
      {
        "Code": "68713-7",
        "Display": "Pain medicine Preoperative evaluation and management note"
      },
      {
        "Code": "68723-6",
        "Display": "Pediatric cardiology Preoperative evaluation and management note"
      },
      {
        "Code": "68732-7",
        "Display": "Pediatric dermatology Preoperative evaluation and management note"
      },
      {
        "Code": "68736-8",
        "Display": "Pediatric endocrinology Preoperative evaluation and management note"
      },
      {
        "Code": "68742-6",
        "Display": "Pediatric gastroenterology Preoperative evaluation and management note"
      },
      {
        "Code": "68753-3",
        "Display": "Pediatric hematology-oncology Preoperative evaluation and management note"
      },
      {
        "Code": "68762-4",
        "Display": "Pediatric infectious diseases Preoperative evaluation and management note"
      },
      {
        "Code": "68771-5",
        "Display": "Pediatric nephrology Preoperative evaluation and management note"
      },
      {
        "Code": "68776-4",
        "Display": "Pediatric otolaryngology Preoperative evaluation and management note"
      },
      {
        "Code": "68783-0",
        "Display": "Pediatric pulmonology Preoperative evaluation and management note"
      },
      {
        "Code": "68792-1",
        "Display": "Pediatric rheumatology Preoperative evaluation and management note"
      },
      {
        "Code": "68798-8",
        "Display": "Pediatric surgery Preoperative evaluation and management note"
      },
      {
        "Code": "68860-6",
        "Display": "Pediatric transplant hepatology Preoperative evaluation and management note"
      },
      {
        "Code": "68808-5",
        "Display": "Pediatric urology Preoperative evaluation and management note"
      },
      {
        "Code": "68819-2",
        "Display": "Pediatrics Preoperative evaluation and management note"
      },
      {
        "Code": "68594-1",
        "Display": "Plastic surgery Preoperative evaluation and management note"
      },
      {
        "Code": "68835-8",
        "Display": "Primary care Preoperative evaluation and management note"
      },
      {
        "Code": "68844-0",
        "Display": "Speech-language pathology Preoperative evaluation and management note"
      },
      {
        "Code": "34876-3",
        "Display": "Surgery Preoperative evaluation and management note"
      },
      {
        "Code": "34881-3",
        "Display": "Surgery Nurse Preoperative evaluation and management note"
      },
      {
        "Code": "68850-7",
        "Display": "Transplant surgery Preoperative evaluation and management note"
      },
      {
        "Code": "34123-0",
        "Display": "Anesthesiology Hospital Preoperative evaluation and management note"
      },
      {
        "Code": "68828-3",
        "Display": "Pediatrics Hospital Preoperative evaluation and management note"
      },
      {
        "Code": "57832-8",
        "Display": "Prescription for diagnostic or specialist care Document"
      },
      {
        "Code": "64288-4",
        "Display": "Prescription for eyewear"
      },
      {
        "Code": "57829-4",
        "Display": "Prescription for medical equipment or product Document"
      },
      {
        "Code": "57833-6",
        "Display": "Prescription for medication Document"
      },
      {
        "Code": "57831-0",
        "Display": "Prescription for rehabilitation Document"
      },
      {
        "Code": "57828-6",
        "Display": "Prescription list Document"
      },
      {
        "Code": "73709-8",
        "Display": "Prescription request Pharmacy Document from Pharmacist"
      },
      {
        "Code": "55114-3",
        "Display": "Prior imaging procedure descriptions Document"
      },
      {
        "Code": "57017-6",
        "Display": "Privacy policy Organization Document"
      },
      {
        "Code": "57016-8",
        "Display": "Privacy policy acknowledgment Document"
      },
      {
        "Code": "64293-4",
        "Display": "Procedure consent"
      },
      {
        "Code": "68630-3",
        "Display": "Allergy and immunology procedure note"
      },
      {
        "Code": "68658-4",
        "Display": "Clinical genetics procedure note"
      },
      {
        "Code": "68667-5",
        "Display": "Developmental-behavioral pediatrics procedure note"
      },
      {
        "Code": "68692-3",
        "Display": "Neurological surgery procedure note"
      },
      {
        "Code": "68702-0",
        "Display": "Neurology with special qualifications in child neurology procedure note"
      },
      {
        "Code": "68563-6",
        "Display": "Obstetrics and Gynecology procedure note"
      },
      {
        "Code": "68714-5",
        "Display": "Pain medicine procedure note"
      },
      {
        "Code": "68724-4",
        "Display": "Pediatric cardiology procedure note"
      },
      {
        "Code": "68890-3",
        "Display": "Pediatric dermatology procedure note"
      },
      {
        "Code": "68895-2",
        "Display": "Pediatric endocrinology procedure note"
      },
      {
        "Code": "68743-4",
        "Display": "Pediatric gastroenterology procedure note"
      },
      {
        "Code": "68754-1",
        "Display": "Pediatric hematology-oncology procedure note"
      },
      {
        "Code": "68868-9",
        "Display": "Pediatric nephrology procedure note"
      },
      {
        "Code": "68872-1",
        "Display": "Pediatric otolaryngology procedure note"
      },
      {
        "Code": "68784-8",
        "Display": "Pediatric pulmonology procedure note"
      },
      {
        "Code": "68877-0",
        "Display": "Pediatric rheumatology procedure note"
      },
      {
        "Code": "68799-6",
        "Display": "Pediatric surgery procedure note"
      },
      {
        "Code": "68861-4",
        "Display": "Pediatric transplant hepatology procedure note"
      },
      {
        "Code": "68809-3",
        "Display": "Pediatric urology procedure note"
      },
      {
        "Code": "68820-0",
        "Display": "Pediatrics procedure note"
      },
      {
        "Code": "68836-6",
        "Display": "Primary care procedure note"
      },
      {
        "Code": "68851-5",
        "Display": "Transplant surgery procedure note"
      },
      {
        "Code": "68729-3",
        "Display": "Pediatric critical care medicine Hospital procedure note"
      },
      {
        "Code": "68829-1",
        "Display": "Pediatrics Hospital procedure note"
      },
      {
        "Code": "68607-1",
        "Display": "Progress letter"
      },
      {
        "Code": "11506-3",
        "Display": "Provider-unspecified Progress note"
      },
      {
        "Code": "68617-0",
        "Display": "Adolescent medicine Progress note"
      },
      {
        "Code": "68631-1",
        "Display": "Allergy and immunology Progress note"
      },
      {
        "Code": "68646-9",
        "Display": "Child and adolescent psychiatry Progress note"
      },
      {
        "Code": "28580-9",
        "Display": "Chiropractic medicine Progress note"
      },
      {
        "Code": "68659-2",
        "Display": "Clinical genetics Progress note"
      },
      {
        "Code": "28617-9",
        "Display": "Dentistry Progress note"
      },
      {
        "Code": "68668-3",
        "Display": "Developmental-behavioral pediatrics Progress note"
      },
      {
        "Code": "34900-1",
        "Display": "General medicine Progress note"
      },
      {
        "Code": "68554-5",
        "Display": "Hematology+Medical Oncology Progress note"
      },
      {
        "Code": "72556-4",
        "Display": "Interventional radiology Progress note"
      },
      {
        "Code": "34904-3",
        "Display": "Mental health Progress note"
      },
      {
        "Code": "68679-0",
        "Display": "Multi-specialty program Progress note"
      },
      {
        "Code": "68693-1",
        "Display": "Neurological surgery Progress note"
      },
      {
        "Code": "68703-8",
        "Display": "Neurology with special qualifications in child neurology Progress note"
      },
      {
        "Code": "28623-7",
        "Display": "Nurse Progress note"
      },
      {
        "Code": "28575-9",
        "Display": "Nurse practitioner Progress note"
      },
      {
        "Code": "68564-4",
        "Display": "Obstetrics and Gynecology Progress note"
      },
      {
        "Code": "11507-1",
        "Display": "Occupational therapy Progress note"
      },
      {
        "Code": "68574-3",
        "Display": "Ophthalmology Progress note"
      },
      {
        "Code": "68582-6",
        "Display": "Orthopaedic surgery Progress note"
      },
      {
        "Code": "68725-1",
        "Display": "Pediatric cardiology Progress note"
      },
      {
        "Code": "68891-1",
        "Display": "Pediatric dermatology Progress note"
      },
      {
        "Code": "68896-0",
        "Display": "Pediatric endocrinology Progress note"
      },
      {
        "Code": "68744-2",
        "Display": "Pediatric gastroenterology Progress note"
      },
      {
        "Code": "68755-8",
        "Display": "Pediatric hematology-oncology Progress note"
      },
      {
        "Code": "68763-2",
        "Display": "Pediatric infectious diseases Progress note"
      },
      {
        "Code": "68873-9",
        "Display": "Pediatric otolaryngology Progress note"
      },
      {
        "Code": "68785-5",
        "Display": "Pediatric pulmonology Progress note"
      },
      {
        "Code": "68878-8",
        "Display": "Pediatric rheumatology Progress note"
      },
      {
        "Code": "68800-2",
        "Display": "Pediatric surgery Progress note"
      },
      {
        "Code": "68862-2",
        "Display": "Pediatric transplant hepatology Progress note"
      },
      {
        "Code": "68810-1",
        "Display": "Pediatric urology Progress note"
      },
      {
        "Code": "11508-9",
        "Display": "Physical therapy Progress note"
      },
      {
        "Code": "18733-6",
        "Display": "Physician attending Progress note"
      },
      {
        "Code": "28569-2",
        "Display": "Physician consulting Progress note"
      },
      {
        "Code": "68595-8",
        "Display": "Plastic surgery Progress note"
      },
      {
        "Code": "11509-7",
        "Display": "Podiatry Progress note"
      },
      {
        "Code": "28627-8",
        "Display": "Psychiatry Progress note"
      },
      {
        "Code": "11510-5",
        "Display": "Psychology Progress note"
      },
      {
        "Code": "68840-8",
        "Display": "Research Progress note"
      },
      {
        "Code": "28656-7",
        "Display": "Social work Progress note"
      },
      {
        "Code": "11512-1",
        "Display": "Speech-language pathology Progress note"
      },
      {
        "Code": "15507-7",
        "Display": "Provider-unspecified ED Progress note"
      },
      {
        "Code": "34130-5",
        "Display": "Hospital Progress note"
      },
      {
        "Code": "68472-0",
        "Display": "Cardiology Hospital Progress note"
      },
      {
        "Code": "68485-2",
        "Display": "Cardiology Medical student Hospital Progress note"
      },
      {
        "Code": "68484-5",
        "Display": "Cardiology Physician attending Hospital Progress note"
      },
      {
        "Code": "64059-9",
        "Display": "Critical Care Medicine Hospital Progress note"
      },
      {
        "Code": "64071-4",
        "Display": "Critical care medicine Medical student Hospital Progress note"
      },
      {
        "Code": "68473-8",
        "Display": "Critical care medicine Physician attending Hospital Progress note"
      },
      {
        "Code": "64055-7",
        "Display": "General medicine Medical student Hospital Progress note"
      },
      {
        "Code": "68475-3",
        "Display": "General medicine Physician attending Hospital Progress note"
      },
      {
        "Code": "68830-9",
        "Display": "Pediatrics Hospital Progress note"
      },
      {
        "Code": "64063-1",
        "Display": "Pulmonary Hospital Progress note"
      },
      {
        "Code": "64079-7",
        "Display": "Pulmonary Medical student Hospital Progress note"
      },
      {
        "Code": "68478-7",
        "Display": "Pulmonary Physician attending Hospital Progress note"
      },
      {
        "Code": "68479-5",
        "Display": "Respiratory therapy Hospital Progress note"
      },
      {
        "Code": "64057-3",
        "Display": "Surgery Hospital Progress note"
      },
      {
        "Code": "64067-2",
        "Display": "Surgery Medical student Hospital Progress note"
      },
      {
        "Code": "68480-3",
        "Display": "Surgery Physician attending Hospital Progress note"
      },
      {
        "Code": "64061-5",
        "Display": "Thoracic surgery Hospital Progress note"
      },
      {
        "Code": "64075-5",
        "Display": "Thoracic surgery Medical student Hospital Progress note"
      },
      {
        "Code": "68481-1",
        "Display": "Thoracic surgery Physician attending Hospital Progress note"
      },
      {
        "Code": "70238-1",
        "Display": "Transplant surgery Hospital Progress note"
      },
      {
        "Code": "34126-3",
        "Display": "Intensive care unit Progress note"
      },
      {
        "Code": "34131-3",
        "Display": "Outpatient Progress note"
      },
      {
        "Code": "34124-8",
        "Display": "Cardiology Outpatient Progress note"
      },
      {
        "Code": "34128-9",
        "Display": "Dentistry Outpatient Progress note"
      },
      {
        "Code": "34127-1",
        "Display": "Dentistry Hygienist Outpatient Progress note"
      },
      {
        "Code": "34901-9",
        "Display": "General medicine Outpatient Progress note"
      },
      {
        "Code": "34132-1",
        "Display": "Pharmacy Outpatient Progress note"
      },
      {
        "Code": "34129-7",
        "Display": "Patient's home Progress note"
      },
      {
        "Code": "34125-5",
        "Display": "Case manager Patient's home Progress note"
      },
      {
        "Code": "74468-0",
        "Display": "Questionnaire form definition section Document"
      },
      {
        "Code": "74465-6",
        "Display": "Questionnaire response section Document"
      },
      {
        "Code": "73569-6",
        "Display": "Radiation exposure and protection information [Description] Document Diagnostic imaging"
      },
      {
        "Code": "64294-2",
        "Display": "Readiness for duty letter"
      },
      {
        "Code": "64284-3",
        "Display": "Readiness for duty assessment"
      },
      {
        "Code": "57133-1",
        "Display": "Referral note"
      },
      {
        "Code": "57170-3",
        "Display": "Cardiology Referral note"
      },
      {
        "Code": "57178-6",
        "Display": "Critical Care Medicine Referral note"
      },
      {
        "Code": "57134-9",
        "Display": "Dentistry Referral note"
      },
      {
        "Code": "57135-6",
        "Display": "Dermatology Referral note"
      },
      {
        "Code": "57136-4",
        "Display": "Diabetology Referral note"
      },
      {
        "Code": "57137-2",
        "Display": "Endocrinology Referral note"
      },
      {
        "Code": "69438-0",
        "Display": "Referral note Forensic medicine"
      },
      {
        "Code": "57138-0",
        "Display": "Gastroenterology Referral note"
      },
      {
        "Code": "57139-8",
        "Display": "General medicine Referral note"
      },
      {
        "Code": "57171-1",
        "Display": "Geriatric medicine Referral note"
      },
      {
        "Code": "57172-9",
        "Display": "Hematology+Medical Oncology Referral note"
      },
      {
        "Code": "57141-4",
        "Display": "Infectious disease Referral note"
      },
      {
        "Code": "57142-2",
        "Display": "Kinesiotherapy Referral note"
      },
      {
        "Code": "57143-0",
        "Display": "Mental health Referral note"
      },
      {
        "Code": "57144-8",
        "Display": "Nephrology Referral note"
      },
      {
        "Code": "57146-3",
        "Display": "Neurological surgery Referral note"
      },
      {
        "Code": "57145-5",
        "Display": "Neurology Referral note"
      },
      {
        "Code": "57173-7",
        "Display": "Nutrition and dietetics Referral note"
      },
      {
        "Code": "57179-4",
        "Display": "Obstetrics and Gynecology Referral note"
      },
      {
        "Code": "57147-1",
        "Display": "Occupational medicine Referral note"
      },
      {
        "Code": "57148-9",
        "Display": "Occupational therapy Referral note"
      },
      {
        "Code": "57149-7",
        "Display": "Oncology Referral note"
      },
      {
        "Code": "57150-5",
        "Display": "Ophthalmology Referral note"
      },
      {
        "Code": "57151-3",
        "Display": "Optometry Referral note"
      },
      {
        "Code": "57174-5",
        "Display": "Oral and Maxillofacial Surgery Referral note"
      },
      {
        "Code": "57175-2",
        "Display": "Orthopaedic surgery Referral note"
      },
      {
        "Code": "57176-0",
        "Display": "Otolaryngology Referral note"
      },
      {
        "Code": "57152-1",
        "Display": "Pharmacy Referral note"
      },
      {
        "Code": "57153-9",
        "Display": "Physical medicine and rehabilitation Referral note"
      },
      {
        "Code": "57154-7",
        "Display": "Physical therapy Referral note"
      },
      {
        "Code": "57155-4",
        "Display": "Plastic surgery Referral note"
      },
      {
        "Code": "57156-2",
        "Display": "Podiatry Referral note"
      },
      {
        "Code": "57157-0",
        "Display": "Psychiatry Referral note"
      },
      {
        "Code": "57158-8",
        "Display": "Psychology Referral note"
      },
      {
        "Code": "57177-8",
        "Display": "Pulmonary Referral note"
      },
      {
        "Code": "57159-6",
        "Display": "Radiation oncology Referral note"
      },
      {
        "Code": "57160-4",
        "Display": "Recreational therapy Referral note"
      },
      {
        "Code": "57162-0",
        "Display": "Respiratory therapy Referral note"
      },
      {
        "Code": "57163-8",
        "Display": "Rheumatology Referral note"
      },
      {
        "Code": "57164-6",
        "Display": "Social work Referral note"
      },
      {
        "Code": "57165-3",
        "Display": "Speech-language pathology Referral note"
      },
      {
        "Code": "57166-1",
        "Display": "Surgery Referral note"
      },
      {
        "Code": "57167-9",
        "Display": "Thoracic surgery Referral note"
      },
      {
        "Code": "57168-7",
        "Display": "Urology Referral note"
      },
      {
        "Code": "57169-5",
        "Display": "Vascular surgery Referral note"
      },
      {
        "Code": "64292-6",
        "Display": "Release of information consent"
      },
      {
        "Code": "55115-0",
        "Display": "Requested imaging studies information Document"
      },
      {
        "Code": "70007-0",
        "Display": "Restraint note"
      },
      {
        "Code": "68476-1",
        "Display": "Nurse Hospital Restraint note"
      },
      {
        "Code": "68474-6",
        "Display": "Physician Hospital Restraint note"
      },
      {
        "Code": "71482-4",
        "Display": "Risk assessment Document"
      },
      {
        "Code": "51898-5",
        "Display": "Risk factors Document"
      },
      {
        "Code": "74153-8",
        "Display": "Seizure disorder action plan"
      },
      {
        "Code": "59282-4",
        "Display": "Stress cardiac echo study report US"
      },
      {
        "Code": "47045-0",
        "Display": "Study report"
      },
      {
        "Code": "68608-9",
        "Display": "Summary note"
      },
      {
        "Code": "61143-4",
        "Display": "Nurse Summary note"
      },
      {
        "Code": "68602-2",
        "Display": "Radiation oncology Summary note"
      },
      {
        "Code": "68603-0",
        "Display": "Radiation oncology Hospital Summary note"
      },
      {
        "Code": "47046-8",
        "Display": "Summary of death note"
      },
      {
        "Code": "34133-9",
        "Display": "Summary of episode note"
      },
      {
        "Code": "74211-4",
        "Display": "Summary of episode note Emergency department+Hospital"
      },
      {
        "Code": "48764-5",
        "Display": "Summary purpose CCD Document"
      },
      {
        "Code": "47047-6",
        "Display": "Supervisory note"
      },
      {
        "Code": "67865-6",
        "Display": "Outpatient Supervisory note"
      },
      {
        "Code": "34135-4",
        "Display": "Cardiology Physician attending Outpatient Supervisory note"
      },
      {
        "Code": "34136-2",
        "Display": "Gastroenterology Physician attending Outpatient Supervisory note"
      },
      {
        "Code": "34134-7",
        "Display": "Physician attending Outpatient Supervisory note"
      },
      {
        "Code": "61358-8",
        "Display": "Patient Surgical operation consent"
      },
      {
        "Code": "11504-8",
        "Display": "Provider-unspecified Operation note"
      },
      {
        "Code": "34868-0",
        "Display": "Orthopaedic surgery Surgical operation note"
      },
      {
        "Code": "34818-5",
        "Display": "Otolaryngology Surgical operation note"
      },
      {
        "Code": "34870-6",
        "Display": "Plastic surgery Surgical operation note"
      },
      {
        "Code": "28624-5",
        "Display": "Podiatry Operation note"
      },
      {
        "Code": "34874-8",
        "Display": "Surgery Surgical operation note"
      },
      {
        "Code": "34877-1",
        "Display": "Urology Surgical operation note"
      },
      {
        "Code": "34137-0",
        "Display": "Outpatient Surgical operation note"
      },
      {
        "Code": "34138-8",
        "Display": "Targeted history and physical note"
      },
      {
        "Code": "18761-7",
        "Display": "Provider-unspecified Transfer summary"
      },
      {
        "Code": "68618-8",
        "Display": "Adolescent medicine Transfer summary note"
      },
      {
        "Code": "68632-9",
        "Display": "Allergy and immunology Transfer summary note"
      },
      {
        "Code": "68647-7",
        "Display": "Child and adolescent psychiatry Transfer summary note"
      },
      {
        "Code": "68660-0",
        "Display": "Clinical genetics Transfer summary note"
      },
      {
        "Code": "34755-9",
        "Display": "Critical care medicine Transfer summary note"
      },
      {
        "Code": "68669-1",
        "Display": "Developmental-behavioral pediatrics Transfer summary note"
      },
      {
        "Code": "34770-8",
        "Display": "General medicine Transfer summary note"
      },
      {
        "Code": "68680-8",
        "Display": "Multi-specialty program Transfer summary note"
      },
      {
        "Code": "68704-6",
        "Display": "Neurology with special qualifications in child neurology Transfer summary note"
      },
      {
        "Code": "68565-1",
        "Display": "Obstetrics and Gynecology Transfer summary note"
      },
      {
        "Code": "68569-3",
        "Display": "Occupational therapy Transfer summary note"
      },
      {
        "Code": "68887-9",
        "Display": "Ophthalmology Transfer summary note"
      },
      {
        "Code": "68583-4",
        "Display": "Orthopaedic surgery Transfer summary note"
      },
      {
        "Code": "68715-2",
        "Display": "Pain medicine Transfer summary note"
      },
      {
        "Code": "68726-9",
        "Display": "Pediatric cardiology Transfer summary note"
      },
      {
        "Code": "68737-6",
        "Display": "Pediatric endocrinology Transfer summary note"
      },
      {
        "Code": "68745-9",
        "Display": "Pediatric gastroenterology Transfer summary note"
      },
      {
        "Code": "68756-6",
        "Display": "Pediatric hematology-oncology Transfer summary note"
      },
      {
        "Code": "68764-0",
        "Display": "Pediatric infectious diseases Transfer summary note"
      },
      {
        "Code": "68772-3",
        "Display": "Pediatric nephrology Transfer summary note"
      },
      {
        "Code": "68777-2",
        "Display": "Pediatric otolaryngology Transfer summary note"
      },
      {
        "Code": "68786-3",
        "Display": "Pediatric pulmonology Transfer summary note"
      },
      {
        "Code": "68793-9",
        "Display": "Pediatric rheumatology Transfer summary note"
      },
      {
        "Code": "68801-0",
        "Display": "Pediatric surgery Transfer summary note"
      },
      {
        "Code": "68863-0",
        "Display": "Pediatric transplant hepatology Transfer summary note"
      },
      {
        "Code": "68811-9",
        "Display": "Pediatric urology Transfer summary note"
      },
      {
        "Code": "68883-8",
        "Display": "Pediatrics Transfer summary note"
      },
      {
        "Code": "68596-6",
        "Display": "Plastic surgery Transfer summary note"
      },
      {
        "Code": "68482-9",
        "Display": "Nurse Hospital Transfer summary note"
      },
      {
        "Code": "68884-6",
        "Display": "Pediatrics Hospital Transfer summary note"
      },
      {
        "Code": "59281-6",
        "Display": "Transthoracic cardiac echo study report US"
      },
      {
        "Code": "74198-3",
        "Display": "Trauma summary registry report Document"
      },
      {
        "Code": "54094-8",
        "Display": "Emergency department Triage note"
      },
      {
        "Code": "57054-9",
        "Display": "Nurse Emergency department Triage+care note"
      },
      {
        "Code": "38932-0",
        "Display": "VA Compensation and Pension (C and P) examination acromegaly"
      },
      {
        "Code": "38933-8",
        "Display": "VA Compensation and Pension (C and P) examination aid and attendance/housebound"
      },
      {
        "Code": "38934-6",
        "Display": "VA Compensation and Pension (C and P) examination arrhythmias"
      },
      {
        "Code": "38936-1",
        "Display": "VA Compensation and Pension (C and P) examination audio"
      },
      {
        "Code": "38937-9",
        "Display": "VA Compensation and Pension (C and P) examination bones fractures/bone disease"
      },
      {
        "Code": "38938-7",
        "Display": "VA Compensation and Pension (C and P) examination brain/spinal cord"
      },
      {
        "Code": "38939-5",
        "Display": "VA Compensation and Pension (C and P) examination chronic fatigue syndrome"
      },
      {
        "Code": "38940-3",
        "Display": "VA Compensation and Pension (C and P) examination cold injury protocol"
      },
      {
        "Code": "38941-1",
        "Display": "VA Compensation and Pension (C and P) examination cranial nerves"
      },
      {
        "Code": "38942-9",
        "Display": "VA Compensation and Pension (C and P) examination Cushings syndrome"
      },
      {
        "Code": "38943-7",
        "Display": "VA Compensation and Pension (C and P) examination dental/oral"
      },
      {
        "Code": "38944-5",
        "Display": "VA Compensation and Pension (C and P) examination diabetes mellitus"
      },
      {
        "Code": "38956-9",
        "Display": "VA Compensation and Pension (C and P) examination disability in gulf war veterans"
      },
      {
        "Code": "38946-0",
        "Display": "VA Compensation and Pension (C and P) examination ear disease"
      },
      {
        "Code": "38949-4",
        "Display": "VA Compensation and Pension (C and P) examination epilepsy/narcolepsy"
      },
      {
        "Code": "38950-2",
        "Display": "VA Compensation and Pension (C and P) examination esophagus/hiatal hernia"
      },
      {
        "Code": "38966-8",
        "Display": "VA Compensation and Pension (C and P) examination extremity joints"
      },
      {
        "Code": "38951-0",
        "Display": "VA Compensation and Pension (C and P) examination eye"
      },
      {
        "Code": "38952-8",
        "Display": "VA Compensation and Pension (C and P) examination feet"
      },
      {
        "Code": "38953-6",
        "Display": "VA Compensation and Pension (C and P) examination fibromyalgia"
      },
      {
        "Code": "38954-4",
        "Display": "VA Compensation and Pension (C and P) examination general medical"
      },
      {
        "Code": "38969-2",
        "Display": "VA Compensation and Pension (C and P) examination general mental disorders"
      },
      {
        "Code": "38955-1",
        "Display": "VA Compensation and Pension (C and P) examination genitourinary"
      },
      {
        "Code": "38957-7",
        "Display": "VA Compensation and Pension (C and P) examination gynecological conditions/disorders of the breast"
      },
      {
        "Code": "38958-5",
        "Display": "VA Compensation and Pension (C and P) examination hand/thumb/fingers"
      },
      {
        "Code": "38959-3",
        "Display": "VA Compensation and Pension (C and P) examination heart"
      },
      {
        "Code": "38960-1",
        "Display": "VA Compensation and Pension (C and P) examination hemic disorders"
      },
      {
        "Code": "38961-9",
        "Display": "VA Compensation and Pension (C and P) examination HIV-related illness"
      },
      {
        "Code": "38962-7",
        "Display": "VA Compensation and Pension (C and P) examination hypertension"
      },
      {
        "Code": "38963-5",
        "Display": "VA Compensation and Pension (C and P) examination infectious/immune/nutritional disabilities"
      },
      {
        "Code": "38964-3",
        "Display": "VA Compensation and Pension (C and P) examination initial evaluation post-traumatic stress disorder"
      },
      {
        "Code": "38965-0",
        "Display": "VA Compensation and Pension (C and P) examination large/small intestines"
      },
      {
        "Code": "38967-6",
        "Display": "VA Compensation and Pension (C and P) examination liver/gall bladder/pancreas"
      },
      {
        "Code": "38968-4",
        "Display": "VA Compensation and Pension (C and P) examination lymphatic disorders"
      },
      {
        "Code": "38947-8",
        "Display": "VA Compensation and Pension (C and P) examination mental health eating disorders"
      },
      {
        "Code": "38935-3",
        "Display": "VA Compensation and Pension (C and P) examination miscellaneous arteries/veins"
      },
      {
        "Code": "38945-2",
        "Display": "VA Compensation and Pension (C and P) examination miscellaneous digestive conditions"
      },
      {
        "Code": "38948-6",
        "Display": "VA Compensation and Pension (C and P) examination miscellaneous endocrine diseases"
      },
      {
        "Code": "38972-6",
        "Display": "VA Compensation and Pension (C and P) examination miscellaneous neurological disorders"
      },
      {
        "Code": "38980-9",
        "Display": "VA Compensation and Pension (C and P) examination miscellaneous respiratory diseases"
      },
      {
        "Code": "38970-0",
        "Display": "VA Compensation and Pension (C and P) examination mouth/lips/tongue"
      },
      {
        "Code": "38971-8",
        "Display": "VA Compensation and Pension (C and P) examination muscles"
      },
      {
        "Code": "38973-4",
        "Display": "VA Compensation and Pension (C and P) examination nose/sinus/larynx/pharynx"
      },
      {
        "Code": "38979-1",
        "Display": "VA Compensation and Pension (C and P) examination obstructive/restrictive/interstitial respiratory diseases"
      },
      {
        "Code": "38974-2",
        "Display": "VA Compensation and Pension (C and P) examination peripheral nerves"
      },
      {
        "Code": "38975-9",
        "Display": "VA Compensation and Pension (C and P) examination prisoner of war protocol"
      },
      {
        "Code": "38976-7",
        "Display": "VA Compensation and Pension (C and P) examination pulmonary tuberculosis/mycobacterial diseases"
      },
      {
        "Code": "38977-5",
        "Display": "VA Compensation and Pension (C and P) examination rectum/anus"
      },
      {
        "Code": "38978-3",
        "Display": "VA Compensation and Pension (C and P) examination residuals of amputations"
      },
      {
        "Code": "38981-7",
        "Display": "VA Compensation and Pension (C and P) examination review evaluation post-traumatic stress disorder"
      },
      {
        "Code": "38982-5",
        "Display": "VA Compensation and Pension (C and P) examination scars"
      },
      {
        "Code": "38983-3",
        "Display": "VA Compensation and Pension (C and P) examination sense of smell/taste"
      },
      {
        "Code": "38984-1",
        "Display": "VA Compensation and Pension (C and P) examination skin diseases other than scars"
      },
      {
        "Code": "38985-8",
        "Display": "VA Compensation and Pension (C and P) examination social/industrial survey"
      },
      {
        "Code": "38986-6",
        "Display": "VA Compensation and Pension (C and P) examination spine"
      },
      {
        "Code": "38987-4",
        "Display": "VA Compensation and Pension (C and P) examination stomach/duodenum/peritoneal adhesions"
      },
      {
        "Code": "38988-2",
        "Display": "VA Compensation and Pension (C and P) examination thyroid/parathyroid diseases"
      },
      {
        "Code": "59283-2",
        "Display": "Well child visit note"
      },
      {
        "Code": "52027-0",
        "Display": "Abortion consent"
      },
      {
        "Code": "24754-4",
        "Display": "Administration of vasodilator into catheter of Vein"
      },
      {
        "Code": "26376-4",
        "Display": "Administration of vasodilator into catheter of Vein - bilateral"
      },
      {
        "Code": "26377-2",
        "Display": "Administration of vasodilator into catheter of Vein - left"
      },
      {
        "Code": "26378-0",
        "Display": "Administration of vasodilator into catheter of Vein - right"
      },
      {
        "Code": "53243-2",
        "Display": "Advanced beneficiary notice"
      },
      {
        "Code": "11485-0",
        "Display": "Anesthesia records"
      },
      {
        "Code": "30649-8",
        "Display": "Peripheral artery Fluoroscopic angiogram Additional angioplasty W contrast IA"
      },
      {
        "Code": "30641-5",
        "Display": "Vein Fluoroscopic angiogram Additional angioplasty W contrast IV"
      },
      {
        "Code": "36760-7",
        "Display": "AV shunt Fluoroscopic angiogram Angioplasty W contrast"
      },
      {
        "Code": "36762-3",
        "Display": "Extremity vessel Fluoroscopic angiogram Angioplasty W contrast"
      },
      {
        "Code": "69067-7",
        "Display": "Unspecified body region Fluoroscopic angiogram Angioplasty W contrast"
      },
      {
        "Code": "24543-1",
        "Display": "Aorta Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "24580-3",
        "Display": "Brachiocephalic artery Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "26368-1",
        "Display": "Brachiocephalic artery - left Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "26369-9",
        "Display": "Brachiocephalic artery - right Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "24614-0",
        "Display": "Carotid artery extracranial Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "24615-7",
        "Display": "Carotid artery intracranial Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "35881-2",
        "Display": "Extremity artery Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "24698-3",
        "Display": "Femoral artery Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "36763-1",
        "Display": "Femoral artery and Popliteal artery Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "24766-8",
        "Display": "Iliac artery Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "26370-7",
        "Display": "Iliac artery - bilateral Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "26371-5",
        "Display": "Iliac artery - left Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "26372-3",
        "Display": "Iliac artery - right Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "24832-8",
        "Display": "Mesenteric artery Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "30648-0",
        "Display": "Peripheral artery Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "25081-1",
        "Display": "Renal vessel Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "25012-6",
        "Display": "Tibial artery Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "26373-1",
        "Display": "Tibial artery - bilateral Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "26374-9",
        "Display": "Tibial artery - left Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "26375-6",
        "Display": "Tibial artery - right Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "43793-9",
        "Display": "Tibioperoneal arteries Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "43794-7",
        "Display": "Tibioperoneal arteries - bilateral Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "43795-4",
        "Display": "Tibioperoneal arteries - left Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "43792-1",
        "Display": "Tibioperoneal arteries - right Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "25064-7",
        "Display": "Vessel Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "30836-1",
        "Display": "Visceral artery Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "Code": "37426-4",
        "Display": "Lower extremity vein Fluoroscopic angiogram Angioplasty W contrast IV"
      },
      {
        "Code": "30640-7",
        "Display": "Vein Fluoroscopic angiogram Angioplasty W contrast IV"
      },
      {
        "Code": "35882-0",
        "Display": "Inferior vena cava Fluoroscopic angiogram Angioplasty W contrast IV"
      },
      {
        "Code": "52032-0",
        "Display": "Appeal denial letter"
      },
      {
        "Code": "36764-9",
        "Display": "Femoral vessel and Popliteal artery Fluoroscopic angiogram Atherectomy W contrast"
      },
      {
        "Code": "69135-2",
        "Display": "Iliac artery Fluoroscopic angiogram Atherectomy W contrast"
      },
      {
        "Code": "69253-3",
        "Display": "Renal vessels Fluoroscopic angiogram Atherectomy W contrast"
      },
      {
        "Code": "36765-6",
        "Display": "Vessel Fluoroscopic angiogram Atherectomy W contrast"
      },
      {
        "Code": "35883-8",
        "Display": "Aorta Fluoroscopic angiogram Atherectomy W contrast IA"
      },
      {
        "Code": "36766-4",
        "Display": "Coronary arteries Fluoroscopic angiogram Atherectomy W contrast IA"
      },
      {
        "Code": "24568-8",
        "Display": "AV fistula Fluoroscopic angiogram Atherectomy W contrast IV"
      },
      {
        "Code": "28615-3",
        "Display": "Audiology study"
      },
      {
        "Code": "52065-0",
        "Display": "Automobile liability"
      },
      {
        "Code": "18743-5",
        "Display": "Autopsy report"
      },
      {
        "Code": "36761-5",
        "Display": "Biliary ducts Fluoroscopy Balloon dilatation W contrast"
      },
      {
        "Code": "33720-4",
        "Display": "Blood bank consult"
      },
      {
        "Code": "52041-1",
        "Display": "Blood glucose monitors"
      },
      {
        "Code": "38268-9",
        "Display": "Skeletal system DXA Bone density"
      },
      {
        "Code": "43562-8",
        "Display": "Skeletal system.axial Scan Bone density"
      },
      {
        "Code": "43563-6",
        "Display": "Skeletal system.peripheral Scan Bone density"
      },
      {
        "Code": "48807-2",
        "Display": "Bone marrow aspiration report"
      },
      {
        "Code": "24631-4",
        "Display": "Unspecified body region Fluoroscopy Central vein catheter placement check"
      },
      {
        "Code": "53242-4",
        "Display": "Charge ticket or encounter form"
      },
      {
        "Code": "54095-5",
        "Display": "Chemotherapy effectiveness panel [Identifier] - Blood or Tissue"
      },
      {
        "Code": "11486-8",
        "Display": "Chemotherapy records"
      },
      {
        "Code": "71428-7",
        "Display": "CMS - history of present illness panel"
      },
      {
        "Code": "71421-2",
        "Display": "CMS - past family - social history panel"
      },
      {
        "Code": "71388-3",
        "Display": "CMS - physical exam panel"
      },
      {
        "Code": "71406-3",
        "Display": "CMS - review of systems panel"
      },
      {
        "Code": "25062-1",
        "Display": "Unspecified body region X-ray Comparison view"
      },
      {
        "Code": "24611-6",
        "Display": "Outpatient Consultation 2nd opinion"
      },
      {
        "Code": "60570-9",
        "Display": "Pathology Consult note"
      },
      {
        "Code": "60571-7",
        "Display": "Pathology Consult note.synoptic"
      },
      {
        "Code": "52042-9",
        "Display": "Continuous positive airway pressure (CPAP)"
      },
      {
        "Code": "25038-1",
        "Display": "Unspecified body region Courtesy consultation"
      },
      {
        "Code": "29751-5",
        "Display": "Critical care records"
      },
      {
        "Code": "50007-4",
        "Display": "Cytology report of Bronchoalveolar lavage Cyto stain"
      },
      {
        "Code": "47523-6",
        "Display": "Cytology report of Body fluid Cyto stain"
      },
      {
        "Code": "47530-1",
        "Display": "Cytology report of Breast ductal lavage Cyto stain"
      },
      {
        "Code": "47521-0",
        "Display": "Cytology report of Breast fine needle aspirate Cyto stain"
      },
      {
        "Code": "50971-1",
        "Display": "Cytology report of Bronchial brush Cyto stain"
      },
      {
        "Code": "47528-5",
        "Display": "Cytology report of Cervical or vaginal smear or scraping Cyto stain"
      },
      {
        "Code": "47527-7",
        "Display": "Cytology report of Cervical or vaginal smear or scraping Cyto stain.thin prep"
      },
      {
        "Code": "47522-8",
        "Display": "Cytology report of Nipple discharge Cyto stain"
      },
      {
        "Code": "47520-2",
        "Display": "Cytology report of Sputum Cyto stain"
      },
      {
        "Code": "47524-4",
        "Display": "Cytology report of Thyroid fine needle aspirate Cyto stain"
      },
      {
        "Code": "47529-3",
        "Display": "Cytology report of Tissue Other stain"
      },
      {
        "Code": "33718-8",
        "Display": "Cytology report of Tissue fine needle aspirate Cyto stain"
      },
      {
        "Code": "47525-1",
        "Display": "Cytology report of Urine Cyto stain"
      },
      {
        "Code": "47526-9",
        "Display": "Cytology report of Unspecified specimen Cyto stain"
      },
      {
        "Code": "52040-3",
        "Display": "Dental X-rays and other images (not DICOM)"
      },
      {
        "Code": "29749-9",
        "Display": "Dialysis records"
      },
      {
        "Code": "28622-9",
        "Display": "Nurse Discharge assessment"
      },
      {
        "Code": "28574-2",
        "Display": "Discharge note"
      },
      {
        "Code": "29761-4",
        "Display": "Dentist Discharge summary"
      },
      {
        "Code": "11490-0",
        "Display": "Physician Discharge summary"
      },
      {
        "Code": "28655-9",
        "Display": "Physician attending Discharge summary"
      },
      {
        "Code": "53245-7",
        "Display": "Driver license image"
      },
      {
        "Code": "53247-3",
        "Display": "Eligibility acknowledgement"
      },
      {
        "Code": "24684-3",
        "Display": "Extracranial vessels Fluoroscopic angiogram Embolectomy W contrast IA"
      },
      {
        "Code": "24887-2",
        "Display": "Pulmonary artery Fluoroscopic angiogram Embolectomy W contrast IA"
      },
      {
        "Code": "24553-0",
        "Display": "Vessel intracranial Fluoroscopic angiogram Embolectomy W contrast IV"
      },
      {
        "Code": "24554-8",
        "Display": "Artery Fluoroscopic angiogram Embolization W contrast IA"
      },
      {
        "Code": "52071-8",
        "Display": "Employee assistance program"
      },
      {
        "Code": "67796-3",
        "Display": "EMS patient care report - version 3.1 Document NEMSIS"
      },
      {
        "Code": "52043-7",
        "Display": "Enteral nutrition"
      },
      {
        "Code": "30600-1",
        "Display": "Small bowel CT Views Enteroclysis W contrast PO via duodenal intubation"
      },
      {
        "Code": "24923-5",
        "Display": "Small bowel Fluoroscopy Views Enteroclysis W contrast PO via duodenal intubation"
      },
      {
        "Code": "52030-4",
        "Display": "Explanation of benefits"
      },
      {
        "Code": "52031-2",
        "Display": "Explanation of benefits to subscriber"
      },
      {
        "Code": "52044-5",
        "Display": "External infusion pump"
      },
      {
        "Code": "29272-2",
        "Display": "Eye ultrasound study"
      },
      {
        "Code": "52064-3",
        "Display": "First report of injury"
      },
      {
        "Code": "57129-9",
        "Display": "Full newborn screening summary report for display or printing"
      },
      {
        "Code": "52045-2",
        "Display": "Gait trainers"
      },
      {
        "Code": "52033-8",
        "Display": "General correspondence"
      },
      {
        "Code": "51969-4",
        "Display": "Genetic analysis summary report in Blood or Tissue Document by Molecular genetics method"
      },
      {
        "Code": "46365-3",
        "Display": "CT Guidance for ablation of tissue of Celiac plexus"
      },
      {
        "Code": "44228-5",
        "Display": "CT Guidance for ablation of tissue of Kidney"
      },
      {
        "Code": "44156-8",
        "Display": "US Guidance for ablation of tissue of Kidney"
      },
      {
        "Code": "44101-4",
        "Display": "CT Guidance for ablation of tissue of Liver"
      },
      {
        "Code": "44155-0",
        "Display": "US Guidance for ablation of tissue of Liver"
      },
      {
        "Code": "58747-7",
        "Display": "CT Guidance for ablation of tissue of Unspecified body region"
      },
      {
        "Code": "58743-6",
        "Display": "US Guidance for ablation of tissue of Unspecified body region"
      },
      {
        "Code": "35884-6",
        "Display": "CT Guidance for abscess drainage of Abdomen"
      },
      {
        "Code": "42280-8",
        "Display": "CT Guidance for abscess drainage of Appendix"
      },
      {
        "Code": "42705-4",
        "Display": "US Guidance for abscess drainage of Appendix"
      },
      {
        "Code": "42281-6",
        "Display": "CT Guidance for abscess drainage of Chest"
      },
      {
        "Code": "42285-7",
        "Display": "CT Guidance for abscess drainage of Kidney"
      },
      {
        "Code": "44167-5",
        "Display": "US Guidance for abscess drainage of Kidney"
      },
      {
        "Code": "42282-4",
        "Display": "CT Guidance for abscess drainage of Liver"
      },
      {
        "Code": "42133-9",
        "Display": "US Guidance for abscess drainage of Liver"
      },
      {
        "Code": "39361-1",
        "Display": "Fluoroscopy Guidance for abscess drainage of Liver"
      },
      {
        "Code": "69120-4",
        "Display": "Fluoroscopy Guidance for abscess drainage of Neck"
      },
      {
        "Code": "69122-0",
        "Display": "Fluoroscopy Guidance for abscess drainage of Pancreas"
      },
      {
        "Code": "42286-5",
        "Display": "CT Guidance for abscess drainage of Pelvis"
      },
      {
        "Code": "44168-3",
        "Display": "US Guidance for abscess drainage of Pelvis"
      },
      {
        "Code": "44169-1",
        "Display": "US Guidance for abscess drainage of Peritoneal space"
      },
      {
        "Code": "42284-0",
        "Display": "CT Guidance for abscess drainage of Pleural space"
      },
      {
        "Code": "69123-8",
        "Display": "Fluoroscopy Guidance for abscess drainage of Pleural space"
      },
      {
        "Code": "43502-4",
        "Display": "CT Guidance for abscess drainage of Subphrenic space"
      },
      {
        "Code": "44166-7",
        "Display": "US Guidance for abscess drainage of Subphrenic space"
      },
      {
        "Code": "30578-9",
        "Display": "CT Guidance for abscess drainage of Unspecified body region"
      },
      {
        "Code": "39451-0",
        "Display": "US Guidance for abscess drainage of Unspecified body region"
      },
      {
        "Code": "35885-3",
        "Display": "Fluoroscopy Guidance for abscess drainage of Unspecified body region"
      },
      {
        "Code": "39620-0",
        "Display": "Scan Guidance for abscess localization limited"
      },
      {
        "Code": "39623-4",
        "Display": "Scan Guidance for abscess localization whole body"
      },
      {
        "Code": "39622-6",
        "Display": "SPECT Guidance for abscess localization whole body"
      },
      {
        "Code": "39621-8",
        "Display": "SPECT Guidance for abscess localization"
      },
      {
        "Code": "72533-3",
        "Display": "US Guidance for ambulatory phlebectomy of Extremity vein - left"
      },
      {
        "Code": "72532-5",
        "Display": "US Guidance for ambulatory phlebectomy of Extremity vein - right"
      },
      {
        "Code": "24623-1",
        "Display": "CT Guidance for anesthetic block injection of Celiac plexus"
      },
      {
        "Code": "42688-2",
        "Display": "CT Guidance for anesthetic block injection of Spine"
      },
      {
        "Code": "35886-1",
        "Display": "CT Guidance for aspiration of Breast"
      },
      {
        "Code": "24598-5",
        "Display": "Mammogram Guidance for aspiration of Breast"
      },
      {
        "Code": "43756-6",
        "Display": "US Guidance for aspiration of Breast"
      },
      {
        "Code": "69278-0",
        "Display": "US Guidance for aspiration of Breast - bilateral"
      },
      {
        "Code": "69292-1",
        "Display": "US Guidance for aspiration of Breast - left"
      },
      {
        "Code": "69296-2",
        "Display": "US Guidance for aspiration of Breast - right"
      },
      {
        "Code": "35888-7",
        "Display": "Fluoroscopy Guidance for aspiration of Hip"
      },
      {
        "Code": "24771-8",
        "Display": "Fluoroscopy Guidance for aspiration of Joint space"
      },
      {
        "Code": "48434-5",
        "Display": "US Guidance for aspiration of Kidney"
      },
      {
        "Code": "24811-2",
        "Display": "CT Guidance for aspiration of Liver"
      },
      {
        "Code": "24822-9",
        "Display": "CT Guidance for aspiration of Lung"
      },
      {
        "Code": "69287-1",
        "Display": "US Guidance for aspiration of Lymph node"
      },
      {
        "Code": "24837-7",
        "Display": "CT Guidance for aspiration of Neck"
      },
      {
        "Code": "39452-8",
        "Display": "US Guidance for aspiration of Ovary"
      },
      {
        "Code": "24856-7",
        "Display": "CT Guidance for aspiration of Pancreas"
      },
      {
        "Code": "24863-3",
        "Display": "CT Guidance for aspiration of Pelvis"
      },
      {
        "Code": "30703-3",
        "Display": "US Guidance for aspiration of Pericardial space"
      },
      {
        "Code": "37491-8",
        "Display": "CT Guidance for aspiration of Pleural space"
      },
      {
        "Code": "24662-9",
        "Display": "US Guidance for aspiration of Pleural space"
      },
      {
        "Code": "37887-7",
        "Display": "Fluoroscopy Guidance for aspiration of Pleural space"
      },
      {
        "Code": "24973-0",
        "Display": "Fluoroscopy Guidance for aspiration of Spine Lumbar Space"
      },
      {
        "Code": "42134-7",
        "Display": "US Guidance for aspiration of Thyroid"
      },
      {
        "Code": "25043-1",
        "Display": "CT Guidance for aspiration of Unspecified body region"
      },
      {
        "Code": "30878-3",
        "Display": "US Guidance for aspiration of Unspecified body region"
      },
      {
        "Code": "36926-4",
        "Display": "CT Guidance for aspiration and placement of drainage tube of Abdomen"
      }
    ]
  };

  CDEX.requestAttachmentPayload = {
    "resourceType": "Task",
    "id": "",
    "identifier": [
      {
        "type": {
          "coding": [
            {
              "system": "http://hl7.org/fhir/us/davinci-cdex/CodeSystem/cdex-temp",
              "code": "tracking-id",
              "display": "Tracking Id"
            }
          ],
          "text": "Re-Association Tracking Control Number"
        },
        "system": "",
        "value": ""
      }
    ],
    "status": "requested",
    "intent": "order",
    "code": {
      "coding": [
        {
          "system": "http://hl7.org/fhir/us/davinci-cdex/CodeSystem/cdex-temp",
          "code": "attachment-request"
        }
      ],
      "text": "Attachment Request"
    },
    "for": {
      "reference": ""
    },
    "authoredOn": "",
    "lastModified": "",
    "requester": {
      "identifier": {
        "system": "http://example.org/cdex/payer/payer-ids",
        "value": ""
      }
    },
    "owner": {
      "identifier": {
        "system": "http://hl7.org/fhir/sid/us-npi",
        "value": ""
      }
    },
    "restriction": {
      "period": {
        "end": ""
      }
    },
    "input": []
  }

  CDEX.loincTypes = {
    "loinc": [
      {
        "code": "11485-0",
        "display": "Anesthesia records"
      },
      {
        "code": "11486-8",
        "display": "Chemotherapy records"
      },
      {
        "code": "11488-4",
        "display": "Consult note"
      },
      {
        "code": "11490-0",
        "display": "Physician Discharge summary"
      },
      {
        "code": "11492-6",
        "display": "Provider-unspecifed, History and physical note"
      },
      {
        "code": "11494-2",
        "display": "Deprecated Physician Initial assessment note at First encounter"
      },
      {
        "code": "11495-9",
        "display": "Deprecated Physical therapy Initial assessment note at First encounter"
      },
      {
        "code": "11496-7",
        "display": "Deprecated Podiatry Initial assessment note at First encounter"
      },
      {
        "code": "11497-5",
        "display": "Deprecated Psychology Initial assessment note at First encounter"
      },
      {
        "code": "11498-3",
        "display": "Deprecated Social work Initial assessment note at First encounter"
      },
      {
        "code": "11499-1",
        "display": "Deprecated Speech therapy Initial assessment note at First encounter"
      },
      {
        "code": "11500-6",
        "display": "Deprecated Occupational therapy Initial assessment note at First encounter"
      },
      {
        "code": "11502-2",
        "display": "Laboratory report"
      },
      {
        "code": "11503-0",
        "display": "Medical records"
      },
      {
        "code": "11504-8",
        "display": "Surgical operation note"
      },
      {
        "code": "11505-5",
        "display": "Physician procedure note"
      },
      {
        "code": "11506-3",
        "display": "Progress note"
      },
      {
        "code": "11507-1",
        "display": "Occupational therapy Progress note"
      },
      {
        "code": "11508-9",
        "display": "Physical therapy Progress note"
      },
      {
        "code": "11509-7",
        "display": "Podiatry Progress note"
      },
      {
        "code": "11510-5",
        "display": "Psychology Progress note"
      },
      {
        "code": "11512-1",
        "display": "Speech-language pathology Progress note"
      },
      {
        "code": "11514-7",
        "display": "Chiropractic Episode of care medical records"
      },
      {
        "code": "11515-4",
        "display": "Physical therapy Episode of care medical records"
      },
      {
        "code": "11516-2",
        "display": "Physician Episode of care medical records"
      },
      {
        "code": "11517-0",
        "display": "Podiatry Episode of care medical records"
      },
      {
        "code": "11518-8",
        "display": "Psychology Episode of care medical records"
      },
      {
        "code": "11519-6",
        "display": "Social service Episode of care medical records"
      },
      {
        "code": "11520-4",
        "display": "Speech therapy Episode of care medical records"
      },
      {
        "code": "11521-2",
        "display": "Occupational therapy Episode of care medical records"
      },
      {
        "code": "11522-0",
        "display": "Deprecated Cardiac echo study"
      },
      {
        "code": "11523-8",
        "display": "EEG study report"
      },
      {
        "code": "11524-6",
        "display": "EKG study"
      },
      {
        "code": "11525-3",
        "display": "US for pregnancy"
      },
      {
        "code": "11526-1",
        "display": "Pathology study"
      },
      {
        "code": "11527-9",
        "display": "Psychiatry study"
      },
      {
        "code": "11528-7",
        "display": "Deprecated Radiology Unspecified site and modality Study"
      },
      {
        "code": "11529-5",
        "display": "Surgical pathology study"
      },
      {
        "code": "11534-5",
        "display": "Temperature charts"
      },
      {
        "code": "11536-0",
        "display": "Deprecated Nurse Notes"
      },
      {
        "code": "11538-6",
        "display": "Deprecated CT Chest study"
      },
      {
        "code": "11539-4",
        "display": "Deprecated CT Head study"
      },
      {
        "code": "11540-2",
        "display": "Deprecated CT Abdomen study"
      },
      {
        "code": "11541-0",
        "display": "Deprecated MRI Brain study"
      },
      {
        "code": "11542-8",
        "display": "Deprecated Provider-unspecified visit note"
      },
      {
        "code": "11543-6",
        "display": "Nursery records"
      },
      {
        "code": "15507-7",
        "display": "Emergency department Progress note"
      },
      {
        "code": "15508-5",
        "display": "Labor and delivery records"
      },
      {
        "code": "17787-3",
        "display": "Deprecated NM Thyroid gland Study report"
      },
      {
        "code": "18594-2",
        "display": "Psychiatric service attachment"
      },
      {
        "code": "18682-5",
        "display": "Ambulance records"
      },
      {
        "code": "18733-6",
        "display": "Attending Progress note"
      },
      {
        "code": "18734-4",
        "display": "Occupational therapy Initial evaluation note"
      },
      {
        "code": "18735-1",
        "display": "Physical therapy Initial evaluation note"
      },
      {
        "code": "18736-9",
        "display": "Physician Initial evaluation note"
      },
      {
        "code": "18737-7",
        "display": "Podiatry Initial evaluation note"
      },
      {
        "code": "18738-5",
        "display": "Psychology Initial evaluation note"
      },
      {
        "code": "18739-3",
        "display": "Social worker Initial evaluation note"
      },
      {
        "code": "18740-1",
        "display": "Speech-language pathology Initial evaluation note"
      },
      {
        "code": "18741-9",
        "display": "Deprecated Attending physician progress note"
      },
      {
        "code": "18742-7",
        "display": "Arthroscopy study"
      },
      {
        "code": "18743-5",
        "display": "Autopsy report"
      },
      {
        "code": "18744-3",
        "display": "Bronchoscopy study"
      },
      {
        "code": "18745-0",
        "display": "Cardiac catheterization study"
      },
      {
        "code": "18746-8",
        "display": "Colonoscopy study"
      },
      {
        "code": "18747-6",
        "display": "Deprecated CT Unspecified system Study"
      },
      {
        "code": "18748-4",
        "display": "Diagnostic imaging study"
      },
      {
        "code": "18749-2",
        "display": "Electromyogram study"
      },
      {
        "code": "18750-0",
        "display": "Electrophysiology study"
      },
      {
        "code": "18751-8",
        "display": "Endoscopy study"
      },
      {
        "code": "18752-6",
        "display": "Exercise stress test study"
      },
      {
        "code": "18753-4",
        "display": "Flexible sigmoidoscopy study"
      },
      {
        "code": "18754-2",
        "display": "Holter monitor study"
      },
      {
        "code": "18755-9",
        "display": "Deprecated MRI Unspecified site study"
      },
      {
        "code": "18756-7",
        "display": "MR Spine study"
      },
      {
        "code": "18757-5",
        "display": "Deprecated Nuclear medicine study"
      },
      {
        "code": "18758-3",
        "display": "Deprecated PET scan Unspecified system Study"
      },
      {
        "code": "18759-1",
        "display": "Spirometry study"
      },
      {
        "code": "18760-9",
        "display": "Deprecated US Unspecified system Study"
      },
      {
        "code": "18761-7",
        "display": "Transfer summary note"
      },
      {
        "code": "18762-5",
        "display": "Deprecated Chiropractor Progress note"
      },
      {
        "code": "18763-3",
        "display": "Consultant Initial evaluation note"
      },
      {
        "code": "18764-1",
        "display": "Deprecated Nurse practitioner Progress note"
      },
      {
        "code": "18765-8",
        "display": "Deprecated Podiatry visit note"
      },
      {
        "code": "18766-6",
        "display": "Deprecated Psychology visit note"
      },
      {
        "code": "18776-5",
        "display": "Plan of care note"
      },
      {
        "code": "18823-5",
        "display": "Alcohol and/or substance abuse service attachment"
      },
      {
        "code": "18824-3",
        "display": "Cardiac service attachment"
      },
      {
        "code": "18825-0",
        "display": "Medical social services attachment"
      },
      {
        "code": "18826-8",
        "display": "Occupational therapy service attachment"
      },
      {
        "code": "18836-7",
        "display": "Cardiac stress study Procedure"
      },
      {
        "code": "18841-7",
        "display": "Hospital consultations Document"
      },
      {
        "code": "18842-5",
        "display": "Discharge summary"
      },
      {
        "code": "19002-5",
        "display": "Physical therapy service attachment"
      },
      {
        "code": "19003-3",
        "display": "Respiratory therapy service attachment"
      },
      {
        "code": "19004-1",
        "display": "Deprecated Skilled nursing service attachment"
      },
      {
        "code": "24531-6",
        "display": "US Retroperitoneum"
      },
      {
        "code": "24532-4",
        "display": "US Abdomen RUQ"
      },
      {
        "code": "24533-2",
        "display": "MRA Abdominal vessels W contrast IV"
      },
      {
        "code": "24534-0",
        "display": "US.doppler Abdominal vessels"
      },
      {
        "code": "24535-7",
        "display": "XR Acetabulum Views"
      },
      {
        "code": "24536-5",
        "display": "XR Acromioclavicular Joint Views"
      },
      {
        "code": "24537-3",
        "display": "US Guidance for aspiration of amniotic fluid of Uterus"
      },
      {
        "code": "24538-1",
        "display": "MR Ankle"
      },
      {
        "code": "24539-9",
        "display": "MR Ankle WO and W contrast IV"
      },
      {
        "code": "24540-7",
        "display": "XR Ankle 2 Views"
      },
      {
        "code": "24541-5",
        "display": "XR Ankle Views"
      },
      {
        "code": "24542-3",
        "display": "US Anus"
      },
      {
        "code": "24543-1",
        "display": "RFA Guidance for angioplasty of Thoracic and abdominal aorta-- W contrast IA"
      },
      {
        "code": "24544-9",
        "display": "CT Thoracic Aorta"
      },
      {
        "code": "24545-6",
        "display": "CT Thoracic Aorta W contrast IV"
      },
      {
        "code": "24546-4",
        "display": "Deprecated RFA Aortic arch W contrast IA"
      },
      {
        "code": "24547-2",
        "display": "US Thoracic and abdominal aorta"
      },
      {
        "code": "24548-0",
        "display": "US Appendix"
      },
      {
        "code": "24549-8",
        "display": "MRA Upper extremity vessels W contrast IV"
      },
      {
        "code": "24550-6",
        "display": "RFA Upper extremity veins Views W contrast IV"
      },
      {
        "code": "24551-4",
        "display": "RFA AV fistula Views W contrast IA"
      },
      {
        "code": "24552-2",
        "display": "RF Stent Views W contrast intra stent"
      },
      {
        "code": "24553-0",
        "display": "RFA Guidance for embolectomy of Intracranial vessel-- W contrast IV"
      },
      {
        "code": "24554-8",
        "display": "RFA Guidance for embolization of Artery-- W contrast IA"
      },
      {
        "code": "24555-5",
        "display": "RFA Guidance for placement of stent in Artery"
      },
      {
        "code": "24556-3",
        "display": "MR Abdomen"
      },
      {
        "code": "24557-1",
        "display": "MR Abdomen WO and W contrast IV"
      },
      {
        "code": "24558-9",
        "display": "US Abdomen"
      },
      {
        "code": "24559-7",
        "display": "US Guidance for drainage and placement of drainage catheter of Abdomen"
      },
      {
        "code": "24560-5",
        "display": "Portable XR Abdomen AP left lateral-decubitus"
      },
      {
        "code": "24561-3",
        "display": "XR Abdomen AP left lateral-decubitus"
      },
      {
        "code": "24562-1",
        "display": "XR Abdomen Left lateral-decubitus and Right lateral-decubitus"
      },
      {
        "code": "24563-9",
        "display": "XR Abdomen AP right lateral-decubitus"
      },
      {
        "code": "24564-7",
        "display": "Portable XR Abdomen AP upright"
      },
      {
        "code": "24566-2",
        "display": "CT Retroperitoneum"
      },
      {
        "code": "24567-0",
        "display": "Deprecated Abdomen>Retroperitoneum CT W contrast"
      },
      {
        "code": "24568-8",
        "display": "RFA Guidance for atherectomy of AV fistula-- W contrast IV"
      },
      {
        "code": "24569-6",
        "display": "RFA AV shunt Views W contrast IV"
      },
      {
        "code": "24570-4",
        "display": "RF Guidance for removal of calculus from Biliary duct common-- W contrast retrograde intra biliary"
      },
      {
        "code": "24571-2",
        "display": "NM Biliary ducts and Gallbladder Views for patency of biliary structures and ejection fraction W sincalide and W radionuclide IV"
      },
      {
        "code": "24572-0",
        "display": "NM Biliary ducts and Gallbladder Views for patency of biliary structures W Tc-99m IV"
      },
      {
        "code": "24573-8",
        "display": "XR Biliary ducts and Gallbladder Views W contrast IV"
      },
      {
        "code": "24574-6",
        "display": "RF Biliary ducts and Gallbladder Views during surgery W contrast biliary duct"
      },
      {
        "code": "24575-3",
        "display": "RF Biliary ducts and Gallbladder Views W contrast percutaneous transhepatic"
      },
      {
        "code": "24576-1",
        "display": "RFA Urinary bladder arteries Views W contrast IA"
      },
      {
        "code": "24577-9",
        "display": "XR Bone Views during surgery"
      },
      {
        "code": "24578-7",
        "display": "SPECT Bones"
      },
      {
        "code": "24579-5",
        "display": "XR Long bones Survey Views"
      },
      {
        "code": "24580-3",
        "display": "RFA Guidance for angioplasty of Brachiocephalic artery-- W contrast IA"
      },
      {
        "code": "24581-1",
        "display": "RFA Subclavian artery and Brachial artery Views W contrast IA"
      },
      {
        "code": "24582-9",
        "display": "MR Brachial plexus"
      },
      {
        "code": "24583-7",
        "display": "MR Brachial plexus WO and W contrast IV"
      },
      {
        "code": "24584-5",
        "display": "MRA Thoracic inlet vessels W contrast IV"
      },
      {
        "code": "24585-2",
        "display": "CT Guidance for stereotactic biopsy of Head-- W contrast IV"
      },
      {
        "code": "24586-0",
        "display": "MR Brain W anesthesia"
      },
      {
        "code": "24587-8",
        "display": "MR Brain WO and W contrast IV"
      },
      {
        "code": "24588-6",
        "display": "MR Brain WO and W contrast IV and W anesthesia"
      },
      {
        "code": "24589-4",
        "display": "MR Brain W contrast IV"
      },
      {
        "code": "24590-2",
        "display": "MR Brain"
      },
      {
        "code": "24591-0",
        "display": "NM Brain Brain death protocol Views W Tc-99m HMPAO IV"
      },
      {
        "code": "24593-6",
        "display": "MRA Head vessels W contrast IV"
      },
      {
        "code": "24594-4",
        "display": "MG Guidance for aspiration of cyst of Breast"
      },
      {
        "code": "24595-1",
        "display": "MG Guidance for needle localization of mass of Breast"
      },
      {
        "code": "24596-9",
        "display": "US Breast specimen"
      },
      {
        "code": "24597-7",
        "display": "MG Breast specimen Views"
      },
      {
        "code": "24598-5",
        "display": "MG Guidance for fluid aspiration of Breast"
      },
      {
        "code": "24599-3",
        "display": "US Breast limited"
      },
      {
        "code": "24600-9",
        "display": "US Guidance for needle localization of Breast"
      },
      {
        "code": "24601-7",
        "display": "US Breast"
      },
      {
        "code": "24602-5",
        "display": "MG Guidance for biopsy of Breast"
      },
      {
        "code": "24603-3",
        "display": "MG stereo Guidance for biopsy of Breast"
      },
      {
        "code": "24604-1",
        "display": "MG Breast Diagnostic Limited Views"
      },
      {
        "code": "24605-8",
        "display": "MG Breast Diagnostic"
      },
      {
        "code": "24606-6",
        "display": "MG Breast Screening"
      },
      {
        "code": "24609-0",
        "display": "MG Guidance for percutaneous biopsy.core needle of Breast"
      },
      {
        "code": "24610-8",
        "display": "MG Breast Limited Views"
      },
      {
        "code": "24611-6",
        "display": "Outpatient Consultation 2nd opinion"
      },
      {
        "code": "24612-4",
        "display": "XR Calcaneus Views"
      },
      {
        "code": "24613-2",
        "display": "Deprecated RFA Guidance for placement of catheter in artery in Central cardiovascular artery"
      },
      {
        "code": "24614-0",
        "display": "RFA Guidance for angioplasty of Carotid artery extracranial-- W contrast IA"
      },
      {
        "code": "24615-7",
        "display": "RFA Guidance for angioplasty of Carotid artery.intracranial-- W contrast IA"
      },
      {
        "code": "24616-5",
        "display": "US Carotid arteries"
      },
      {
        "code": "24617-3",
        "display": "RFA Carotid arteries Views W contrast IA"
      },
      {
        "code": "24619-9",
        "display": "XR Wrist Views"
      },
      {
        "code": "24620-7",
        "display": "RF Catheter Views for patency check W contrast via catheter"
      },
      {
        "code": "24621-5",
        "display": "RF Guidance for percutaneous drainage and placement of drainage catheter of Unspecified body region"
      },
      {
        "code": "24622-3",
        "display": "RFA Celiac artery Views W contrast IA"
      },
      {
        "code": "24623-1",
        "display": "CT Guidance for nerve block of Celiac plexus"
      },
      {
        "code": "24624-9",
        "display": "RFA Guidance for change of CV catheter in Vein-- W contrast IV"
      },
      {
        "code": "24625-6",
        "display": "RFA Guidance for placement of CV catheter in Vein-- W contrast IV"
      },
      {
        "code": "24626-4",
        "display": "RFA Guidance for reposition of CV catheter in Vein-- W contrast IV"
      },
      {
        "code": "24627-2",
        "display": "CT Chest"
      },
      {
        "code": "24628-0",
        "display": "CT Chest W contrast IV"
      },
      {
        "code": "24629-8",
        "display": "MR Chest"
      },
      {
        "code": "24630-6",
        "display": "US Chest"
      },
      {
        "code": "24631-4",
        "display": "RF Unspecified body region Views for central venous catheter placement check"
      },
      {
        "code": "24632-2",
        "display": "Portable XR Chest Views AP"
      },
      {
        "code": "24634-8",
        "display": "Portable XR Chest Views W inspiration and expiration"
      },
      {
        "code": "24635-5",
        "display": "XR Chest PA upright Views W inspiration and expiration"
      },
      {
        "code": "24636-3",
        "display": "Portable XR Chest AP left lateral-decubitus"
      },
      {
        "code": "24637-1",
        "display": "XR Chest AP left lateral-decubitus"
      },
      {
        "code": "24638-9",
        "display": "Portable XR Chest Left lateral upright"
      },
      {
        "code": "24639-7",
        "display": "XR Chest Left lateral upright"
      },
      {
        "code": "24640-5",
        "display": "XR Chest Apical lordotic"
      },
      {
        "code": "24641-3",
        "display": "Portable XR Chest Left oblique"
      },
      {
        "code": "24642-1",
        "display": "XR Chest AP and PA upright"
      },
      {
        "code": "24643-9",
        "display": "XR Chest PA and Lateral and Oblique upright"
      },
      {
        "code": "24644-7",
        "display": "Portable XR Chest PA and Lateral upright"
      },
      {
        "code": "24645-4",
        "display": "Portable XR Chest PA and Right lateral and Right oblique and Left oblique upright"
      },
      {
        "code": "24646-2",
        "display": "XR Chest PA and Right lateral and Right oblique and Left oblique upright"
      },
      {
        "code": "24647-0",
        "display": "XR Chest PA and Lateral upright"
      },
      {
        "code": "24648-8",
        "display": "XR Chest PA upright"
      },
      {
        "code": "24649-6",
        "display": "Portable XR Chest Right lateral-decubitus and Left lateral-decubitus"
      },
      {
        "code": "24650-4",
        "display": "XR Chest Right lateral-decubitus and Left lateral-decubitus"
      },
      {
        "code": "24651-2",
        "display": "XR Chest Right oblique and Left oblique upright"
      },
      {
        "code": "24652-0",
        "display": "Portable XR Chest AP right lateral-decubitus"
      },
      {
        "code": "24653-8",
        "display": "XR Chest AP and AP right lateral-decubitus"
      },
      {
        "code": "24654-6",
        "display": "Portable XR Chest AP and AP right lateral-decubitus"
      },
      {
        "code": "24655-3",
        "display": "RF Chest Image intensifier during surgery"
      },
      {
        "code": "24656-1",
        "display": "RF Chest Single view during surgery"
      },
      {
        "code": "24657-9",
        "display": "XR tomography Chest"
      },
      {
        "code": "24658-7",
        "display": "RFA Thoracic and abdominal aorta Views W contrast IA"
      },
      {
        "code": "24659-5",
        "display": "MRA Chest vessels W contrast IV"
      },
      {
        "code": "24660-3",
        "display": "MRA Thoracic Aorta"
      },
      {
        "code": "24661-1",
        "display": "RF Pleural space Views W contrast intra pleural space"
      },
      {
        "code": "24662-9",
        "display": "US Guidance for fluid aspiration of Pleural space"
      },
      {
        "code": "24663-7",
        "display": "NM Cerebral cisterns Views W radionuclide IT"
      },
      {
        "code": "24664-5",
        "display": "XR Clavicle Views"
      },
      {
        "code": "24665-2",
        "display": "XR Sacrum and Coccyx Views"
      },
      {
        "code": "24666-0",
        "display": "RF Colon Views W air and barium contrast PR"
      },
      {
        "code": "24667-8",
        "display": "RF Colon Views W contrast PR"
      },
      {
        "code": "24668-6",
        "display": "RF Colon Single view for transit Post solid contrast"
      },
      {
        "code": "24669-4",
        "display": "RF Colon Views W water soluble contrast PR"
      },
      {
        "code": "24670-2",
        "display": "US Guidance for biopsy of cyst of Unspecified body region"
      },
      {
        "code": "24671-0",
        "display": "RF Guidance for aspiration of cyst of Unspecified body region"
      },
      {
        "code": "24672-8",
        "display": "US Diaphragm for motion"
      },
      {
        "code": "24673-6",
        "display": "Deprecated Duodenum Radio fluoroscopy W contrast PO and hypotonic agent per ng"
      },
      {
        "code": "24674-4",
        "display": "MR Elbow"
      },
      {
        "code": "24675-1",
        "display": "MR Elbow WO and W contrast IV"
      },
      {
        "code": "24676-9",
        "display": "XR Elbow Views"
      },
      {
        "code": "24677-7",
        "display": "US Pelvis transvaginal"
      },
      {
        "code": "24678-5",
        "display": "RF Esophagus Views W contrast PO"
      },
      {
        "code": "24679-3",
        "display": "RF Esophagus Views W Gastrografin PO"
      },
      {
        "code": "24680-1",
        "display": "RF Guidance for dilation of Esophagus"
      },
      {
        "code": "24681-9",
        "display": "RF videography Hypopharynx and Esophagus Views"
      },
      {
        "code": "24682-7",
        "display": "RF videography Hypopharynx and Esophagus Views W liquid and paste contrast PO during swallowing"
      },
      {
        "code": "24683-5",
        "display": "NM Esophagus+Stomach Views W Tc-99m SC PO"
      },
      {
        "code": "24684-3",
        "display": "RFA Guidance for embolectomy of Extracranial vessels-- W contrast IA"
      },
      {
        "code": "24685-0",
        "display": "RFA Peripheral veins Views W contrast IV"
      },
      {
        "code": "24686-8",
        "display": "XR Lower extremity Views"
      },
      {
        "code": "24687-6",
        "display": "MR Lower Extremity Joint"
      },
      {
        "code": "24688-4",
        "display": "MR Upper extremity"
      },
      {
        "code": "24689-2",
        "display": "XR Upper extremity Views"
      },
      {
        "code": "24690-0",
        "display": "CT Extremity"
      },
      {
        "code": "24691-8",
        "display": "CT Extremity W contrast IV"
      },
      {
        "code": "24692-6",
        "display": "US Guidance for drainage and placement of drainage catheter of Extremity"
      },
      {
        "code": "24693-4",
        "display": "US Extremity"
      },
      {
        "code": "24694-2",
        "display": "MR Face WO and W contrast IV"
      },
      {
        "code": "24695-9",
        "display": "XR Facial bones Views"
      },
      {
        "code": "24696-7",
        "display": "CT Facial bones"
      },
      {
        "code": "24697-5",
        "display": "CT Facial bones W contrast IV"
      },
      {
        "code": "24698-3",
        "display": "RFA Guidance for angioplasty of Femoral artery-- W contrast IA"
      },
      {
        "code": "24699-1",
        "display": "RFA Femoral artery Runoff W contrast IA"
      },
      {
        "code": "24700-7",
        "display": "XR Femur and Tibia Views for leg length"
      },
      {
        "code": "24702-3",
        "display": "MR Thigh"
      },
      {
        "code": "24703-1",
        "display": "MR Thigh WO and W contrast IV"
      },
      {
        "code": "24704-9",
        "display": "XR Femur Views"
      },
      {
        "code": "24705-6",
        "display": "MR Finger"
      },
      {
        "code": "24706-4",
        "display": "XR Finger Views"
      },
      {
        "code": "24707-2",
        "display": "MR Foot"
      },
      {
        "code": "24708-0",
        "display": "XR Foot Views W standing"
      },
      {
        "code": "24709-8",
        "display": "XR Foot Views"
      },
      {
        "code": "24710-6",
        "display": "MR Forearm"
      },
      {
        "code": "24711-4",
        "display": "US Gallbladder"
      },
      {
        "code": "24712-2",
        "display": "XR Gallbladder Views W contrast PO"
      },
      {
        "code": "24713-0",
        "display": "XR Gallbladder Views 48H post contrast PO"
      },
      {
        "code": "24714-8",
        "display": "NM Gastrointestinal tract Views for gastrointestinal bleeding W Tc-99m tagged RBC IV"
      },
      {
        "code": "24715-5",
        "display": "RF Gastrointestinal tract upper Single view W contrast PO"
      },
      {
        "code": "24716-3",
        "display": "RF Guidance for placement of decompression tube in Gastrointestinal tract"
      },
      {
        "code": "24717-1",
        "display": "Deprecated XR Ileal conduit Loopogram"
      },
      {
        "code": "24718-9",
        "display": "RF Guidance for transjugular biopsy of Liver-- W contrast IV"
      },
      {
        "code": "24719-7",
        "display": "US Groin"
      },
      {
        "code": "24720-5",
        "display": "MR Hand"
      },
      {
        "code": "24721-3",
        "display": "XR Hand 2 Views"
      },
      {
        "code": "24722-1",
        "display": "XR Hand 3 Views"
      },
      {
        "code": "24723-9",
        "display": "XR Hand Arthritis"
      },
      {
        "code": "24724-7",
        "display": "XR Wrist and Hand Bone age Views"
      },
      {
        "code": "24725-4",
        "display": "CT Head"
      },
      {
        "code": "24726-2",
        "display": "CT Head WO and W contrast IV"
      },
      {
        "code": "24727-0",
        "display": "CT Head W contrast IV"
      },
      {
        "code": "24728-8",
        "display": "CT perfusion Head"
      },
      {
        "code": "24729-6",
        "display": "CT perfusion Head WO and W contrast IV"
      },
      {
        "code": "24730-4",
        "display": "NM Brain Views"
      },
      {
        "code": "24731-2",
        "display": "US Head"
      },
      {
        "code": "24732-0",
        "display": "US Head during surgery"
      },
      {
        "code": "24733-8",
        "display": "US.doppler Head vessels"
      },
      {
        "code": "24734-6",
        "display": "CT Cerebral cisterns W contrast IT"
      },
      {
        "code": "24735-3",
        "display": "MR Internal auditory canal and Posterior fossa"
      },
      {
        "code": "24740-3",
        "display": "MR Internal auditory canal and Posterior fossa WO and W contrast IV"
      },
      {
        "code": "24745-2",
        "display": "XR Petrous part of temporal bone Views"
      },
      {
        "code": "24746-0",
        "display": "Deprecated Head Sagittal Sinus MR"
      },
      {
        "code": "24747-8",
        "display": "Deprecated Head Sagittal Sinus MR angiogram W contrast IV"
      },
      {
        "code": "24748-6",
        "display": "MR Heart"
      },
      {
        "code": "24750-2",
        "display": "NM Heart Views at rest and W Tl-201 IV"
      },
      {
        "code": "24751-0",
        "display": "NM Parathyroid gland Views W TI-201 subtraction Tc-99m IV"
      },
      {
        "code": "24752-8",
        "display": "RF videography Heart Views"
      },
      {
        "code": "24753-6",
        "display": "CT Unspecified body region W contrast IV"
      },
      {
        "code": "24754-4",
        "display": "Administration of vasodilator into catheter Vein"
      },
      {
        "code": "24755-1",
        "display": "RFA Guidance for atherectomy of Vein-- W contrast IV"
      },
      {
        "code": "24756-9",
        "display": "RFA Guidance for placement of stent in Vein"
      },
      {
        "code": "24757-7",
        "display": "Deprecated Coronary arteries CT fast"
      },
      {
        "code": "24760-1",
        "display": "US Hip"
      },
      {
        "code": "24761-9",
        "display": "XR Hip Single view"
      },
      {
        "code": "24762-7",
        "display": "XR Hip Views"
      },
      {
        "code": "24764-3",
        "display": "RF Hip Arthrogram"
      },
      {
        "code": "24765-0",
        "display": "XR Humerus 2 Views"
      },
      {
        "code": "24766-8",
        "display": "RFA Guidance for angioplasty of Iliac artery-- W contrast IA"
      },
      {
        "code": "24767-6",
        "display": "XR tomography Internal auditory canal"
      },
      {
        "code": "24769-2",
        "display": "CT Guidance for injection of Joint space"
      },
      {
        "code": "24770-0",
        "display": "NM Joint Views W In-111 Intrajoint"
      },
      {
        "code": "24771-8",
        "display": "RF Guidance for arthrocentesis of Joint space"
      },
      {
        "code": "24772-6",
        "display": "US Guidance for biopsy of Kidney"
      },
      {
        "code": "24773-4",
        "display": "NM Kidney Views W radionuclide transplant scan"
      },
      {
        "code": "24776-7",
        "display": "NM Kidney Views"
      },
      {
        "code": "24778-3",
        "display": "XR Kidney - bilateral 3 Serial Views WO and W contrast IV"
      },
      {
        "code": "24779-1",
        "display": "RF Guidance for percutaneous placement of nephrostomy tube of Kidney - bilateral-- W contrast via tube"
      },
      {
        "code": "24780-9",
        "display": "RF Kidney - bilateral Views W contrast via nephrostomy tube"
      },
      {
        "code": "24781-7",
        "display": "RF Guidance for exchange of nephrostomy tube of Kidney - bilateral-- W contrast"
      },
      {
        "code": "24782-5",
        "display": "RF Guidance for percutaneous placement of nephroureteral stent of Kidney - bilateral-- W contrast via stent"
      },
      {
        "code": "24783-3",
        "display": "RF Kidney - bilateral Views for urodynamics"
      },
      {
        "code": "24784-1",
        "display": "XR tomography Kidney - bilateral WO and W contrast IV"
      },
      {
        "code": "24787-4",
        "display": "XR tomography Kidney - bilateral WO contrast and 10M post contrast IV"
      },
      {
        "code": "24788-2",
        "display": "XR Kidney - bilateral Views W contrast IV"
      },
      {
        "code": "24789-0",
        "display": "XR tomography Kidney - bilateral"
      },
      {
        "code": "24790-8",
        "display": "XR tomography Kidney - bilateral W contrast IV"
      },
      {
        "code": "24792-4",
        "display": "Portable XR Abdomen AP and AP left lateral-decubitus"
      },
      {
        "code": "24793-2",
        "display": "Portable XR Abdomen AP and Lateral"
      },
      {
        "code": "24794-0",
        "display": "XR Abdomen AP and Lateral"
      },
      {
        "code": "24795-7",
        "display": "Portable XR Abdomen Supine and Upright"
      },
      {
        "code": "24796-5",
        "display": "XR Abdomen AP and AP left lateral-decubitus"
      },
      {
        "code": "24797-3",
        "display": "XR Abdomen AP and Oblique prone"
      },
      {
        "code": "24798-1",
        "display": "XR Abdomen Supine and Upright"
      },
      {
        "code": "24799-9",
        "display": "XR Abdomen AP"
      },
      {
        "code": "24800-5",
        "display": "RF Knee Arthrogram"
      },
      {
        "code": "24801-3",
        "display": "XR Knee Merchants"
      },
      {
        "code": "24802-1",
        "display": "MR Knee"
      },
      {
        "code": "24803-9",
        "display": "MR Knee WO and W contrast IV"
      },
      {
        "code": "24804-7",
        "display": "NM Knee Views"
      },
      {
        "code": "24805-4",
        "display": "XR Knee AP and Lateral W standing"
      },
      {
        "code": "24806-2",
        "display": "XR Knee 2 Views"
      },
      {
        "code": "24807-0",
        "display": "XR Knee AP W standing"
      },
      {
        "code": "24808-8",
        "display": "XR Knee AP and PA W standing"
      },
      {
        "code": "24809-6",
        "display": "XR Knee Views W standing"
      },
      {
        "code": "24811-2",
        "display": "CT Guidance for fluid aspiration of Liver"
      },
      {
        "code": "24812-0",
        "display": "CT Guidance for biopsy of Liver"
      },
      {
        "code": "24813-8",
        "display": "CT Guidance for core needle biopsy of Liver"
      },
      {
        "code": "24814-6",
        "display": "CT Liver"
      },
      {
        "code": "24815-3",
        "display": "CT Liver W contrast IV"
      },
      {
        "code": "24816-1",
        "display": "US Guidance for biopsy of Liver"
      },
      {
        "code": "24817-9",
        "display": "SPECT Liver W Tc-99m IV"
      },
      {
        "code": "24818-7",
        "display": "US Diaphragm and Liver"
      },
      {
        "code": "24819-5",
        "display": "Deprecated Liver and Spleen NM W Tc-99m calcium colloid IV"
      },
      {
        "code": "24820-3",
        "display": "MRA Lower leg vessels W contrast IV"
      },
      {
        "code": "24821-1",
        "display": "MR Lower leg"
      },
      {
        "code": "24822-9",
        "display": "CT Guidance for fluid aspiration of Lung"
      },
      {
        "code": "24823-7",
        "display": "CT Guidance for biopsy of Lung"
      },
      {
        "code": "24824-5",
        "display": "NM Lung Portable Views"
      },
      {
        "code": "24825-2",
        "display": "XR Lung Views W contrast intrabronchial"
      },
      {
        "code": "24826-0",
        "display": "NM Lymphatic vessels Views W radionuclide intra lymphatic"
      },
      {
        "code": "24827-8",
        "display": "RFA Lymphatic vessels Views W contrast intra lymphatic"
      },
      {
        "code": "24828-6",
        "display": "XR tomography Mandible Panoramic"
      },
      {
        "code": "24829-4",
        "display": "XR Mandible Views"
      },
      {
        "code": "24830-2",
        "display": "XR Mastoid Views"
      },
      {
        "code": "24831-0",
        "display": "NM Small bowel Views for Meckel's diverticulum W Tc-99m M04 IV"
      },
      {
        "code": "24832-8",
        "display": "RFA Guidance for angioplasty of Mesenteric artery-- W contrast IA"
      },
      {
        "code": "24833-6",
        "display": "RFA Mesenteric artery Views W contrast IA"
      },
      {
        "code": "24834-4",
        "display": "XR Nasal bones Views"
      },
      {
        "code": "24835-1",
        "display": "CT Nasopharynx and Neck"
      },
      {
        "code": "24836-9",
        "display": "CT Nasopharynx and Neck W contrast IV"
      },
      {
        "code": "24837-7",
        "display": "CT Guidance for fluid aspiration of Neck"
      },
      {
        "code": "24838-5",
        "display": "CT Guidance for biopsy of Neck"
      },
      {
        "code": "24839-3",
        "display": "MR Neck"
      },
      {
        "code": "24840-1",
        "display": "MR Neck WO and W contrast IV"
      },
      {
        "code": "24841-9",
        "display": "MR Neck W contrast IV"
      },
      {
        "code": "24842-7",
        "display": "US Neck"
      },
      {
        "code": "24843-5",
        "display": "XR Neck Lateral"
      },
      {
        "code": "24844-3",
        "display": "MRA Neck vessels W contrast IV"
      },
      {
        "code": "24845-0",
        "display": "RF Neck Views W contrast intra larynx"
      },
      {
        "code": "24846-8",
        "display": "XR Optic foramen Views"
      },
      {
        "code": "24848-4",
        "display": "CT Orbit - bilateral"
      },
      {
        "code": "24849-2",
        "display": "CT Orbit - bilateral WO and W contrast IV"
      },
      {
        "code": "24850-0",
        "display": "CT Orbit - bilateral W contrast IV"
      },
      {
        "code": "24851-8",
        "display": "MR Orbit - bilateral WO and W contrast IV"
      },
      {
        "code": "24852-6",
        "display": "MR Orbit - bilateral W contrast IV"
      },
      {
        "code": "24853-4",
        "display": "US Eye+Orbit - bilateral"
      },
      {
        "code": "24854-2",
        "display": "XR Orbit - bilateral Views"
      },
      {
        "code": "24855-9",
        "display": "RF videography Oropharynx Views"
      },
      {
        "code": "24856-7",
        "display": "CT Guidance for fluid aspiration of Pancreas"
      },
      {
        "code": "24857-5",
        "display": "CT Pancreas"
      },
      {
        "code": "24858-3",
        "display": "CT Pancreas W contrast IV"
      },
      {
        "code": "24859-1",
        "display": "US Pancreas"
      },
      {
        "code": "24860-9",
        "display": "RFA Pancreatic artery Views W contrast IA"
      },
      {
        "code": "24861-7",
        "display": "XR Patella 2 Views"
      },
      {
        "code": "24862-5",
        "display": "RFA Iliac artery Internal Views W contrast IA"
      },
      {
        "code": "24863-3",
        "display": "CT Guidance for fluid aspiration of Pelvis"
      },
      {
        "code": "24864-1",
        "display": "CT Guidance for biopsy of Pelvis"
      },
      {
        "code": "24865-8",
        "display": "CT Pelvis"
      },
      {
        "code": "24866-6",
        "display": "CT Pelvis W contrast IV"
      },
      {
        "code": "24867-4",
        "display": "MR Pelvis"
      },
      {
        "code": "24868-2",
        "display": "US Guidance for drainage and placement of drainage catheter of Pelvis"
      },
      {
        "code": "24869-0",
        "display": "US Pelvis"
      },
      {
        "code": "24870-8",
        "display": "US.doppler Pelvis vessels"
      },
      {
        "code": "24871-6",
        "display": "XR Pelvis Pelvimetry"
      },
      {
        "code": "24872-4",
        "display": "MR Pelvis and Hip"
      },
      {
        "code": "24873-2",
        "display": "MRA Pelvis vessels W contrast IV"
      },
      {
        "code": "24874-0",
        "display": "RFA Peripheral arteries Views W contrast IA"
      },
      {
        "code": "24875-7",
        "display": "Deprecated Peripheral vessel US.doppler Peripheral plane"
      },
      {
        "code": "24876-5",
        "display": "NM Head to Pelvis Views for shunt patency W Tc-99m DTPA IT"
      },
      {
        "code": "24877-3",
        "display": "CT Petrous part of temporal bone"
      },
      {
        "code": "24878-1",
        "display": "CT Petrous part of temporal bone W contrast IV"
      },
      {
        "code": "24879-9",
        "display": "MR Pituitary and Sella turcica WO and W contrast IV"
      },
      {
        "code": "24880-7",
        "display": "MR Pituitary and Sella turcica"
      },
      {
        "code": "24881-5",
        "display": "US Popliteal space"
      },
      {
        "code": "24882-3",
        "display": "RFA Guidance for percutaneous transluminal angioplasty of Popliteal artery-- W contrast IA"
      },
      {
        "code": "24883-1",
        "display": "US Guidance for percutaneous biopsy of Prostate"
      },
      {
        "code": "24884-9",
        "display": "US Prostate transrectal"
      },
      {
        "code": "24885-6",
        "display": "Deprecated US Guidance for repair of Pseudoaneurysm/AV fistula"
      },
      {
        "code": "24887-2",
        "display": "RFA Guidance for embolectomy of Pulmonary arteries-- W contrast IA"
      },
      {
        "code": "24888-0",
        "display": "NM Pulmonary system Ventilation and Perfusion W Xe-133 IH and W Tc-99m MAA IV"
      },
      {
        "code": "24889-8",
        "display": "US Pylorus for Pyloric Stenosis"
      },
      {
        "code": "24891-4",
        "display": "XR Radius and Ulna Views"
      },
      {
        "code": "24892-2",
        "display": "US Rectum"
      },
      {
        "code": "24893-0",
        "display": "RF Rectum Single view post contrast PR during defecation"
      },
      {
        "code": "24894-8",
        "display": "RF Rectum and Urinary bladder Views W contrast PR and intra bladder during defecation and voiding"
      },
      {
        "code": "24896-3",
        "display": "US Guidance for drainage and placement of drainage catheter of Kidney"
      },
      {
        "code": "24899-7",
        "display": "XR Ribs Views"
      },
      {
        "code": "24900-3",
        "display": "XR Sacroiliac Joint Views"
      },
      {
        "code": "24901-1",
        "display": "CT Guidance for injection of Sacroiliac Joint"
      },
      {
        "code": "24902-9",
        "display": "RF Salivary gland Views W contrast intra salivary duct"
      },
      {
        "code": "24903-7",
        "display": "XR Scapula Views"
      },
      {
        "code": "24904-5",
        "display": "CT Pituitary and Sella turcica WO and W contrast IV"
      },
      {
        "code": "24905-2",
        "display": "MR Shoulder"
      },
      {
        "code": "24906-0",
        "display": "MR Shoulder WO and W contrast IV"
      },
      {
        "code": "24907-8",
        "display": "US Shoulder"
      },
      {
        "code": "24908-6",
        "display": "XR Shoulder 3 Views"
      },
      {
        "code": "24909-4",
        "display": "XR Shoulder Views"
      },
      {
        "code": "24910-2",
        "display": "RF Shoulder Arthrogram"
      },
      {
        "code": "24911-0",
        "display": "RF Shunt Views"
      },
      {
        "code": "24912-8",
        "display": "RF Sinus tract Views W contrast intra sinus tract"
      },
      {
        "code": "24913-6",
        "display": "CT Sinuses limited"
      },
      {
        "code": "24914-4",
        "display": "MR Sinuses"
      },
      {
        "code": "24915-1",
        "display": "MR Sinuses W contrast IV"
      },
      {
        "code": "24916-9",
        "display": "XR Sinuses Views"
      },
      {
        "code": "24917-7",
        "display": "XR Skull Single view"
      },
      {
        "code": "24918-5",
        "display": "XR Skull 3 Views"
      },
      {
        "code": "24919-3",
        "display": "XR Skull AP and Lateral"
      },
      {
        "code": "24920-1",
        "display": "XR Skull Lateral"
      },
      {
        "code": "24921-9",
        "display": "XR Skull Waters"
      },
      {
        "code": "24922-7",
        "display": "XR Skull 5 Views"
      },
      {
        "code": "24923-5",
        "display": "RF Small bowel Views W positive contrast via enteroclysis tube"
      },
      {
        "code": "24924-3",
        "display": "RF Small bowel Views W contrast PO"
      },
      {
        "code": "24925-0",
        "display": "RFA Spinal artery Views W contrast IA"
      },
      {
        "code": "24926-8",
        "display": "US Spine"
      },
      {
        "code": "24927-6",
        "display": "RF Spine Views W contrast intradisc"
      },
      {
        "code": "24928-4",
        "display": "XR Spine AP and Lateral"
      },
      {
        "code": "24929-2",
        "display": "XR Thoracic and lumbar spine Views for scoliosis W flexion and W extension"
      },
      {
        "code": "24930-0",
        "display": "XR Thoracic and lumbar spine Views for scoliosis"
      },
      {
        "code": "24931-8",
        "display": "RF Guidance for injection of Spine facet joint"
      },
      {
        "code": "24932-6",
        "display": "CT Cervical spine"
      },
      {
        "code": "24933-4",
        "display": "CT Cervical spine W contrast IV"
      },
      {
        "code": "24934-2",
        "display": "CT Cervical spine W contrast IT"
      },
      {
        "code": "24935-9",
        "display": "MR Cervical spine"
      },
      {
        "code": "24936-7",
        "display": "MR Cervical spine W anesthesia"
      },
      {
        "code": "24937-5",
        "display": "MR Cervical spine WO and W contrast IV"
      },
      {
        "code": "24938-3",
        "display": "MR Cervical spine W contrast IV"
      },
      {
        "code": "24939-1",
        "display": "XR Cervical spine 5 Views"
      },
      {
        "code": "24940-9",
        "display": "XR Cervical spine Single view"
      },
      {
        "code": "24941-7",
        "display": "XR Cervical spine 3 Views"
      },
      {
        "code": "24942-5",
        "display": "XR Cervical spine AP and Lateral"
      },
      {
        "code": "24943-3",
        "display": "XR Cervical spine Lateral"
      },
      {
        "code": "24944-1",
        "display": "XR Cervical spine Swimmers"
      },
      {
        "code": "24945-8",
        "display": "XR Cervical spine Views W flexion and W extension"
      },
      {
        "code": "24946-6",
        "display": "XR Cervical spine Views"
      },
      {
        "code": "24947-4",
        "display": "RF Cervical spine Views W contrast IT"
      },
      {
        "code": "24948-2",
        "display": "XR Spine Cervical Odontoid and Cervical axis AP"
      },
      {
        "code": "24963-1",
        "display": "CT Lumbar spine"
      },
      {
        "code": "24964-9",
        "display": "CT Lumbar spine W contrast IV"
      },
      {
        "code": "24965-6",
        "display": "CT Lumbar spine W contrast IT"
      },
      {
        "code": "24967-2",
        "display": "MR Lumbar spine WO and W contrast IV"
      },
      {
        "code": "24968-0",
        "display": "MR Lumbar spine"
      },
      {
        "code": "24969-8",
        "display": "XR Lumbar spine Lateral"
      },
      {
        "code": "24970-6",
        "display": "XR Lumbar spine AP and Lateral"
      },
      {
        "code": "24971-4",
        "display": "XR Lumbar spine Views W flexion and W extension"
      },
      {
        "code": "24972-2",
        "display": "XR Lumbar spine Views"
      },
      {
        "code": "24973-0",
        "display": "RF Guidance for fluid aspiration of Lumbar spine space"
      },
      {
        "code": "24974-8",
        "display": "RF Lumbar spine Views W contrast IT"
      },
      {
        "code": "24975-5",
        "display": "XR Spine.lumbar and Sacroiliac joint - bilateral Views"
      },
      {
        "code": "24977-1",
        "display": "MR Lumbar spine W anesthesia"
      },
      {
        "code": "24978-9",
        "display": "CT Thoracic spine"
      },
      {
        "code": "24979-7",
        "display": "CT Thoracic spine W contrast IV"
      },
      {
        "code": "24980-5",
        "display": "MR Thoracic spine"
      },
      {
        "code": "24981-3",
        "display": "MR Thoracic spine WO and W contrast IV"
      },
      {
        "code": "24982-1",
        "display": "MR Thoracic spine W contrast IV"
      },
      {
        "code": "24983-9",
        "display": "XR Thoracic spine Views"
      },
      {
        "code": "24984-7",
        "display": "XR Thoracic and lumbar spine 2 Views"
      },
      {
        "code": "24985-4",
        "display": "RF Thoracic spine Views W contrast IT"
      },
      {
        "code": "24986-2",
        "display": "CT Guidance for biopsy of Spine"
      },
      {
        "code": "24987-0",
        "display": "CT Spine W contrast IV"
      },
      {
        "code": "24988-8",
        "display": "CT Spleen"
      },
      {
        "code": "24989-6",
        "display": "CT Spleen WO and W contrast IV"
      },
      {
        "code": "24990-4",
        "display": "US Spleen"
      },
      {
        "code": "24991-2",
        "display": "RFA Splenic vein and Portal vein Views W contrast IA"
      },
      {
        "code": "24992-0",
        "display": "RFA Splenic artery Views W contrast IA"
      },
      {
        "code": "24993-8",
        "display": "Deprecated X-ray"
      },
      {
        "code": "24994-6",
        "display": "XR Sternum Views"
      },
      {
        "code": "24995-3",
        "display": "RF Guidance for placement of tube in Stomach"
      },
      {
        "code": "24996-1",
        "display": "RF Guidance for percutaneous replacement of gastrostomy of Stomach"
      },
      {
        "code": "24997-9",
        "display": "NM Stomach Views for gastric emptying solid phase W Tc-99m SC PO"
      },
      {
        "code": "24998-7",
        "display": "RF Placement check of gastrostomy tube W contrast via GI tube"
      },
      {
        "code": "24999-5",
        "display": "MR Temporomandibular joint"
      },
      {
        "code": "25000-1",
        "display": "XR Temporomandibular joint Views"
      },
      {
        "code": "25001-9",
        "display": "NM Scrotum and testicle Views W Tc-99m pertechnetate IV"
      },
      {
        "code": "25002-7",
        "display": "US Scrotum and testicle"
      },
      {
        "code": "25003-5",
        "display": "MRA Thigh vessels W contrast IV"
      },
      {
        "code": "25005-0",
        "display": "RFA Three vessels Views W contrast"
      },
      {
        "code": "25006-8",
        "display": "XR Thumb Views"
      },
      {
        "code": "25007-6",
        "display": "NM Thyroid gland Views W I-131 IV"
      },
      {
        "code": "25008-4",
        "display": "NM Thyroid gland Views and Views uptake W I-131 IV"
      },
      {
        "code": "25009-2",
        "display": "US Guidance for biopsy of Thyroid gland"
      },
      {
        "code": "25010-0",
        "display": "US Thyroid gland"
      },
      {
        "code": "25011-8",
        "display": "XR Tibia and Fibula Views"
      },
      {
        "code": "25012-6",
        "display": "Deprecated RFA Guidance for angioplasty of Tibial artery-- W contrast IA"
      },
      {
        "code": "25013-4",
        "display": "XR Toes Views"
      },
      {
        "code": "25014-2",
        "display": "RFA Two vessels Views W contrast"
      },
      {
        "code": "25015-9",
        "display": "Replacement of percutaneous gastrojejunostomy Upper GI tract Document"
      },
      {
        "code": "25016-7",
        "display": "RF Urethra Views W contrast intra urethra"
      },
      {
        "code": "25017-5",
        "display": "RF Urinary bladder and Urethra Views W contrast intra bladder"
      },
      {
        "code": "25018-3",
        "display": "NM Urinary bladder Views"
      },
      {
        "code": "25019-1",
        "display": "US Urinary bladder"
      },
      {
        "code": "25020-9",
        "display": "RF Urinary bladder and Urethra Views W contrast retrograde via urethra"
      },
      {
        "code": "25022-5",
        "display": "RF Uterus and Fallopian tubes Views W contrast IU"
      },
      {
        "code": "25023-3",
        "display": "RFA Vein Views W contrast IV"
      },
      {
        "code": "25024-1",
        "display": "RFA Guidance for placement of peripherally-inserted central venous catheter in Vein"
      },
      {
        "code": "25025-8",
        "display": "RFA Vena cava Views W contrast IV"
      },
      {
        "code": "25026-6",
        "display": "RFA Guidance for placement of venous filter in Inferior vena cava-- W contrast IV"
      },
      {
        "code": "25027-4",
        "display": "Guidance for placement of large bore CV catheter in Vein"
      },
      {
        "code": "25028-2",
        "display": "RFA Guidance for placement of catheter for infusion of thrombolytic in Vessel-- W contrast intravascular"
      },
      {
        "code": "25029-0",
        "display": "RFA Guidance for placement of catheter for vasoconstrictor infusion in Vessels"
      },
      {
        "code": "25030-8",
        "display": "RFA Abdominal arteries Views W contrast IA"
      },
      {
        "code": "25031-6",
        "display": "NM Bone Views"
      },
      {
        "code": "25032-4",
        "display": "NM Bone Views W In-111 tagged WBC IV"
      },
      {
        "code": "25033-2",
        "display": "MR Wrist"
      },
      {
        "code": "25034-0",
        "display": "RF Wrist Arthrogram"
      },
      {
        "code": "25035-7",
        "display": "MR Wrist WO and W contrast IV"
      },
      {
        "code": "25036-5",
        "display": "US Wrist"
      },
      {
        "code": "25038-1",
        "display": "Courtesy consultation Document"
      },
      {
        "code": "25039-9",
        "display": "CT Unspecified body region limited"
      },
      {
        "code": "25040-7",
        "display": "Deprecated Unspecified body region CT 3D"
      },
      {
        "code": "25041-5",
        "display": "CT Guidance for aspiration or biopsy of Unspecified body region-- W contrast IV"
      },
      {
        "code": "25042-3",
        "display": "CT Guidance for aspiration or biopsy of Unspecified body region"
      },
      {
        "code": "25043-1",
        "display": "CT Guidance for fluid aspiration of Unspecified body region"
      },
      {
        "code": "25044-9",
        "display": "CT Guidance for biopsy of Unspecified body region"
      },
      {
        "code": "25045-6",
        "display": "CT Unspecified body region"
      },
      {
        "code": "25046-4",
        "display": "CT Unspecified body region W anesthesia"
      },
      {
        "code": "25047-2",
        "display": "CT Unspecified body region W conscious sedation"
      },
      {
        "code": "25050-6",
        "display": "Deprecated Unspecified body region CT 3D sagittal and coronal disarticulation"
      },
      {
        "code": "25051-4",
        "display": "Deprecated Unspecified body region CT Multisectional sagittal"
      },
      {
        "code": "25052-2",
        "display": "Deprecated Unspecified body region CT sagittal and coronal"
      },
      {
        "code": "25053-0",
        "display": "CT Guidance for radiosurgery of Unspecified body region"
      },
      {
        "code": "25054-8",
        "display": "CT Guidance for radiosurgery of Unspecified body region-- W contrast IV"
      },
      {
        "code": "25055-5",
        "display": "Deprecated Unspecified body region MR additional sequence"
      },
      {
        "code": "25056-3",
        "display": "MR Unspecified body region"
      },
      {
        "code": "25057-1",
        "display": "MR Unspecified body region W conscious sedation"
      },
      {
        "code": "25058-9",
        "display": "MRA Unspecified body region W contrast IV"
      },
      {
        "code": "25059-7",
        "display": "US Guidance for biopsy of Unspecified body region"
      },
      {
        "code": "25060-5",
        "display": "US Unspecified body region No charge"
      },
      {
        "code": "25061-3",
        "display": "US Unspecified body region"
      },
      {
        "code": "25062-1",
        "display": "XR Unspecified body region Comparison view"
      },
      {
        "code": "25063-9",
        "display": "RFA Vessel Single view W contrast IA"
      },
      {
        "code": "25064-7",
        "display": "RFA Vessel Views for angioplasty W contrast IA"
      },
      {
        "code": "25065-4",
        "display": "RF 15 minutes"
      },
      {
        "code": "25066-2",
        "display": "RF 30 minutes"
      },
      {
        "code": "25067-0",
        "display": "RF 45 minutes"
      },
      {
        "code": "25068-8",
        "display": "RF 1 hour"
      },
      {
        "code": "25069-6",
        "display": "RF Guidance for biopsy of Unspecified body region"
      },
      {
        "code": "25070-4",
        "display": "RF Unspecified body region Views during surgery"
      },
      {
        "code": "25071-2",
        "display": "XR tomography Unspecified body region"
      },
      {
        "code": "25072-0",
        "display": "Guidance for placement of infusion port"
      },
      {
        "code": "25073-8",
        "display": "RFA Guidance for removal of foreign body from Vessel"
      },
      {
        "code": "25074-6",
        "display": "XR Zygomatic arch Views"
      },
      {
        "code": "25076-1",
        "display": "RFA Hepatic artery Views W contrast IA"
      },
      {
        "code": "25077-9",
        "display": "RFA Guidance for placement of catheter in Hepatic artery-- W contrast IA"
      },
      {
        "code": "25078-7",
        "display": "RF Guidance for placement of stent in Intrahepatic portal system"
      },
      {
        "code": "25079-5",
        "display": "RFA Renal arteries Views W contrast IA"
      },
      {
        "code": "25080-3",
        "display": "RFA Renal vein - bilateral Views for renin sampling W contrast IV"
      },
      {
        "code": "25081-1",
        "display": "RFA Guidance for angioplasty of Renal vessel-- W contrast IA"
      },
      {
        "code": "26064-6",
        "display": "RFA Vein - bilateral Views W contrast IV"
      },
      {
        "code": "26065-3",
        "display": "RFA Vein - left Views W contrast IV"
      },
      {
        "code": "26066-1",
        "display": "RFA Vein - right Views W contrast IV"
      },
      {
        "code": "26067-9",
        "display": "RF Salivary gland - bilateral Views W contrast intra salivary duct"
      },
      {
        "code": "26068-7",
        "display": "RF Salivary gland - left Views W contrast intra salivary duct"
      },
      {
        "code": "26069-5",
        "display": "RF Salivary gland - right Views W contrast intra salivary duct"
      },
      {
        "code": "26070-3",
        "display": "RF Hip - bilateral Arthrogram"
      },
      {
        "code": "26071-1",
        "display": "RF Hip - left Arthrogram"
      },
      {
        "code": "26072-9",
        "display": "RF Hip - right Arthrogram"
      },
      {
        "code": "26073-7",
        "display": "RF Knee - bilateral Arthrogram"
      },
      {
        "code": "26074-5",
        "display": "RF Knee - left Arthrogram"
      },
      {
        "code": "26075-2",
        "display": "RF Knee - right Arthrogram"
      },
      {
        "code": "26076-0",
        "display": "RF Shoulder - bilateral Arthrogram"
      },
      {
        "code": "26077-8",
        "display": "RF Shoulder - left Arthrogram"
      },
      {
        "code": "26078-6",
        "display": "RF Shoulder - right Arthrogram"
      },
      {
        "code": "26079-4",
        "display": "RFA Carotid arteries - bilateral Views W contrast IA"
      },
      {
        "code": "26080-2",
        "display": "RFA Carotid arteries - left Views W contrast IA"
      },
      {
        "code": "26081-0",
        "display": "RFA Carotid arteries -right Views W contrast IA"
      },
      {
        "code": "26082-8",
        "display": "RFA Spinal artery - bilateral Views W contrast IA"
      },
      {
        "code": "26083-6",
        "display": "RFA Spinal artery - left Views W contrast IA"
      },
      {
        "code": "26084-4",
        "display": "RFA Spinal artery - right Views W contrast IA"
      },
      {
        "code": "26085-1",
        "display": "XR Knee - bilateral Views W standing"
      },
      {
        "code": "26086-9",
        "display": "XR Knee - left Views W standing"
      },
      {
        "code": "26087-7",
        "display": "XR Knee - right Views W standing"
      },
      {
        "code": "26088-5",
        "display": "NM Knee - bilateral Views"
      },
      {
        "code": "26089-3",
        "display": "NM Knee - left Views"
      },
      {
        "code": "26090-1",
        "display": "NM Knee - right Views"
      },
      {
        "code": "26091-9",
        "display": "NM Scrotum and Testicle - bilateral Views W Tc-99m pertechnetate IV"
      },
      {
        "code": "26092-7",
        "display": "NM Scrotum and Testicle - left Views W Tc-99m pertechnetate IV"
      },
      {
        "code": "26093-5",
        "display": "NM Scrotum and Testicle - right Views W Tc-99m pertechnetate IV"
      },
      {
        "code": "26094-3",
        "display": "XR Foot - bilateral Views W standing"
      },
      {
        "code": "26095-0",
        "display": "XR Foot - left Views W standing"
      },
      {
        "code": "26096-8",
        "display": "XR Foot - right Views W standing"
      },
      {
        "code": "26097-6",
        "display": "XR Ankle - bilateral Views"
      },
      {
        "code": "26098-4",
        "display": "XR Ankle - left Views"
      },
      {
        "code": "26099-2",
        "display": "XR Ankle - right Views"
      },
      {
        "code": "26100-8",
        "display": "XR Calcaneus - bilateral Views"
      },
      {
        "code": "26101-6",
        "display": "XR Calcaneus - left Views"
      },
      {
        "code": "26102-4",
        "display": "XR Calcaneus - right Views"
      },
      {
        "code": "26106-5",
        "display": "XR Clavicle - bilateral Views"
      },
      {
        "code": "26107-3",
        "display": "XR Clavicle - left Views"
      },
      {
        "code": "26108-1",
        "display": "XR Clavicle - right Views"
      },
      {
        "code": "26109-9",
        "display": "XR Elbow - bilateral Views"
      },
      {
        "code": "26110-7",
        "display": "XR Elbow - left Views"
      },
      {
        "code": "26111-5",
        "display": "XR Elbow - right Views"
      },
      {
        "code": "26112-3",
        "display": "XR Lower extremity - bilateral Views"
      },
      {
        "code": "26113-1",
        "display": "XR Lower extremity - left Views"
      },
      {
        "code": "26114-9",
        "display": "XR Lower extremity - right Views"
      },
      {
        "code": "26115-6",
        "display": "XR Upper extremity - bilateral Views"
      },
      {
        "code": "26116-4",
        "display": "XR Upper extremity - left Views"
      },
      {
        "code": "26117-2",
        "display": "XR Upper extremity - right Views"
      },
      {
        "code": "26118-0",
        "display": "XR Femur - bilateral Views"
      },
      {
        "code": "26120-6",
        "display": "XR Femur - left Views"
      },
      {
        "code": "26122-2",
        "display": "XR Femur - right Views"
      },
      {
        "code": "26124-8",
        "display": "XR Finger - bilateral Views"
      },
      {
        "code": "26125-5",
        "display": "XR Finger - left Views"
      },
      {
        "code": "26126-3",
        "display": "XR Finger - right Views"
      },
      {
        "code": "26127-1",
        "display": "XR Foot - bilateral Views"
      },
      {
        "code": "26128-9",
        "display": "XR Foot - left Views"
      },
      {
        "code": "26129-7",
        "display": "XR Foot - right Views"
      },
      {
        "code": "26130-5",
        "display": "XR Hip - bilateral Views"
      },
      {
        "code": "26131-3",
        "display": "XR Hip - left Views"
      },
      {
        "code": "26132-1",
        "display": "XR Hip - right Views"
      },
      {
        "code": "26133-9",
        "display": "XR Acetabulum - bilateral Views"
      },
      {
        "code": "26134-7",
        "display": "XR Acetabulum - left Views"
      },
      {
        "code": "26135-4",
        "display": "XR Acetabulum - right Views"
      },
      {
        "code": "26136-2",
        "display": "XR Acromioclavicular joint - bilateral Views"
      },
      {
        "code": "26137-0",
        "display": "XR Acromioclavicular joint - left Views"
      },
      {
        "code": "26138-8",
        "display": "XR Acromioclavicular joint - right Views"
      },
      {
        "code": "26139-6",
        "display": "XR Mastoid - bilateral Views"
      },
      {
        "code": "26140-4",
        "display": "XR Mastoid - left Views"
      },
      {
        "code": "26141-2",
        "display": "XR Mastoid - right Views"
      },
      {
        "code": "26142-0",
        "display": "XR Optic foramen - bilateral Views"
      },
      {
        "code": "26143-8",
        "display": "XR Optic foramen - left Views"
      },
      {
        "code": "26144-6",
        "display": "XR Optic foramen - right Views"
      },
      {
        "code": "26146-1",
        "display": "XR Radius and Ulna - bilateral Views"
      },
      {
        "code": "26148-7",
        "display": "XR Radius and Ulna - left Views"
      },
      {
        "code": "26150-3",
        "display": "XR Radius and Ulna - right Views"
      },
      {
        "code": "26151-1",
        "display": "XR Ribs - bilateral Views"
      },
      {
        "code": "26152-9",
        "display": "XR Ribs - left Views"
      },
      {
        "code": "26153-7",
        "display": "XR Ribs - right Views"
      },
      {
        "code": "26154-5",
        "display": "XR Scapula - bilateral Views"
      },
      {
        "code": "26155-2",
        "display": "XR Scapula - left Views"
      },
      {
        "code": "26156-0",
        "display": "XR Scapula - right Views"
      },
      {
        "code": "26157-8",
        "display": "XR Shoulder - bilateral Views"
      },
      {
        "code": "26158-6",
        "display": "XR Shoulder - left Views"
      },
      {
        "code": "26159-4",
        "display": "XR Shoulder - right Views"
      },
      {
        "code": "26160-2",
        "display": "XR Thumb - bilateral Views"
      },
      {
        "code": "26161-0",
        "display": "XR Thumb - left Views"
      },
      {
        "code": "26162-8",
        "display": "XR Thumb - right Views"
      },
      {
        "code": "26163-6",
        "display": "XR Tibia and Fibula - bilateral Views"
      },
      {
        "code": "26164-4",
        "display": "XR Tibia and Fibula - left Views"
      },
      {
        "code": "26165-1",
        "display": "XR Tibia and Fibula - right Views"
      },
      {
        "code": "26166-9",
        "display": "XR Toes - bilateral Views"
      },
      {
        "code": "26167-7",
        "display": "XR Toes - left Views"
      },
      {
        "code": "26168-5",
        "display": "XR Toes - right Views"
      },
      {
        "code": "26169-3",
        "display": "XR Wrist - bilateral Views"
      },
      {
        "code": "26170-1",
        "display": "XR Wrist - left Views"
      },
      {
        "code": "26171-9",
        "display": "XR Wrist - right Views"
      },
      {
        "code": "26172-7",
        "display": "XR Zygomatic arch - bilateral Views"
      },
      {
        "code": "26173-5",
        "display": "XR Zygomatic arch - left Views"
      },
      {
        "code": "26174-3",
        "display": "XR Zygomatic arch - right Views"
      },
      {
        "code": "26175-0",
        "display": "MG Breast - bilateral Screening"
      },
      {
        "code": "26176-8",
        "display": "MG Breast - left Screening"
      },
      {
        "code": "26177-6",
        "display": "MG Breast - right Screening"
      },
      {
        "code": "26178-4",
        "display": "RFA Femoral artery - bilateral Runoff W contrast IA"
      },
      {
        "code": "26179-2",
        "display": "RFA Femoral artery - left Runoff W contrast IA"
      },
      {
        "code": "26180-0",
        "display": "RFA Femoral artery - right Runoff W contrast IA"
      },
      {
        "code": "26181-8",
        "display": "MRA Thoracic inlet vessels - bilateral W contrast IV"
      },
      {
        "code": "26182-6",
        "display": "MRA Thoracic inlet vessels - left W contrast IV"
      },
      {
        "code": "26183-4",
        "display": "MRA Thoracic inlet vessels - right W contrast IV"
      },
      {
        "code": "26184-2",
        "display": "CT Extremity - bilateral W contrast IV"
      },
      {
        "code": "26185-9",
        "display": "CT Extremity - left W contrast IV"
      },
      {
        "code": "26186-7",
        "display": "CT Extremity - right W contrast IV"
      },
      {
        "code": "26187-5",
        "display": "MR Ankle - bilateral WO and W contrast IV"
      },
      {
        "code": "26188-3",
        "display": "MR Ankle - left WO and W contrast IV"
      },
      {
        "code": "26189-1",
        "display": "MR Ankle - right WO and W contrast IV"
      },
      {
        "code": "26190-9",
        "display": "MR Brachial plexus - bilateral WO and W contrast IV"
      },
      {
        "code": "26191-7",
        "display": "MR Brachial plexus - left WO and W contrast IV"
      },
      {
        "code": "26192-5",
        "display": "MR Brachial plexus - right WO and W contrast IV"
      },
      {
        "code": "26193-3",
        "display": "MR Elbow - bilateral WO and W contrast IV"
      },
      {
        "code": "26194-1",
        "display": "MR Elbow - left WO and W contrast IV"
      },
      {
        "code": "26195-8",
        "display": "MR Elbow - right WO and W contrast IV"
      },
      {
        "code": "26196-6",
        "display": "MR Thigh - bilateral WO and W contrast IV"
      },
      {
        "code": "26197-4",
        "display": "MR Thigh - left WO and W contrast IV"
      },
      {
        "code": "26198-2",
        "display": "MR Thigh - right WO and W contrast IV"
      },
      {
        "code": "26199-0",
        "display": "MR Knee - bilateral WO and W contrast IV"
      },
      {
        "code": "26200-6",
        "display": "MR Knee - left WO and W contrast IV"
      },
      {
        "code": "26201-4",
        "display": "MR Knee - right WO and W contrast IV"
      },
      {
        "code": "26202-2",
        "display": "MR Shoulder - bilateral WO and W contrast IV"
      },
      {
        "code": "26203-0",
        "display": "MR Shoulder - left WO and W contrast IV"
      },
      {
        "code": "26204-8",
        "display": "MR Shoulder - right WO and W contrast IV"
      },
      {
        "code": "26205-5",
        "display": "MR Wrist - bilateral WO and W contrast IV"
      },
      {
        "code": "26206-3",
        "display": "MR Wrist - left WO and W contrast IV"
      },
      {
        "code": "26207-1",
        "display": "MR Wrist - right WO and W contrast IV"
      },
      {
        "code": "26208-9",
        "display": "MR Ankle - bilateral"
      },
      {
        "code": "26209-7",
        "display": "MR Ankle - left"
      },
      {
        "code": "26210-5",
        "display": "MR Ankle - right"
      },
      {
        "code": "26211-3",
        "display": "MR Brachial plexus - bilateral"
      },
      {
        "code": "26212-1",
        "display": "MR Brachial plexus - left"
      },
      {
        "code": "26213-9",
        "display": "MR Brachial plexus - right"
      },
      {
        "code": "26214-7",
        "display": "US Breast - bilateral"
      },
      {
        "code": "26215-4",
        "display": "US Breast - left"
      },
      {
        "code": "26216-2",
        "display": "US Breast - right"
      },
      {
        "code": "26217-0",
        "display": "US Carotid arteries - bilateral"
      },
      {
        "code": "26218-8",
        "display": "US Carotid arteries - left"
      },
      {
        "code": "26219-6",
        "display": "US Carotid arteries -right"
      },
      {
        "code": "26220-4",
        "display": "MR Elbow - bilateral"
      },
      {
        "code": "26221-2",
        "display": "MR Elbow - left"
      },
      {
        "code": "26222-0",
        "display": "MR Elbow - right"
      },
      {
        "code": "26223-8",
        "display": "US Extremity - bilateral"
      },
      {
        "code": "26224-6",
        "display": "CT Extremity - bilateral"
      },
      {
        "code": "26225-3",
        "display": "US Extremity - left"
      },
      {
        "code": "26226-1",
        "display": "CT Extremity - left"
      },
      {
        "code": "26227-9",
        "display": "MR Lower extremity joint - bilateral"
      },
      {
        "code": "26228-7",
        "display": "MR Lower extremity joint - left"
      },
      {
        "code": "26229-5",
        "display": "MR Lower extremity joint - right"
      },
      {
        "code": "26230-3",
        "display": "US Extremity - right"
      },
      {
        "code": "26231-1",
        "display": "CT Extremity - right"
      },
      {
        "code": "26232-9",
        "display": "MR Upper extremity - bilateral"
      },
      {
        "code": "26233-7",
        "display": "MR Upper extremity - left"
      },
      {
        "code": "26234-5",
        "display": "MR Upper extremity - right"
      },
      {
        "code": "26235-2",
        "display": "MR Thigh - bilateral"
      },
      {
        "code": "26236-0",
        "display": "MR Thigh - left"
      },
      {
        "code": "26237-8",
        "display": "MR Thigh - right"
      },
      {
        "code": "26238-6",
        "display": "MR Finger - bilateral"
      },
      {
        "code": "26239-4",
        "display": "MR Finger - left"
      },
      {
        "code": "26240-2",
        "display": "MR Finger - right"
      },
      {
        "code": "26241-0",
        "display": "MR Foot - bilateral"
      },
      {
        "code": "26242-8",
        "display": "MR Foot - left"
      },
      {
        "code": "26243-6",
        "display": "MR Foot - right"
      },
      {
        "code": "26244-4",
        "display": "MR Forearm - bilateral"
      },
      {
        "code": "26245-1",
        "display": "MR Forearm - left"
      },
      {
        "code": "26246-9",
        "display": "MR Forearm - right"
      },
      {
        "code": "26247-7",
        "display": "MR Hand - bilateral"
      },
      {
        "code": "26248-5",
        "display": "MR Hand - left"
      },
      {
        "code": "26249-3",
        "display": "MR Hand - right"
      },
      {
        "code": "26250-1",
        "display": "US Hip - bilateral"
      },
      {
        "code": "26251-9",
        "display": "US Hip - left"
      },
      {
        "code": "26252-7",
        "display": "US Hip - right"
      },
      {
        "code": "26253-5",
        "display": "XR tomography Internal auditory canal - bilateral"
      },
      {
        "code": "26254-3",
        "display": "XR tomography Internal auditory canal - left"
      },
      {
        "code": "26255-0",
        "display": "XR tomography Internal auditory canal - right"
      },
      {
        "code": "26256-8",
        "display": "MR Knee - bilateral"
      },
      {
        "code": "26257-6",
        "display": "MR Knee - left"
      },
      {
        "code": "26258-4",
        "display": "MR Knee - right"
      },
      {
        "code": "26259-2",
        "display": "MR Pelvis and Hip - bilateral"
      },
      {
        "code": "26260-0",
        "display": "MR Pelvis and Hip - left"
      },
      {
        "code": "26261-8",
        "display": "MR Pelvis and Hip - right"
      },
      {
        "code": "26262-6",
        "display": "US Popliteal space - bilateral"
      },
      {
        "code": "26263-4",
        "display": "US Popliteal space - left"
      },
      {
        "code": "26264-2",
        "display": "US Popliteal space - right"
      },
      {
        "code": "26265-9",
        "display": "US Shoulder - bilateral"
      },
      {
        "code": "26266-7",
        "display": "MR Shoulder - bilateral"
      },
      {
        "code": "26267-5",
        "display": "US Shoulder - left"
      },
      {
        "code": "26268-3",
        "display": "MR Shoulder - left"
      },
      {
        "code": "26269-1",
        "display": "US Shoulder - right"
      },
      {
        "code": "26270-9",
        "display": "MR Shoulder - right"
      },
      {
        "code": "26271-7",
        "display": "US Scrotum and Testicle - bilateral"
      },
      {
        "code": "26272-5",
        "display": "US Scrotum and Testicle - left"
      },
      {
        "code": "26273-3",
        "display": "US Scrotum and Testicle - right"
      },
      {
        "code": "26277-4",
        "display": "MR Wrist - bilateral"
      },
      {
        "code": "26278-2",
        "display": "US Wrist - bilateral"
      },
      {
        "code": "26279-0",
        "display": "MR Wrist - left"
      },
      {
        "code": "26280-8",
        "display": "US Wrist - left"
      },
      {
        "code": "26281-6",
        "display": "MR Wrist - right"
      },
      {
        "code": "26282-4",
        "display": "US Wrist - right"
      },
      {
        "code": "26283-2",
        "display": "XR Knee - bilateral Merchants"
      },
      {
        "code": "26284-0",
        "display": "XR Knee - left Merchants"
      },
      {
        "code": "26285-7",
        "display": "XR Knee - right Merchants"
      },
      {
        "code": "26286-5",
        "display": "US Breast - bilateral limited"
      },
      {
        "code": "26287-3",
        "display": "MG Breast - bilateral Limited Views"
      },
      {
        "code": "26288-1",
        "display": "US Breast - left limited"
      },
      {
        "code": "26289-9",
        "display": "MG Breast - left Limited Views"
      },
      {
        "code": "26290-7",
        "display": "US Breast - right limited"
      },
      {
        "code": "26291-5",
        "display": "MG Breast - right Limited Views"
      },
      {
        "code": "26292-3",
        "display": "MG stereo Guidance for biopsy of Breast - bilateral"
      },
      {
        "code": "26293-1",
        "display": "MG stereo Guidance for biopsy of Breast - left"
      },
      {
        "code": "26294-9",
        "display": "MG stereo Guidance for biopsy of Breast - right"
      },
      {
        "code": "26295-6",
        "display": "RFA Guidance for reposition of CV catheter in Vein - bilateral-- W contrast IV"
      },
      {
        "code": "26296-4",
        "display": "RFA Guidance for reposition of CV catheter in Vein - left-- W contrast IV"
      },
      {
        "code": "26297-2",
        "display": "RFA Guidance for reposition of CV catheter in Vein - right-- W contrast IV"
      },
      {
        "code": "26298-0",
        "display": "RFA Guidance for atherectomy of Vein - bilateral-- W contrast IV"
      },
      {
        "code": "26299-8",
        "display": "RFA Guidance for atherectomy of Vein - left-- W contrast IV"
      },
      {
        "code": "26300-4",
        "display": "RFA Guidance for atherectomy of Vein - right-- W contrast IV"
      },
      {
        "code": "26301-2",
        "display": "RFA Guidance for placement of stent in Vein - bilateral"
      },
      {
        "code": "26302-0",
        "display": "RFA Guidance for placement of stent in Vein - left"
      },
      {
        "code": "26303-8",
        "display": "RFA Guidance for placement of stent in Vein - right"
      },
      {
        "code": "26304-6",
        "display": "RFA Guidance for placement of peripherally-inserted central venous catheter in Vein - bilateral"
      },
      {
        "code": "26305-3",
        "display": "RFA Guidance for placement of peripherally-inserted central venous catheter in Vein - left"
      },
      {
        "code": "26306-1",
        "display": "RFA Guidance for placement of peripherally-inserted central venous catheter in Vein - right"
      },
      {
        "code": "26307-9",
        "display": "Guidance for placement of large bore CV catheter in Vein - bilateral"
      },
      {
        "code": "26308-7",
        "display": "Guidance for placement of large bore CV catheter in Vein - left"
      },
      {
        "code": "26309-5",
        "display": "Guidance for placement of large bore CV catheter in Vein - right"
      },
      {
        "code": "26310-3",
        "display": "RFA Guidance for placement of CV catheter in Vein - bilateral-- W contrast IV"
      },
      {
        "code": "26311-1",
        "display": "RFA Guidance for placement of CV catheter in Vein - left-- W contrast IV"
      },
      {
        "code": "26312-9",
        "display": "RFA Guidance for placement of CV catheter in Vein - right-- W contrast IV"
      },
      {
        "code": "26313-7",
        "display": "US Guidance for needle localization of Breast - bilateral"
      },
      {
        "code": "26314-5",
        "display": "US Guidance for needle localization of Breast - left"
      },
      {
        "code": "26315-2",
        "display": "MG Guidance for needle localization of mass of Breast - bilateral"
      },
      {
        "code": "26316-0",
        "display": "MG Guidance for needle localization of mass of Breast - left"
      },
      {
        "code": "26317-8",
        "display": "MG Guidance for needle localization of mass of Breast - right"
      },
      {
        "code": "26318-6",
        "display": "US Guidance for needle localization of Breast - right"
      },
      {
        "code": "26319-4",
        "display": "CT Guidance for injection of Sacroiliac joint - bilateral"
      },
      {
        "code": "26320-2",
        "display": "CT Guidance for injection of Sacroiliac joint - left"
      },
      {
        "code": "26321-0",
        "display": "CT Guidance for injection of Sacroiliac joint - right"
      },
      {
        "code": "26322-8",
        "display": "RF Guidance for injection of Spine facet joint - bilateral"
      },
      {
        "code": "26323-6",
        "display": "RF Guidance for injection of Spine facet joint - left"
      },
      {
        "code": "26324-4",
        "display": "RF Guidance for injection of Spine facet joint - right"
      },
      {
        "code": "26325-1",
        "display": "US Guidance for drainage and placement of drainage catheter of Extremity - bilateral"
      },
      {
        "code": "26326-9",
        "display": "US Guidance for drainage and placement of drainage catheter of Extremity - left"
      },
      {
        "code": "26327-7",
        "display": "US Guidance for drainage and placement of drainage catheter of Extremity - right"
      },
      {
        "code": "26328-5",
        "display": "US Guidance for drainage and placement of drainage catheter of Kidney - bilateral"
      },
      {
        "code": "26329-3",
        "display": "US Guidance for drainage and placement of drainage catheter of Kidney - left"
      },
      {
        "code": "26330-1",
        "display": "US Guidance for drainage and placement of drainage catheter of Kidney - right"
      },
      {
        "code": "26331-9",
        "display": "RFA Guidance for change of CV catheter in Vein - bilateral-- W contrast IV"
      },
      {
        "code": "26332-7",
        "display": "RFA Guidance for change of CV catheter in Vein - left-- W contrast IV"
      },
      {
        "code": "26333-5",
        "display": "RFA Guidance for change of CV catheter in Vein - right-- W contrast IV"
      },
      {
        "code": "26334-3",
        "display": "MG Guidance for percutaneous biopsy.core needle of Breast - bilateral"
      },
      {
        "code": "26335-0",
        "display": "MG Guidance for percutaneous biopsy.core needle of Breast - left"
      },
      {
        "code": "26336-8",
        "display": "MG Guidance for percutaneous biopsy.core needle of Breast - right"
      },
      {
        "code": "26337-6",
        "display": "MG Guidance for biopsy of Breast - bilateral"
      },
      {
        "code": "26338-4",
        "display": "MG Guidance for biopsy of Breast - left"
      },
      {
        "code": "26339-2",
        "display": "MG Guidance for biopsy of Breast - right"
      },
      {
        "code": "26340-0",
        "display": "US Guidance for biopsy of Kidney - bilateral"
      },
      {
        "code": "26341-8",
        "display": "US Guidance for biopsy of Kidney - left"
      },
      {
        "code": "26342-6",
        "display": "US Guidance for biopsy of Kidney - right"
      },
      {
        "code": "26343-4",
        "display": "MG Guidance for aspiration of cyst of Breast - bilateral"
      },
      {
        "code": "26344-2",
        "display": "MG Guidance for aspiration of cyst of Breast - left"
      },
      {
        "code": "26345-9",
        "display": "MG Guidance for aspiration of cyst of Breast - right"
      },
      {
        "code": "26346-7",
        "display": "MG Breast - bilateral Diagnostic"
      },
      {
        "code": "26347-5",
        "display": "MG Breast - left Diagnostic"
      },
      {
        "code": "26348-3",
        "display": "MG Breast - right Diagnostic"
      },
      {
        "code": "26349-1",
        "display": "MG Breast - bilateral Diagnostic Limited Views"
      },
      {
        "code": "26350-9",
        "display": "MG Breast - left Diagnostic Limited Views"
      },
      {
        "code": "26351-7",
        "display": "MG Breast - right Diagnostic Limited Views"
      },
      {
        "code": "26352-5",
        "display": "XR Wrist - bilateral and Hand - bilateral Bone age Views"
      },
      {
        "code": "26353-3",
        "display": "XR Wrist - left and Hand - left Bone age Views"
      },
      {
        "code": "26354-1",
        "display": "XR Wrist - right and Hand - right Bone age Views"
      },
      {
        "code": "26355-8",
        "display": "XR Hand - bilateral Arthritis"
      },
      {
        "code": "26356-6",
        "display": "XR Hand - left Arthritis"
      },
      {
        "code": "26357-4",
        "display": "XR Hand - right Arthritis"
      },
      {
        "code": "26358-2",
        "display": "XR Knee - bilateral AP W standing"
      },
      {
        "code": "26359-0",
        "display": "XR Knee - left AP W standing"
      },
      {
        "code": "26360-8",
        "display": "XR Knee - right AP W standing"
      },
      {
        "code": "26361-6",
        "display": "XR Knee - bilateral AP and PA W standing"
      },
      {
        "code": "26362-4",
        "display": "XR Knee - left AP and PA W standing"
      },
      {
        "code": "26363-2",
        "display": "XR Knee - right AP and PA W standing"
      },
      {
        "code": "26364-0",
        "display": "XR Knee - bilateral AP and Lateral W standing"
      },
      {
        "code": "26365-7",
        "display": "XR Knee - left AP and Lateral W standing"
      },
      {
        "code": "26366-5",
        "display": "XR Knee - right AP and Lateral W standing"
      },
      {
        "code": "26368-1",
        "display": "Deprecated Brachiocephalic artery - left Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "code": "26369-9",
        "display": "Deprecated Brachiocephalic artery - right Fluoroscopic angiogram Angioplasty W contrast IA"
      },
      {
        "code": "26370-7",
        "display": "RFA Guidance for angioplasty of Iliac artery - bilateral-- W contrast IA"
      },
      {
        "code": "26371-5",
        "display": "RFA Guidance for angioplasty of Iliac artery - left-- W contrast IA"
      },
      {
        "code": "26372-3",
        "display": "RFA Guidance for angioplasty of Iliac artery - right-- W contrast IA"
      },
      {
        "code": "26373-1",
        "display": "Deprecated RFA Guidance for angioplasty of Tibial artery - bilateral-- W contrast IA"
      },
      {
        "code": "26374-9",
        "display": "Deprecated RFA Guidance for angioplasty of Tibial artery - left-- W contrast IA"
      },
      {
        "code": "26375-6",
        "display": "Deprecated RFA Guidance for angioplasty of Tibial artery - right-- W contrast IA"
      },
      {
        "code": "26376-4",
        "display": "Administration of vasodilator into catheter Vein - bilateral"
      },
      {
        "code": "26377-2",
        "display": "Administration of vasodilator into catheter Vein - left"
      },
      {
        "code": "26378-0",
        "display": "Administration of vasodilator into catheter Vein - right"
      },
      {
        "code": "26379-8",
        "display": "XR Hand - bilateral 3 Views"
      },
      {
        "code": "26380-6",
        "display": "XR Hand - left 3 Views"
      },
      {
        "code": "26381-4",
        "display": "XR Hand - right 3 Views"
      },
      {
        "code": "26382-2",
        "display": "XR Shoulder - bilateral 3 Views"
      },
      {
        "code": "26383-0",
        "display": "XR Shoulder - left 3 Views"
      },
      {
        "code": "26384-8",
        "display": "XR Shoulder - right 3 Views"
      },
      {
        "code": "26385-5",
        "display": "XR Ankle - bilateral 2 Views"
      },
      {
        "code": "26386-3",
        "display": "XR Ankle - left 2 Views"
      },
      {
        "code": "26387-1",
        "display": "XR Ankle - right 2 Views"
      },
      {
        "code": "26388-9",
        "display": "XR Hand - bilateral 2 Views"
      },
      {
        "code": "26389-7",
        "display": "XR Hand - left 2 Views"
      },
      {
        "code": "26390-5",
        "display": "XR Hand - right 2 Views"
      },
      {
        "code": "26391-3",
        "display": "XR Humerus - bilateral 2 Views"
      },
      {
        "code": "26392-1",
        "display": "XR Humerus - left 2 Views"
      },
      {
        "code": "26393-9",
        "display": "XR Humerus - right 2 Views"
      },
      {
        "code": "26394-7",
        "display": "XR Knee - bilateral 2 Views"
      },
      {
        "code": "26395-4",
        "display": "XR Knee - left 2 Views"
      },
      {
        "code": "26396-2",
        "display": "XR Knee - right 2 Views"
      },
      {
        "code": "26397-0",
        "display": "XR Patella - bilateral 2 Views"
      },
      {
        "code": "26398-8",
        "display": "XR Patella - left 2 Views"
      },
      {
        "code": "26399-6",
        "display": "XR Patella - right 2 Views"
      },
      {
        "code": "26400-2",
        "display": "XR Hip - bilateral Single view"
      },
      {
        "code": "26401-0",
        "display": "XR Hip - left Single view"
      },
      {
        "code": "26402-8",
        "display": "XR Hip - right Single view"
      },
      {
        "code": "28011-5",
        "display": "Emergency department Medical records"
      },
      {
        "code": "28032-1",
        "display": "Deprecated Cardiac echo, study"
      },
      {
        "code": "28561-9",
        "display": "XR Pelvis Views"
      },
      {
        "code": "28564-3",
        "display": "XR Skull Views"
      },
      {
        "code": "28565-0",
        "display": "XR Knee Views"
      },
      {
        "code": "28566-8",
        "display": "CT Spine"
      },
      {
        "code": "28567-6",
        "display": "XR Humerus Views"
      },
      {
        "code": "28568-4",
        "display": "Physician Emergency department Note"
      },
      {
        "code": "28569-2",
        "display": "Consultant Progress note"
      },
      {
        "code": "28570-0",
        "display": "Procedure note"
      },
      {
        "code": "28571-8",
        "display": "Speech-language pathology Note"
      },
      {
        "code": "28572-6",
        "display": "Dentistry Initial evaluation note"
      },
      {
        "code": "28573-4",
        "display": "Physician, Operation note"
      },
      {
        "code": "28574-2",
        "display": "Deprecated Discharge note"
      },
      {
        "code": "28575-9",
        "display": "Nurse practitioner Progress note"
      },
      {
        "code": "28576-7",
        "display": "MR Joint"
      },
      {
        "code": "28577-5",
        "display": "Dentistry Procedure note"
      },
      {
        "code": "28578-3",
        "display": "Occupational therapy Note"
      },
      {
        "code": "28579-1",
        "display": "Physical therapy Note"
      },
      {
        "code": "28580-9",
        "display": "Chiropractic medicine Progress note"
      },
      {
        "code": "28581-7",
        "display": "Chiropractic medicine Initial evaluation note"
      },
      {
        "code": "28582-5",
        "display": "XR Hand Views"
      },
      {
        "code": "28583-3",
        "display": "Dentist Operation note"
      },
      {
        "code": "28613-8",
        "display": "XR Spine Views"
      },
      {
        "code": "28614-6",
        "display": "US Liver"
      },
      {
        "code": "28615-3",
        "display": "Audiology study"
      },
      {
        "code": "28616-1",
        "display": "Physician Transfer note"
      },
      {
        "code": "28617-9",
        "display": "Dentistry Progress note"
      },
      {
        "code": "28618-7",
        "display": "Dentistry Note"
      },
      {
        "code": "28621-1",
        "display": "Nurse practitioner Initial evaluation note"
      },
      {
        "code": "28622-9",
        "display": "Deprecated Nurse Discharge assessment"
      },
      {
        "code": "28623-7",
        "display": "Nurse Progress note"
      },
      {
        "code": "28624-5",
        "display": "Podiatry Operation note"
      },
      {
        "code": "28625-2",
        "display": "Podiatry Procedure note"
      },
      {
        "code": "28626-0",
        "display": "Physician History and physical note"
      },
      {
        "code": "28627-8",
        "display": "Psychiatry Progress note"
      },
      {
        "code": "28628-6",
        "display": "Psychiatry Note"
      },
      {
        "code": "28629-4",
        "display": "Perimetry study"
      },
      {
        "code": "28630-2",
        "display": "Tonometry study"
      },
      {
        "code": "28631-0",
        "display": "Visual acuity study"
      },
      {
        "code": "28632-8",
        "display": "Heterophoria study"
      },
      {
        "code": "28633-6",
        "display": "Polysomnography (sleep) study"
      },
      {
        "code": "28635-1",
        "display": "Psychiatry Initial evaluation note"
      },
      {
        "code": "28636-9",
        "display": "Initial evaluation note"
      },
      {
        "code": "28651-8",
        "display": "Nurse Transfer note"
      },
      {
        "code": "28653-4",
        "display": "Social worker Note"
      },
      {
        "code": "28654-2",
        "display": "Attending Initial evaluation note"
      },
      {
        "code": "28655-9",
        "display": "Attending Discharge summary"
      },
      {
        "code": "28656-7",
        "display": "Social worker Progress note"
      },
      {
        "code": "29206-0",
        "display": "Speech therapy service attachment"
      },
      {
        "code": "29252-4",
        "display": "CT Chest WO contrast"
      },
      {
        "code": "29272-2",
        "display": "Eye ultrasound study"
      },
      {
        "code": "29749-9",
        "display": "Dialysis records"
      },
      {
        "code": "29750-7",
        "display": "Neonatal intensive care records"
      },
      {
        "code": "29751-5",
        "display": "Critical care records"
      },
      {
        "code": "29752-3",
        "display": "Perioperative records"
      },
      {
        "code": "29753-1",
        "display": "Nurse Initial evaluation note"
      },
      {
        "code": "29754-9",
        "display": "Nystagmogram study"
      },
      {
        "code": "29755-6",
        "display": "Nerve conduction study"
      },
      {
        "code": "29756-4",
        "display": "Peritoneoscopy study"
      },
      {
        "code": "29757-2",
        "display": "Colposcopy study"
      },
      {
        "code": "29761-4",
        "display": "Dentistry Discharge summary"
      },
      {
        "code": "30578-9",
        "display": "CT Guidance for drainage of abscess and placement of drainage catheter of Unspecified body region"
      },
      {
        "code": "30579-7",
        "display": "CT Guidance for injection of Spine facet joint"
      },
      {
        "code": "30580-5",
        "display": "CT Guidance for fine needle aspiration of Unspecified body region"
      },
      {
        "code": "30581-3",
        "display": "CT Guidance for radiation treatment of Unspecified body region-- W contrast IV"
      },
      {
        "code": "30582-1",
        "display": "CT Guidance for radiation treatment of Unspecified body region-- WO contrast"
      },
      {
        "code": "30583-9",
        "display": "CT Internal auditory canal W contrast IV"
      },
      {
        "code": "30584-7",
        "display": "CT Internal auditory canal WO contrast"
      },
      {
        "code": "30585-4",
        "display": "CT Nasopharynx and Neck WO contrast"
      },
      {
        "code": "30586-2",
        "display": "CT Neck WO and W contrast IV"
      },
      {
        "code": "30587-0",
        "display": "CT Orbit - bilateral WO contrast"
      },
      {
        "code": "30588-8",
        "display": "CT Sinuses"
      },
      {
        "code": "30589-6",
        "display": "CT Petrous part of temporal bone WO contrast"
      },
      {
        "code": "30590-4",
        "display": "CT Pituitary and Sella turcica W contrast IV"
      },
      {
        "code": "30591-2",
        "display": "CT Pituitary and Sella turcica WO contrast"
      },
      {
        "code": "30592-0",
        "display": "CT Cervical spine WO contrast"
      },
      {
        "code": "30593-8",
        "display": "CTA Head vessels WO and W contrast IV"
      },
      {
        "code": "30594-6",
        "display": "CTA Neck vessels WO and W contrast IV"
      },
      {
        "code": "30595-3",
        "display": "CT Guidance for fine needle aspiration of Lung"
      },
      {
        "code": "30596-1",
        "display": "CT Thoracic spine W contrast IT"
      },
      {
        "code": "30597-9",
        "display": "CT Thoracic spine WO contrast"
      }
    ]
  };

  CDEX.medCodes = {
    "snomedct": [
      {
        "Code": 763158003,
        "Display": "Medicinal product (product)"
      },
      {
        "Code": "50580-506-02",
        "Display": "Tylenol PM"
      },
      {
        "Code": 169008,
        "Display": "Product containing hypothalamic releasing factor (product)"
      },
      {
        "Code": 211009,
        "Display": "Product containing norethandrolone (medicinal product)"
      },
      {
        "Code": 302007,
        "Display": "Product containing spiramycin (medicinal product)"
      },
      {
        "Code": 439007,
        "Display": "Therapeutic radioisotope"
      },
      {
        "Code": 544002,
        "Display": "Product containing melphalan (medicinal product)"
      },
      {
        "Code": 796001,
        "Display": "Product containing digoxin (medicinal product)"
      },
      {
        "Code": 847003,
        "Display": "Product containing dextrothyroxine (medicinal product)"
      },
      {
        "Code": 922004,
        "Display": "Product containing pralidoxime (medicinal product)"
      },
      {
        "Code": 1039008,
        "Display": "Product containing mercaptopurine (medicinal product)"
      },
      {
        "Code": 1148001,
        "Display": "Product containing ticarcillin (medicinal product)"
      },
      {
        "Code": 1182007,
        "Display": "Hypotensive agent"
      },
      {
        "Code": 1206000,
        "Display": "Product containing alpha-2 adrenergic receptor antagonist (product)"
      },
      {
        "Code": 1222004,
        "Display": "Product containing metronidazole (medicinal product)"
      },
      {
        "Code": 1389007,
        "Display": "Product containing beclometasone (medicinal product)"
      },
      {
        "Code": 1434005,
        "Display": "Product containing calamine (medicinal product)"
      },
      {
        "Code": 1528001,
        "Display": "Product containing folinic acid (medicinal product)"
      },
      {
        "Code": 1552008,
        "Display": "Medicinal product acting as saluretic (product)"
      },
      {
        "Code": 1594006,
        "Display": "Product containing azatadine (medicinal product)"
      },
      {
        "Code": 1758005,
        "Display": "Product containing motilin (medicinal product)"
      },
      {
        "Code": 1842003,
        "Display": "Product containing diphemanil (medicinal product)"
      },
      {
        "Code": 1878008,
        "Display": "Product containing hexachlorophene (medicinal product)"
      },
      {
        "Code": 1887004,
        "Display": "Product containing permethrin (medicinal product)"
      },
      {
        "Code": 1982006,
        "Display": "Bacitracin-containing product in ocular dose form"
      },
      {
        "Code": 2016004,
        "Display": "Product containing dextromethorphan (medicinal product)"
      },
      {
        "Code": 2183004,
        "Display": "Product containing tetryzoline (medicinal product)"
      },
      {
        "Code": 2190009,
        "Display": "Product containing trihexyphenidyl (medicinal product)"
      },
      {
        "Code": 2497003,
        "Display": "Product containing hexetidine (medicinal product)"
      },
      {
        "Code": 2571007,
        "Display": "Product containing busulfan (medicinal product)"
      },
      {
        "Code": 2596005,
        "Display": "Product containing lincomycin (medicinal product)"
      },
      {
        "Code": 2679000,
        "Display": "Product containing oxandrolone (medicinal product)"
      },
      {
        "Code": 2949005,
        "Display": "Diagnostic aid"
      },
      {
        "Code": 3037004,
        "Display": "Product containing flumetasone (medicinal product)"
      },
      {
        "Code": 3127006,
        "Display": "Product containing fluorouracil (medicinal product)"
      },
      {
        "Code": 3334000,
        "Display": "Product containing cefotaxime (medicinal product)"
      },
      {
        "Code": 3814009,
        "Display": "Product containing propylthiouracil (medicinal product)"
      },
      {
        "Code": 3822002,
        "Display": "Product containing succinylcholine (medicinal product)"
      },
      {
        "Code": 4126008,
        "Display": "Product containing fluprednisolone (medicinal product)"
      },
      {
        "Code": 4194004,
        "Display": "Product containing mazindol (medicinal product)"
      },
      {
        "Code": 4219002,
        "Display": "Product containing penicillamine (medicinal product)"
      },
      {
        "Code": 4220008,
        "Display": "Product containing tolazoline (medicinal product)"
      },
      {
        "Code": 4382004,
        "Display": "Centrally acting hypotensive agent"
      },
      {
        "Code": 4704002,
        "Display": "Product containing iothiouracil (medicinal product)"
      },
      {
        "Code": 4865009,
        "Display": "Product containing prolactin releasing factor (product)"
      },
      {
        "Code": 4937008,
        "Display": "Product containing cefaclor (medicinal product)"
      },
      {
        "Code": 5067008,
        "Display": "Antithyroid agent"
      },
      {
        "Code": 5478006,
        "Display": "Product containing trifluperidol (medicinal product)"
      },
      {
        "Code": 5606003,
        "Display": "Product containing dexamethasone in nasal dose form (medicinal product form)"
      },
      {
        "Code": 5720001,
        "Display": "Product containing Latrodectus mactans antivenom (medicinal product)"
      },
      {
        "Code": 5737008,
        "Display": "Product containing demeclocycline (medicinal product)"
      },
      {
        "Code": 5776009,
        "Display": "Medicinal product acting as anesthetic agent (product)"
      },
      {
        "Code": 5786005,
        "Display": "Product containing chlorothiazide (medicinal product)"
      },
      {
        "Code": 5797005,
        "Display": "Product containing clotrimazole (medicinal product)"
      },
      {
        "Code": 5975000,
        "Display": "Product containing niclosamide (medicinal product)"
      },
      {
        "Code": 6028009,
        "Display": "Product containing triamcinolone (medicinal product)"
      },
      {
        "Code": 6067003,
        "Display": "Product containing orciprenaline (medicinal product)"
      },
      {
        "Code": 6071000,
        "Display": "Product containing coal tar (medicinal product)"
      },
      {
        "Code": 6102009,
        "Display": "Product containing baclofen (medicinal product)"
      },
      {
        "Code": 6116004,
        "Display": "Product containing oxymetholone (medicinal product)"
      },
      {
        "Code": 6232005,
        "Display": "Product containing naphazoline (medicinal product)"
      },
      {
        "Code": 6247001,
        "Display": "Product containing folic acid (medicinal product)"
      },
      {
        "Code": 6259002,
        "Display": "Product containing precisely hydrogen peroxide 30 milligram/1 milliliter conventional release cutaneous solution (clinical drug)"
      },
      {
        "Code": 6369005,
        "Display": "Product containing penicillin and antibiotic (product)"
      },
      {
        "Code": 6425004,
        "Display": "Product containing histamine receptor antagonist (product)"
      },
      {
        "Code": 6526001,
        "Display": "Product containing nalorphine (medicinal product)"
      },
      {
        "Code": 6625006,
        "Display": "Product containing zinc sulfate (medicinal product)"
      },
      {
        "Code": 6716006,
        "Display": "Abortifacient agent"
      },
      {
        "Code": 6960003,
        "Display": "Product containing polymyxin B (medicinal product)"
      },
      {
        "Code": 6985007,
        "Display": "Product containing opium (medicinal product)"
      },
      {
        "Code": 7092007,
        "Display": "Product containing metoprolol (medicinal product)"
      },
      {
        "Code": 7140000,
        "Display": "Radiographic contrast media"
      },
      {
        "Code": 7168001,
        "Display": "Product containing magnesium carbonate (medicinal product)"
      },
      {
        "Code": 7235000,
        "Display": "Product containing ethylenediamine derivative and histamine receptor antagonist (product)"
      },
      {
        "Code": 7292004,
        "Display": "Product containing indocyanine green (medicinal product)"
      },
      {
        "Code": 7336002,
        "Display": "Product containing trazodone (medicinal product)"
      },
      {
        "Code": 7561000,
        "Display": "Product containing dexamethasone (medicinal product)"
      },
      {
        "Code": 7577004,
        "Display": "Product containing ciprofloxacin (medicinal product)"
      },
      {
        "Code": 7624002,
        "Display": "Product containing sodium perborate (medicinal product)"
      },
      {
        "Code": 7836006,
        "Display": "Expectorant agent"
      },
      {
        "Code": 7947003,
        "Display": "Product containing aspirin (medicinal product)"
      },
      {
        "Code": 7959004,
        "Display": "Product containing teniposide (medicinal product)"
      },
      {
        "Code": 8028001,
        "Display": "Product containing butacaine (medicinal product)"
      },
      {
        "Code": 8109005,
        "Display": "Product containing alimemazine (medicinal product)"
      },
      {
        "Code": 8163008,
        "Display": "Product containing nitroprusside (medicinal product)"
      },
      {
        "Code": 8348002,
        "Display": "Product containing cyclopentolate (medicinal product)"
      },
      {
        "Code": 8372007,
        "Display": "Product containing promethazine (medicinal product)"
      },
      {
        "Code": 8416000,
        "Display": "Product containing dicloxacillin (medicinal product)"
      },
      {
        "Code": 8571001,
        "Display": "Medicinal product acting as vasoconstrictor (product)"
      },
      {
        "Code": 8658008,
        "Display": "Product containing human serum albumin (medicinal product)"
      },
      {
        "Code": 8661009,
        "Display": "Replacement preparation"
      },
      {
        "Code": 8692006,
        "Display": "Product containing metamfetamine (medicinal product)"
      },
      {
        "Code": 8696009,
        "Display": "Medicinal product acting as antispasmodic agent (product)"
      },
      {
        "Code": 9190005,
        "Display": "Product containing tropicamide (medicinal product)"
      },
      {
        "Code": 9268004,
        "Display": "Product containing secbutabarbital (medicinal product)"
      },
      {
        "Code": 9500005,
        "Display": "Product containing phenelzine (medicinal product)"
      },
      {
        "Code": 9542007,
        "Display": "Hepatitis B surface antigen immunoglobulin-containing product"
      },
      {
        "Code": 9690006,
        "Display": "Product containing nikethamide (medicinal product)"
      },
      {
        "Code": 9745007,
        "Display": "Product containing sucrose (medicinal product)"
      },
      {
        "Code": 9778000,
        "Display": "Cytomegalovirus antibody-containing product"
      },
      {
        "Code": 9944001,
        "Display": "Product containing chlorphenamine (medicinal product)"
      },
      {
        "Code": 10099000,
        "Display": "Product containing ketoprofen (medicinal product)"
      },
      {
        "Code": 10135005,
        "Display": "Product containing Cinchona alkaloid (product)"
      },
      {
        "Code": 10312003,
        "Display": "Product containing prednisone (medicinal product)"
      },
      {
        "Code": 10422008,
        "Display": "Product containing pentaerithrityl tetranitrate (medicinal product)"
      },
      {
        "Code": 10504007,
        "Display": "Product containing doxycycline (medicinal product)"
      },
      {
        "Code": 10515002,
        "Display": "Product containing lututrin (medicinal product)"
      },
      {
        "Code": 10555000,
        "Display": "Product containing tocainide (medicinal product)"
      },
      {
        "Code": 10632007,
        "Display": "Multivitamin preparation"
      },
      {
        "Code": 10712001,
        "Display": "Product containing glucagon (medicinal product)"
      },
      {
        "Code": 10756001,
        "Display": "Product containing haloperidol (medicinal product)"
      },
      {
        "Code": 10784006,
        "Display": "Medicinal product acting as antipsychotic agent (product)"
      },
      {
        "Code": 11402001,
        "Display": "Product containing enzyme (product)"
      },
      {
        "Code": 11430001,
        "Display": "Tetracyclic antidepressant"
      },
      {
        "Code": 11563006,
        "Display": "Product containing vitamin D and vitamin D derivative (product)"
      },
      {
        "Code": 11719000,
        "Display": "Product containing cetylpyridinium (medicinal product)"
      },
      {
        "Code": 11783005,
        "Display": "Medicinal product acting as stool softener (product)"
      },
      {
        "Code": 11796006,
        "Display": "Product containing methysergide (medicinal product)"
      },
      {
        "Code": 11841005,
        "Display": "Product containing doxepin (medicinal product)"
      },
      {
        "Code": 11847009,
        "Display": "Product containing naproxen (medicinal product)"
      },
      {
        "Code": 11959009,
        "Display": "Product containing procainamide (medicinal product)"
      },
      {
        "Code": 12096000,
        "Display": "Product containing nystatin (medicinal product)"
      },
      {
        "Code": 12236006,
        "Display": "Product containing pancreatin (medicinal product)"
      },
      {
        "Code": 12335007,
        "Display": "Diatrizoate-containing product"
      },
      {
        "Code": 12369008,
        "Display": "Product containing oxytocin (medicinal product)"
      },
      {
        "Code": 12436009,
        "Display": "Product containing vinblastine (medicinal product)"
      },
      {
        "Code": 12495006,
        "Display": "Product containing magnesium citrate (medicinal product)"
      },
      {
        "Code": 12512008,
        "Display": "Product containing triamterene (medicinal product)"
      },
      {
        "Code": 12559001,
        "Display": "Product containing emetine (medicinal product)"
      },
      {
        "Code": 12839006,
        "Display": "Product containing estradiol (medicinal product)"
      },
      {
        "Code": 13132007,
        "Display": "Product containing dextran (medicinal product)"
      },
      {
        "Code": 13252002,
        "Display": "Product containing salsalate (medicinal product)"
      },
      {
        "Code": 13414000,
        "Display": "Product containing cefadroxil (medicinal product)"
      },
      {
        "Code": 13432000,
        "Display": "Product containing nortriptyline (medicinal product)"
      },
      {
        "Code": 13512003,
        "Display": "Product containing minocycline (medicinal product)"
      },
      {
        "Code": 13525006,
        "Display": "Product containing acetylcholine (medicinal product)"
      },
      {
        "Code": 13565005,
        "Display": "Product containing bisacodyl (medicinal product)"
      },
      {
        "Code": 13592004,
        "Display": "Product containing pyrazinamide (medicinal product)"
      },
      {
        "Code": 13664004,
        "Display": "Product containing dimercaprol (medicinal product)"
      },
      {
        "Code": 13790009,
        "Display": "Product containing iron in oral dose form (medicinal product form)"
      },
      {
        "Code": 13800009,
        "Display": "Product containing naftifine (medicinal product)"
      },
      {
        "Code": 13813003,
        "Display": "Product containing biotin (medicinal product)"
      },
      {
        "Code": 13929005,
        "Display": "Product containing spironolactone (medicinal product)"
      },
      {
        "Code": 13936006,
        "Display": "Product containing butorphanol (medicinal product)"
      },
      {
        "Code": 13965000,
        "Display": "Product containing valproic acid (medicinal product)"
      },
      {
        "Code": 14103001,
        "Display": "Product containing opioid receptor antagonist (product)"
      },
      {
        "Code": 14170004,
        "Display": "Product containing capreomycin (medicinal product)"
      },
      {
        "Code": 14601000,
        "Display": "Product containing acetylcholine receptor antagonist (product)"
      },
      {
        "Code": 14706000,
        "Display": "Phenethicillin-containing product"
      },
      {
        "Code": 14728000,
        "Display": "Product containing chloroquine (medicinal product)"
      },
      {
        "Code": 14814001,
        "Display": "Product containing trimethobenzamide (medicinal product)"
      },
      {
        "Code": 14816004,
        "Display": "Product containing cocaine (medicinal product)"
      },
      {
        "Code": 15222008,
        "Display": "Product containing enalapril (medicinal product)"
      },
      {
        "Code": 15375005,
        "Display": "Product containing phenanthrene derivative (product)"
      },
      {
        "Code": 15383004,
        "Display": "Product containing levodopa (medicinal product)"
      },
      {
        "Code": 15432003,
        "Display": "Product containing ethinylestradiol (medicinal product)"
      },
      {
        "Code": 15772006,
        "Display": "Product containing beta-1 adrenergic receptor antagonist (product)"
      },
      {
        "Code": 15857002,
        "Display": "Ethanolamine derivative histamine receptor antagonist product"
      },
      {
        "Code": 16031005,
        "Display": "Product containing dexchlorpheniramine (medicinal product)"
      },
      {
        "Code": 16037009,
        "Display": "Product containing terfenadine (medicinal product)"
      },
      {
        "Code": 16047007,
        "Display": "Product containing benzodiazepine (product)"
      },
      {
        "Code": 16131008,
        "Display": "Product containing antivenom (product)"
      },
      {
        "Code": 16403005,
        "Display": "Non-steroidal anti-inflammatory agent"
      },
      {
        "Code": 16602005,
        "Display": "Product containing hydrocortisone (medicinal product)"
      },
      {
        "Code": 16787005,
        "Display": "Product containing Streptococcus equisimilis antiserum and Streptococcus suis antiserum (medicinal product)"
      },
      {
        "Code": 16791000,
        "Display": "Product containing cefradine (medicinal product)"
      },
      {
        "Code": 16832004,
        "Display": "Conjugated estrogens-containing product"
      },
      {
        "Code": 16858004,
        "Display": "Product containing urea (medicinal product)"
      },
      {
        "Code": 16867004,
        "Display": "Product containing sulfathiazole (medicinal product)"
      },
      {
        "Code": 16970001,
        "Display": "Product containing proguanil (medicinal product)"
      },
      {
        "Code": 16977003,
        "Display": "Product containing lithium carbonate (medicinal product)"
      },
      {
        "Code": 17308007,
        "Display": "Product containing dapsone (medicinal product)"
      },
      {
        "Code": 17386008,
        "Display": "Product containing anti-infective"
      },
      {
        "Code": 17554004,
        "Display": "Product containing paramethasone (medicinal product)"
      },
      {
        "Code": 17558001,
        "Display": "Product containing corn oil (medicinal product)"
      },
      {
        "Code": 17600005,
        "Display": "Diagnostic radioisotope"
      },
      {
        "Code": 17805003,
        "Display": "Product containing lithium citrate (medicinal product)"
      },
      {
        "Code": 17859000,
        "Display": "Product containing polyvalent crotalidae antivenom (medicinal product)"
      },
      {
        "Code": 17893001,
        "Display": "Skeletal muscle relaxant"
      },
      {
        "Code": 18002004,
        "Display": "Product containing auranofin (medicinal product)"
      },
      {
        "Code": 18125000,
        "Display": "Product containing fluocinonide (medicinal product)"
      },
      {
        "Code": 18335001,
        "Display": "Product containing plicamycin (medicinal product)"
      },
      {
        "Code": 18340009,
        "Display": "Product containing oxychlorosene (medicinal product)"
      },
      {
        "Code": 18381001,
        "Display": "Product containing pindolol (medicinal product)"
      },
      {
        "Code": 18548003,
        "Display": "Product containing methylphenidate (medicinal product)"
      },
      {
        "Code": 18679008,
        "Display": "Product containing potassium exchange resin (product)"
      },
      {
        "Code": 18811003,
        "Display": "Product containing asparaginase (medicinal product)"
      },
      {
        "Code": 18914005,
        "Display": "Product containing hydroflumethiazide (medicinal product)"
      },
      {
        "Code": 18952006,
        "Display": "Product containing econazole (medicinal product)"
      },
      {
        "Code": 19194001,
        "Display": "Product containing didanosine (medicinal product)"
      },
      {
        "Code": 19225000,
        "Display": "Product containing lorazepam (medicinal product)"
      },
      {
        "Code": 19232009,
        "Display": "Product containing prilocaine (medicinal product)"
      },
      {
        "Code": 19261005,
        "Display": "Product containing sulfinpyrazone (medicinal product)"
      },
      {
        "Code": 19403009,
        "Display": "Product containing flurazepam (medicinal product)"
      },
      {
        "Code": 19405002,
        "Display": "Product containing netilmicin (medicinal product)"
      },
      {
        "Code": 19581007,
        "Display": "Parasympathomimetic agent-containing product"
      },
      {
        "Code": 19583005,
        "Display": "Product containing diclofenamide (medicinal product)"
      },
      {
        "Code": 19630009,
        "Display": "Product containing silver sulfadiazine (medicinal product)"
      },
      {
        "Code": 19768003,
        "Display": "Product containing alkylating agent (product)"
      },
      {
        "Code": 19841008,
        "Display": "Product containing ceftriaxone (medicinal product)"
      },
      {
        "Code": 20091003,
        "Display": "Product containing somatotropin releasing factor (product)"
      },
      {
        "Code": 20201001,
        "Display": "Product containing nafoxidine (medicinal product)"
      },
      {
        "Code": 20237006,
        "Display": "Product containing dihydrotachysterol (medicinal product)"
      },
      {
        "Code": 20320002,
        "Display": "Product containing hydrocodone (medicinal product)"
      },
      {
        "Code": 20577002,
        "Display": "Product containing choriogonadotropin (medicinal product)"
      },
      {
        "Code": 20865003,
        "Display": "Product containing diflunisal (medicinal product)"
      },
      {
        "Code": 21069002,
        "Display": "Lipotropic agent"
      },
      {
        "Code": 21159006,
        "Display": "Product containing pargyline (medicinal product)"
      },
      {
        "Code": 21691008,
        "Display": "Product containing magnesium trisilicate (medicinal product)"
      },
      {
        "Code": 21701005,
        "Display": "Product containing cromoglicic acid (medicinal product)"
      },
      {
        "Code": 21767006,
        "Display": "Product containing iron dextran (medicinal product)"
      },
      {
        "Code": 21986005,
        "Display": "Product containing Erysipelothrix rhusiopathiae antiserum (medicinal product)"
      },
      {
        "Code": 22091006,
        "Display": "Product containing hormone (product)"
      },
      {
        "Code": 22198003,
        "Display": "Product containing metolazone (medicinal product)"
      },
      {
        "Code": 22274004,
        "Display": "Product containing methandriol (medicinal product)"
      },
      {
        "Code": 22474002,
        "Display": "Product containing aldosterone (medicinal product)"
      },
      {
        "Code": 22587006,
        "Display": "Product containing depolarizing neuromuscular blocker (product)"
      },
      {
        "Code": 22657006,
        "Display": "Product containing calcitonin (medicinal product)"
      },
      {
        "Code": 22672005,
        "Display": "Product containing amfetamine (medicinal product)"
      },
      {
        "Code": 22696000,
        "Display": "Product containing hydralazine (medicinal product)"
      },
      {
        "Code": 22969001,
        "Display": "Product containing oxytetracycline (medicinal product)"
      },
      {
        "Code": 23079006,
        "Display": "Product containing vincristine (medicinal product)"
      },
      {
        "Code": 23222006,
        "Display": "Product containing antiserum (product)"
      },
      {
        "Code": 23532003,
        "Display": "Product containing phenmetrazine (medicinal product)"
      },
      {
        "Code": 23827009,
        "Display": "Product containing sulfacetamide (medicinal product)"
      },
      {
        "Code": 23888001,
        "Display": "Product containing cascara (medicinal product)"
      },
      {
        "Code": 24036003,
        "Display": "Medicinal product acting as antianemic agent (product)"
      },
      {
        "Code": 24450004,
        "Display": "Product containing ethambutol (medicinal product)"
      },
      {
        "Code": 24504000,
        "Display": "Product containing methylcellulose (medicinal product)"
      },
      {
        "Code": 24866006,
        "Display": "Product containing Salmonella typhimurium antiserum (medicinal product)"
      },
      {
        "Code": 25014009,
        "Display": "Product containing tripelennamine (medicinal product)"
      },
      {
        "Code": 25076002,
        "Display": "Product containing carisoprodol (medicinal product)"
      },
      {
        "Code": 25085002,
        "Display": "Product containing cholecystokinin (medicinal product)"
      },
      {
        "Code": 25142008,
        "Display": "Product containing trilostane (medicinal product)"
      },
      {
        "Code": 25246002,
        "Display": "Product containing allopurinol (medicinal product)"
      },
      {
        "Code": 25398003,
        "Display": "Product containing ichthammol (medicinal product)"
      },
      {
        "Code": 25419009,
        "Display": "Product containing barium sulfate (medicinal product)"
      },
      {
        "Code": 25673006,
        "Display": "Product containing omeprazole (medicinal product)"
      },
      {
        "Code": 25860005,
        "Display": "Product containing terconazole (medicinal product)"
      },
      {
        "Code": 25995007,
        "Display": "Product containing triprolidine (medicinal product)"
      },
      {
        "Code": 26122009,
        "Display": "Product containing dimetindene (medicinal product)"
      },
      {
        "Code": 26124005,
        "Display": "Product containing glipizide (medicinal product)"
      },
      {
        "Code": 26244009,
        "Display": "Product containing muscarinic receptor antagonist (product)"
      },
      {
        "Code": 26303005,
        "Display": "Product containing hexestrol (medicinal product)"
      },
      {
        "Code": 26370007,
        "Display": "Hemostatic agent"
      },
      {
        "Code": 26458009,
        "Display": "Product containing diphenhydramine (medicinal product)"
      },
      {
        "Code": 26462003,
        "Display": "Product containing cyproheptadine (medicinal product)"
      },
      {
        "Code": 26503009,
        "Display": "Product containing deserpidine (medicinal product)"
      },
      {
        "Code": 26523005,
        "Display": "Product containing dobutamine (medicinal product)"
      },
      {
        "Code": 26548008,
        "Display": "Product containing pancreatic hormone (product)"
      },
      {
        "Code": 26574002,
        "Display": "Product containing droperidol (medicinal product)"
      },
      {
        "Code": 26580005,
        "Display": "Digestant"
      },
      {
        "Code": 26736008,
        "Display": "Product containing ferrous gluconate (medicinal product)"
      },
      {
        "Code": 26800000,
        "Display": "Product containing midazolam (medicinal product)"
      },
      {
        "Code": 26842003,
        "Display": "Product containing burbot liver oil (medicinal product)"
      },
      {
        "Code": 27035007,
        "Display": "Product containing heavy metal antagonist (product)"
      },
      {
        "Code": 27196008,
        "Display": "Product containing bupivacaine (medicinal product)"
      },
      {
        "Code": 27242001,
        "Display": "Product containing methylprednisolone (medicinal product)"
      },
      {
        "Code": 27479000,
        "Display": "Product containing zidovudine (medicinal product)"
      },
      {
        "Code": 27518004,
        "Display": "Parathyroid hormone agent-containing product"
      },
      {
        "Code": 27638005,
        "Display": "Product containing alteplase (medicinal product)"
      },
      {
        "Code": 27658006,
        "Display": "Product containing amoxicillin (medicinal product)"
      },
      {
        "Code": 27754002,
        "Display": "Product containing piroxicam (medicinal product)"
      },
      {
        "Code": 27867009,
        "Display": "Antineoplastic agent"
      },
      {
        "Code": 28149003,
        "Display": "Product containing pentostatin (medicinal product)"
      },
      {
        "Code": 28235004,
        "Display": "Product containing doxapram (medicinal product)"
      },
      {
        "Code": 28410007,
        "Display": "Product containing alpha-carboxypenicillin (product)"
      },
      {
        "Code": 28415002,
        "Display": "Product containing methscopolamine (medicinal product)"
      },
      {
        "Code": 28426008,
        "Display": "Product containing fluocinolone (medicinal product)"
      },
      {
        "Code": 28506006,
        "Display": "Product containing flucytosine (medicinal product)"
      },
      {
        "Code": 28748001,
        "Display": "Product containing chloral hydrate (medicinal product)"
      },
      {
        "Code": 28841002,
        "Display": "Product containing ethisterone (medicinal product)"
      },
      {
        "Code": 28906000,
        "Display": "Product containing percoid liver oil (medicinal product)"
      },
      {
        "Code": 29058003,
        "Display": "Product containing halcinonide (medicinal product)"
      },
      {
        "Code": 29089004,
        "Display": "Product containing mitobronitol (medicinal product)"
      },
      {
        "Code": 29121001,
        "Display": "Product containing mersalyl (medicinal product)"
      },
      {
        "Code": 29129004,
        "Display": "Product containing oxymetazoline (medicinal product)"
      },
      {
        "Code": 29156002,
        "Display": "Mechlorethamine-containing product"
      },
      {
        "Code": 29175007,
        "Display": "Product containing rifampicin (medicinal product)"
      },
      {
        "Code": 29439004,
        "Display": "Product containing captopril (medicinal product)"
      },
      {
        "Code": 29620001,
        "Display": "Product containing beta tocopherol (medicinal product)"
      },
      {
        "Code": 29840005,
        "Display": "Product containing amoxapine (medicinal product)"
      },
      {
        "Code": 29877002,
        "Display": "Product containing isocarboxazid (medicinal product)"
      },
      {
        "Code": 29896003,
        "Display": "Product containing betamethasone (medicinal product)"
      },
      {
        "Code": 30010009,
        "Display": "Product containing cyanocobalamin (medicinal product)"
      },
      {
        "Code": 30125007,
        "Display": "Product containing senna (medicinal product)"
      },
      {
        "Code": 30306003,
        "Display": "Product containing thiamine (medicinal product)"
      },
      {
        "Code": 30317002,
        "Display": "Product containing cisapride (medicinal product)"
      },
      {
        "Code": 30427009,
        "Display": "Product containing erythromycin (medicinal product)"
      },
      {
        "Code": 30466001,
        "Display": "Product containing clomifene (medicinal product)"
      },
      {
        "Code": 30492008,
        "Display": "Medicinal product acting as diuretic (product)"
      },
      {
        "Code": 30729008,
        "Display": "Product containing iron (medicinal product)"
      },
      {
        "Code": 30761007,
        "Display": "Product containing mannitol (medicinal product)"
      },
      {
        "Code": 30964009,
        "Display": "Product containing methyprylon (medicinal product)"
      },
      {
        "Code": 30988006,
        "Display": "Product containing dienestrol (medicinal product)"
      },
      {
        "Code": 31087008,
        "Display": "Product containing ampicillin (medicinal product)"
      },
      {
        "Code": 31231007,
        "Display": "Product containing hydrogen peroxide (medicinal product)"
      },
      {
        "Code": 31305008,
        "Display": "Product containing Streptococcus equisimilis antiserum (medicinal product)"
      },
      {
        "Code": 31306009,
        "Display": "Product containing quinidine (medicinal product)"
      },
      {
        "Code": 31684002,
        "Display": "Product containing buprenorphine (medicinal product)"
      },
      {
        "Code": 31690003,
        "Display": "Product containing bethanechol (medicinal product)"
      },
      {
        "Code": 31692006,
        "Display": "Product containing pentamidine (medicinal product)"
      },
      {
        "Code": 31865003,
        "Display": "Product containing fluconazole (medicinal product)"
      },
      {
        "Code": 31872002,
        "Display": "Product containing pramocaine (medicinal product)"
      },
      {
        "Code": 32249005,
        "Display": "Product containing antiviral (product)"
      },
      {
        "Code": 32313007,
        "Display": "Product containing enflurane (medicinal product)"
      },
      {
        "Code": 32462006,
        "Display": "Product containing melanocyte stimulating hormone releasing factor (product)"
      },
      {
        "Code": 32474005,
        "Display": "Product containing probucol (medicinal product)"
      },
      {
        "Code": 32583002,
        "Display": "Medicinal product acting as antiseborrheic agent (product)"
      },
      {
        "Code": 32647002,
        "Display": "Product containing ergotamine (medicinal product)"
      },
      {
        "Code": 32653002,
        "Display": "Product containing ergosterol (medicinal product)"
      },
      {
        "Code": 32792001,
        "Display": "Product containing trimethoprim (medicinal product)"
      },
      {
        "Code": 32823007,
        "Display": "Product containing maprotiline (medicinal product)"
      },
      {
        "Code": 32955006,
        "Display": "Product containing domperidone (medicinal product)"
      },
      {
        "Code": 32960005,
        "Display": "Product containing thiosalicylate (medicinal product)"
      },
      {
        "Code": 33124007,
        "Display": "Product containing tolbutamide (medicinal product)"
      },
      {
        "Code": 33219003,
        "Display": "Tricyclic antidepressant"
      },
      {
        "Code": 33231001,
        "Display": "Product containing pentobarbital (medicinal product)"
      },
      {
        "Code": 33252009,
        "Display": "Product containing beta adrenergic receptor antagonist (product)"
      },
      {
        "Code": 33378002,
        "Display": "Product containing desipramine (medicinal product)"
      },
      {
        "Code": 33588000,
        "Display": "Product containing thioridazine (medicinal product)"
      },
      {
        "Code": 33589008,
        "Display": "Product containing glycoside (product)"
      },
      {
        "Code": 33664007,
        "Display": "Product containing acetazolamide (medicinal product)"
      },
      {
        "Code": 33675006,
        "Display": "Product containing carbachol (medicinal product)"
      },
      {
        "Code": 33682005,
        "Display": "Medicinal product acting as mydriatic (product)"
      },
      {
        "Code": 33815001,
        "Display": "Product containing Streptococcus suis antiserum (medicinal product)"
      },
      {
        "Code": 34012005,
        "Display": "Product containing sulfonylurea (product)"
      },
      {
        "Code": 34217006,
        "Display": "Product containing oxyquinoline (medicinal product)"
      },
      {
        "Code": 34364009,
        "Display": "Product containing mefenamic acid (medicinal product)"
      },
      {
        "Code": 34393009,
        "Display": "Product containing tolazamide (medicinal product)"
      },
      {
        "Code": 34462007,
        "Display": "Product containing natamycin (medicinal product)"
      },
      {
        "Code": 34599009,
        "Display": "Product containing thyroglobulin (medicinal product)"
      },
      {
        "Code": 34693000,
        "Display": "Product containing zalcitabine (medicinal product)"
      },
      {
        "Code": 34731007,
        "Display": "Product containing carbenicillin (medicinal product)"
      },
      {
        "Code": 34816007,
        "Display": "Product containing cod liver oil (medicinal product)"
      },
      {
        "Code": 34833000,
        "Display": "Product containing hydrocortisone in ocular dose form (medicinal product form)"
      },
      {
        "Code": 34929006,
        "Display": "Product containing benzethonium (medicinal product)"
      },
      {
        "Code": 35035001,
        "Display": "Product containing orphenadrine (medicinal product)"
      },
      {
        "Code": 35063004,
        "Display": "Product containing ribavirin (medicinal product)"
      },
      {
        "Code": 35282000,
        "Display": "Product containing gemfibrozil (medicinal product)"
      },
      {
        "Code": 35300007,
        "Display": "Product containing daunorubicin (medicinal product)"
      },
      {
        "Code": 35324004,
        "Display": "Product containing paraldehyde (medicinal product)"
      },
      {
        "Code": 35392005,
        "Display": "Product containing calcium exchange resin (product)"
      },
      {
        "Code": 35476001,
        "Display": "Product containing silver nitrate (medicinal product)"
      },
      {
        "Code": 35531004,
        "Display": "Product containing hydrocortamate (medicinal product)"
      },
      {
        "Code": 35768004,
        "Display": "Product containing oxybutynin (medicinal product)"
      },
      {
        "Code": 35967000,
        "Display": "Product containing medazepam (medicinal product)"
      },
      {
        "Code": 36068003,
        "Display": "Product containing pyrantel (medicinal product)"
      },
      {
        "Code": 36113004,
        "Display": "Product containing imipramine (medicinal product)"
      },
      {
        "Code": 36218003,
        "Display": "Product containing thiethylperazine (medicinal product)"
      },
      {
        "Code": 36236003,
        "Display": "Medicinal product acting as antidepressant agent (product)"
      },
      {
        "Code": 36391008,
        "Display": "Product containing primaquine (medicinal product)"
      },
      {
        "Code": 36537006,
        "Display": "Product containing ambenonium (medicinal product)"
      },
      {
        "Code": 36594001,
        "Display": "Product containing tiabendazole (medicinal product)"
      },
      {
        "Code": 36621009,
        "Display": "Product containing medroxyprogesterone (medicinal product)"
      },
      {
        "Code": 36642006,
        "Display": "Product containing propantheline (medicinal product)"
      },
      {
        "Code": 36893000,
        "Display": "Product containing ceftazidime (medicinal product)"
      },
      {
        "Code": 36909007,
        "Display": "Product containing phenindamine (medicinal product)"
      },
      {
        "Code": 37084008,
        "Display": "Product containing quinolone and antibiotic"
      },
      {
        "Code": 37306000,
        "Display": "Product containing vidarabine (medicinal product)"
      },
      {
        "Code": 37400007,
        "Display": "Product containing magnesium sulfate (medicinal product)"
      },
      {
        "Code": 37628007,
        "Display": "Product containing cefalotin (medicinal product)"
      },
      {
        "Code": 37803001,
        "Display": "Product containing tubocurarine (medicinal product)"
      },
      {
        "Code": 38076006,
        "Display": "Product containing thyroxine (medicinal product)"
      },
      {
        "Code": 38166006,
        "Display": "Product containing tolnaftate (medicinal product)"
      },
      {
        "Code": 38231004,
        "Display": "Product containing polysaccharide-iron complex (medicinal product)"
      },
      {
        "Code": 38268001,
        "Display": "Product containing ibuprofen (medicinal product)"
      },
      {
        "Code": 38314008,
        "Display": "Product containing isotretinoin (medicinal product)"
      },
      {
        "Code": 38413003,
        "Display": "Product manufactured as otic dose form (product)"
      },
      {
        "Code": 38578004,
        "Display": "Product containing megestrol (medicinal product)"
      },
      {
        "Code": 38900001,
        "Display": "Proliferant agent"
      },
      {
        "Code": 39064002,
        "Display": "Product containing acetohexamide (medicinal product)"
      },
      {
        "Code": 39124003,
        "Display": "Product containing methohexital (medicinal product)"
      },
      {
        "Code": 39128000,
        "Display": "Product containing famotidine (medicinal product)"
      },
      {
        "Code": 39142008,
        "Display": "Product containing phendimetrazine (medicinal product)"
      },
      {
        "Code": 39252001,
        "Display": "Water balance agent"
      },
      {
        "Code": 39359008,
        "Display": "Phenoxymethylpenicillin-containing product"
      },
      {
        "Code": 39487003,
        "Display": "Insulin-containing product"
      },
      {
        "Code": 39516004,
        "Display": "Product containing disulfiram (medicinal product)"
      },
      {
        "Code": 39608003,
        "Display": "Product containing pentazocine (medicinal product)"
      },
      {
        "Code": 39707000,
        "Display": "Product containing para-aminobenzoic acid (medicinal product)"
      },
      {
        "Code": 39860005,
        "Display": "Product containing fructose (medicinal product)"
      },
      {
        "Code": 39939003,
        "Display": "Product containing phenyltoloxamine (medicinal product)"
      },
      {
        "Code": 40232005,
        "Display": "Product containing ketoconazole (medicinal product)"
      },
      {
        "Code": 40339003,
        "Display": "Product containing calcium lactate (medicinal product)"
      },
      {
        "Code": 40429005,
        "Display": "Product containing etomidate (medicinal product)"
      },
      {
        "Code": 40430000,
        "Display": "Product containing bromelains (medicinal product)"
      },
      {
        "Code": 40556005,
        "Display": "Product containing phenytoin (medicinal product)"
      },
      {
        "Code": 40562000,
        "Display": "Product containing methylergometrine (medicinal product)"
      },
      {
        "Code": 40589005,
        "Display": "Product containing amitriptyline (medicinal product)"
      },
      {
        "Code": 40648001,
        "Display": "Product containing fentanyl (medicinal product)"
      },
      {
        "Code": 40820003,
        "Display": "Product containing carbamazepine (medicinal product)"
      },
      {
        "Code": 40877002,
        "Display": "Product containing streptomycin (medicinal product)"
      },
      {
        "Code": 40905005,
        "Display": "Product containing beractant (medicinal product)"
      },
      {
        "Code": 40974005,
        "Display": "Product containing dipipanone (medicinal product)"
      },
      {
        "Code": 40999006,
        "Display": "Product containing lomustine (medicinal product)"
      },
      {
        "Code": 41001009,
        "Display": "Product containing dinoprost (medicinal product)"
      },
      {
        "Code": 41015006,
        "Display": "Product containing metaraminol (medicinal product)"
      },
      {
        "Code": 41147003,
        "Display": "Product containing perphenazine (medicinal product)"
      },
      {
        "Code": 41193000,
        "Display": "Product containing aciclovir (medicinal product)"
      },
      {
        "Code": 41324009,
        "Display": "Product containing propiomazine (medicinal product)"
      },
      {
        "Code": 41365009,
        "Display": "Product containing fluphenazine (medicinal product)"
      },
      {
        "Code": 41367001,
        "Display": "Product containing enterogastrone (medicinal product)"
      },
      {
        "Code": 41399007,
        "Display": "Product containing oxazolidinedione"
      },
      {
        "Code": 41470001,
        "Display": "Product containing corbadrine (medicinal product)"
      },
      {
        "Code": 41493007,
        "Display": "Product containing dicycloverine (medicinal product)"
      },
      {
        "Code": 41549009,
        "Display": "Product containing angiotensin-converting enzyme inhibitor (product)"
      },
      {
        "Code": 41985001,
        "Display": "Product containing bitolterol (medicinal product)"
      },
      {
        "Code": 42082003,
        "Display": "Product containing vancomycin (medicinal product)"
      },
      {
        "Code": 42098005,
        "Display": "Product containing dexamethasone in ocular dose form (medicinal product form)"
      },
      {
        "Code": 42271003,
        "Display": "Product containing glutamic acid (medicinal product)"
      },
      {
        "Code": 42348003,
        "Display": "Product containing methyltestosterone (medicinal product)"
      },
      {
        "Code": 42444000,
        "Display": "Product containing secobarbital (medicinal product)"
      },
      {
        "Code": 42514000,
        "Display": "Product containing procaine (medicinal product)"
      },
      {
        "Code": 42638008,
        "Display": "Product containing methylrosanilinium chloride (medicinal product)"
      },
      {
        "Code": 42714002,
        "Display": "Product containing Escherichia coli antiserum (medicinal product)"
      },
      {
        "Code": 42720001,
        "Display": "Product containing miconazole (medicinal product)"
      },
      {
        "Code": 43343000,
        "Display": "Product containing magaldrate (medicinal product)"
      },
      {
        "Code": 43533002,
        "Display": "Product containing chloramphenicol in ocular dose form (medicinal product form)"
      },
      {
        "Code": 43684009,
        "Display": "Product containing misoprostol (medicinal product)"
      },
      {
        "Code": 43753001,
        "Display": "Product containing dydrogesterone (medicinal product)"
      },
      {
        "Code": 43879000,
        "Display": "Product containing flunisolide (medicinal product)"
      },
      {
        "Code": 43927002,
        "Display": "Analeptic agent"
      },
      {
        "Code": 44175000,
        "Display": "Product containing diperodon (medicinal product)"
      },
      {
        "Code": 44418001,
        "Display": "Product containing percomorph liver oil (medicinal product)"
      },
      {
        "Code": 44658005,
        "Display": "Product containing promazine (medicinal product)"
      },
      {
        "Code": 44731005,
        "Display": "Hydrocortisone-containing product in otic dose form"
      },
      {
        "Code": 44790008,
        "Display": "Product containing ethosuximide (medicinal product)"
      },
      {
        "Code": 44798001,
        "Display": "Product containing dinoprostone (medicinal product)"
      },
      {
        "Code": 44938006,
        "Display": "Product containing cefoperazone (medicinal product)"
      },
      {
        "Code": 44990002,
        "Display": "Product containing procyclidine (medicinal product)"
      },
      {
        "Code": 45218006,
        "Display": "Product containing clemastine (medicinal product)"
      },
      {
        "Code": 45311002,
        "Display": "Product containing terbutaline (medicinal product)"
      },
      {
        "Code": 45313004,
        "Display": "Product containing propylpiperazine derivative of phenothiazine (product)"
      },
      {
        "Code": 45680002,
        "Display": "Product containing tolmetin (medicinal product)"
      },
      {
        "Code": 45844004,
        "Display": "Product containing sulfasalazine (medicinal product)"
      },
      {
        "Code": 45888006,
        "Display": "Product containing gamma tocopherol (medicinal product)"
      },
      {
        "Code": 46009007,
        "Display": "Product containing chlorambucil (medicinal product)"
      },
      {
        "Code": 46063005,
        "Display": "Psychotherapeutic agent"
      },
      {
        "Code": 46123006,
        "Display": "Product containing ascorbic acid (medicinal product)"
      },
      {
        "Code": 46436003,
        "Display": "Product containing haloprogin (medicinal product)"
      },
      {
        "Code": 46479001,
        "Display": "Product containing encainide (medicinal product)"
      },
      {
        "Code": 46532003,
        "Display": "Product containing brilliant green (medicinal product)"
      },
      {
        "Code": 46547007,
        "Display": "Product containing labetalol (medicinal product)"
      },
      {
        "Code": 46576005,
        "Display": "Product containing flecainide (medicinal product)"
      },
      {
        "Code": 46709004,
        "Display": "Product containing methylphenobarbital (medicinal product)"
      },
      {
        "Code": 46741005,
        "Display": "Product containing salicylic acid (medicinal product)"
      },
      {
        "Code": 46913003,
        "Display": "Product containing edrophonium (medicinal product)"
      },
      {
        "Code": 47065008,
        "Display": "Product containing quinine (medicinal product)"
      },
      {
        "Code": 47120002,
        "Display": "Product containing primidone (medicinal product)"
      },
      {
        "Code": 47124006,
        "Display": "Product containing aminoglutethimide (medicinal product)"
      },
      {
        "Code": 47140009,
        "Display": "Product containing medrysone (medicinal product)"
      },
      {
        "Code": 47331002,
        "Display": "Product containing chlorpromazine (medicinal product)"
      },
      {
        "Code": 47527007,
        "Display": "Product containing phenindione (medicinal product)"
      },
      {
        "Code": 47602007,
        "Display": "Product containing nalidixic acid (medicinal product)"
      },
      {
        "Code": 47898004,
        "Display": "Product containing verapamil (medicinal product)"
      },
      {
        "Code": 48174005,
        "Display": "Product containing ranitidine (medicinal product)"
      },
      {
        "Code": 48256008,
        "Display": "Product containing benzyl benzoate (medicinal product)"
      },
      {
        "Code": 48279009,
        "Display": "Emollient product"
      },
      {
        "Code": 48351000,
        "Display": "Product containing phenylbutazone (medicinal product)"
      },
      {
        "Code": 48546005,
        "Display": "Product containing diazepam (medicinal product)"
      },
      {
        "Code": 48603004,
        "Display": "Product containing warfarin (medicinal product)"
      },
      {
        "Code": 48614001,
        "Display": "Product containing clobetasol (medicinal product)"
      },
      {
        "Code": 48647005,
        "Display": "Product containing pancrelipase (medicinal product)"
      },
      {
        "Code": 48698004,
        "Display": "Product containing calcium channel blocker (product)"
      },
      {
        "Code": 48836000,
        "Display": "Product containing amikacin (medicinal product)"
      },
      {
        "Code": 48875009,
        "Display": "Product containing dihydroergotamine (medicinal product)"
      },
      {
        "Code": 48899009,
        "Display": "Product containing hyoscyamine (medicinal product)"
      },
      {
        "Code": 49019002,
        "Display": "Product containing prednisolone in ocular dose form (medicinal product form)"
      },
      {
        "Code": 49157004,
        "Display": "Uricosuric agent"
      },
      {
        "Code": 49267000,
        "Display": "Product containing oxyphenbutazone (medicinal product)"
      },
      {
        "Code": 49299006,
        "Display": "Product containing protriptyline (medicinal product)"
      },
      {
        "Code": 49485009,
        "Display": "Product containing norfloxacin (medicinal product)"
      },
      {
        "Code": 49577002,
        "Display": "Product containing minoxidil (medicinal product)"
      },
      {
        "Code": 49617001,
        "Display": "Product containing carbenoxolone (medicinal product)"
      },
      {
        "Code": 49669006,
        "Display": "Product containing Escherichia coli antiserum and Pasteurella multocida antiserum and Salmonella typhimurium antiserum (medicinal product)"
      },
      {
        "Code": 49688004,
        "Display": "Product containing hexocyclium (medicinal product)"
      },
      {
        "Code": 49694007,
        "Display": "Mucolytic agent"
      },
      {
        "Code": 49705006,
        "Display": "Product containing idoxuridine (medicinal product)"
      },
      {
        "Code": 49802003,
        "Display": "Product containing blood group antibody D (medicinal product)"
      },
      {
        "Code": 49953001,
        "Display": "Product containing pheniramine (medicinal product)"
      },
      {
        "Code": 50094009,
        "Display": "Product containing hetastarch (medicinal product)"
      },
      {
        "Code": 50256004,
        "Display": "Product containing antitrichomonal (product)"
      },
      {
        "Code": 50318003,
        "Display": "Product containing progesterone (medicinal product)"
      },
      {
        "Code": 50335004,
        "Display": "Product containing levorphanol (medicinal product)"
      },
      {
        "Code": 50520001,
        "Display": "Product containing framycetin (medicinal product)"
      },
      {
        "Code": 50841004,
        "Display": "Product containing chloramphenicol in otic dose form (medicinal product form)"
      },
      {
        "Code": 50868004,
        "Display": "Product containing dexamfetamine (medicinal product)"
      },
      {
        "Code": 51013009,
        "Display": "Product containing sulfadimethoxine (medicinal product)"
      },
      {
        "Code": 51073002,
        "Display": "Product containing phenobarbital (medicinal product)"
      },
      {
        "Code": 51126006,
        "Display": "Product containing benzestrol (medicinal product)"
      },
      {
        "Code": 51132001,
        "Display": "Product containing hyaluronidase (medicinal product)"
      },
      {
        "Code": 51326002,
        "Display": "Product containing carmustine (medicinal product)"
      },
      {
        "Code": 51334008,
        "Display": "Product containing cycloserine (medicinal product)"
      },
      {
        "Code": 51361008,
        "Display": "Product containing amantadine (medicinal product)"
      },
      {
        "Code": 51752005,
        "Display": "Product containing dehydrocholic acid (medicinal product)"
      },
      {
        "Code": 51758009,
        "Display": "Product containing methadone (medicinal product)"
      },
      {
        "Code": 51779009,
        "Display": "Product containing cephalosporin and antibiotic (product)"
      },
      {
        "Code": 51908007,
        "Display": "Product containing prenylamine (medicinal product)"
      },
      {
        "Code": 51992002,
        "Display": "Product containing gastrin (medicinal product)"
      },
      {
        "Code": 52017007,
        "Display": "Medicinal product acting as antiemetic agent (product)"
      },
      {
        "Code": 52108005,
        "Display": "Product containing ferrous fumarate (medicinal product)"
      },
      {
        "Code": 52215008,
        "Display": "Product containing desonide (medicinal product)"
      },
      {
        "Code": 52388000,
        "Display": "Product containing prednisolone (medicinal product)"
      },
      {
        "Code": 52423008,
        "Display": "Product containing tar (medicinal product)"
      },
      {
        "Code": 52883001,
        "Display": "Product containing hydroxyamfetamine (medicinal product)"
      },
      {
        "Code": 52896000,
        "Display": "Product containing clioquinol (medicinal product)"
      },
      {
        "Code": 53009005,
        "Display": "Medicinal product acting as analgesic agent (product)"
      },
      {
        "Code": 53480001,
        "Display": "Product containing phentermine (medicinal product)"
      },
      {
        "Code": 53584007,
        "Display": "Product containing methacholine (medicinal product)"
      },
      {
        "Code": 53640004,
        "Display": "Product containing fluoxetine (medicinal product)"
      },
      {
        "Code": 53641000,
        "Display": "Product containing flavoxate (medicinal product)"
      },
      {
        "Code": 53691001,
        "Display": "Product containing calcium gluconate (medicinal product)"
      },
      {
        "Code": 53793005,
        "Display": "Product containing Escherichia coli antibody (medicinal product)"
      },
      {
        "Code": 53800008,
        "Display": "Product containing dithranol (medicinal product)"
      },
      {
        "Code": 53848009,
        "Display": "Product containing metyrapone (medicinal product)"
      },
      {
        "Code": 54142000,
        "Display": "Product containing domiphen (medicinal product)"
      },
      {
        "Code": 54344006,
        "Display": "Product containing flurbiprofen (medicinal product)"
      },
      {
        "Code": 54391004,
        "Display": "Product containing levamisole (medicinal product)"
      },
      {
        "Code": 54406003,
        "Display": "Product containing methoxamine (medicinal product)"
      },
      {
        "Code": 54541002,
        "Display": "Product containing ergometrine (medicinal product)"
      },
      {
        "Code": 54544005,
        "Display": "Product containing pethidine (medicinal product)"
      },
      {
        "Code": 54577009,
        "Display": "Product containing ceftizoxime (medicinal product)"
      },
      {
        "Code": 54705000,
        "Display": "Product containing temazepam (medicinal product)"
      },
      {
        "Code": 54765002,
        "Display": "Product containing phenylephrine (medicinal product)"
      },
      {
        "Code": 54824008,
        "Display": "Product containing isometheptene (medicinal product)"
      },
      {
        "Code": 54882005,
        "Display": "Product containing amfepramone (medicinal product)"
      },
      {
        "Code": 54887004,
        "Display": "Product containing cefalexin (medicinal product)"
      },
      {
        "Code": 54972005,
        "Display": "Product containing tretinoin (medicinal product)"
      },
      {
        "Code": 54982006,
        "Display": "Product containing promethestrol (medicinal product)"
      },
      {
        "Code": 55015008,
        "Display": "Product containing sodium lactate (medicinal product)"
      },
      {
        "Code": 55217007,
        "Display": "Product containing calcium carbonate (medicinal product)"
      },
      {
        "Code": 55432002,
        "Display": "Product containing azlocillin (medicinal product)"
      },
      {
        "Code": 55556000,
        "Display": "Product containing tetracaine (medicinal product)"
      },
      {
        "Code": 55673009,
        "Display": "Product containing sodium iothalamate (125-I) (medicinal product)"
      },
      {
        "Code": 55745002,
        "Display": "Product containing propranolol (medicinal product)"
      },
      {
        "Code": 55784007,
        "Display": "Natural hormone preparation"
      },
      {
        "Code": 55830003,
        "Display": "Product containing human menopausal gonadotropin (medicinal product)"
      },
      {
        "Code": 55867006,
        "Display": "Product containing aminophylline (medicinal product)"
      },
      {
        "Code": 55889005,
        "Display": "Product containing praziquantel (medicinal product)"
      },
      {
        "Code": 56014002,
        "Display": "Product containing hydroxyprogesterone (medicinal product)"
      },
      {
        "Code": 56032002,
        "Display": "Product containing dihydrotestosterone (medicinal product)"
      },
      {
        "Code": 56059005,
        "Display": "Product containing mebendazole (medicinal product)"
      },
      {
        "Code": 56123002,
        "Display": "Product containing methenamine (medicinal product)"
      },
      {
        "Code": 56230001,
        "Display": "Product containing bretylium (medicinal product)"
      },
      {
        "Code": 56234005,
        "Display": "Product containing somatotropin (medicinal product)"
      },
      {
        "Code": 56480005,
        "Display": "Product containing brompheniramine (medicinal product)"
      },
      {
        "Code": 56549003,
        "Display": "Product containing metoclopramide (medicinal product)"
      },
      {
        "Code": 56602009,
        "Display": "Product containing hydroxycarbamide (medicinal product)"
      },
      {
        "Code": 56615000,
        "Display": "Product containing polyestradiol phosphate (medicinal product)"
      },
      {
        "Code": 56928005,
        "Display": "Product containing etoposide (medicinal product)"
      },
      {
        "Code": 56934003,
        "Display": "Product containing povidone (medicinal product)"
      },
      {
        "Code": 57002000,
        "Display": "Product containing chlorprothixene (medicinal product)"
      },
      {
        "Code": 57066004,
        "Display": "Product containing cisplatin (medicinal product)"
      },
      {
        "Code": 57191001,
        "Display": "Product containing chloramphenicol (medicinal product)"
      },
      {
        "Code": 57263002,
        "Display": "Product containing oxiconazole (medicinal product)"
      },
      {
        "Code": 57376006,
        "Display": "Product containing sodium bicarbonate (medicinal product)"
      },
      {
        "Code": 57538001,
        "Display": "Product containing chlortetracycline (medicinal product)"
      },
      {
        "Code": 57616006,
        "Display": "Product containing sodium tetradecyl sulfate (medicinal product)"
      },
      {
        "Code": 57670008,
        "Display": "Product containing cefoxitin (medicinal product)"
      },
      {
        "Code": 57752001,
        "Display": "Product containing gentamicin (medicinal product)"
      },
      {
        "Code": 57811004,
        "Display": "Product containing dihydrocodeine (medicinal product)"
      },
      {
        "Code": 57819002,
        "Display": "Product containing somatostatin (medicinal product)"
      },
      {
        "Code": 57845006,
        "Display": "Product containing isoprenaline (medicinal product)"
      },
      {
        "Code": 57853003,
        "Display": "Product containing clidinium (medicinal product)"
      },
      {
        "Code": 57893000,
        "Display": "Product containing chlortalidone (medicinal product)"
      },
      {
        "Code": 57952007,
        "Display": "Antilipemic agent"
      },
      {
        "Code": 58050004,
        "Display": "Antiparkinson agent"
      },
      {
        "Code": 58360000,
        "Display": "Product containing phenazocine (medicinal product)"
      },
      {
        "Code": 58467001,
        "Display": "Product containing papaverine (medicinal product)"
      },
      {
        "Code": 58502006,
        "Display": "Product containing propylamine derivative and histamine receptor antagonist (product)"
      },
      {
        "Code": 58760003,
        "Display": "Product containing antimetabolite (product)"
      },
      {
        "Code": 58805000,
        "Display": "Product containing pituitary hormone (product)"
      },
      {
        "Code": 58883005,
        "Display": "Product containing clindamycin (medicinal product)"
      },
      {
        "Code": 58892008,
        "Display": "Product containing trifluridine (medicinal product)"
      },
      {
        "Code": 58905004,
        "Display": "Product containing diazoxide (medicinal product)"
      },
      {
        "Code": 58944007,
        "Display": "Medicinal product acting as vasodilator (product)"
      },
      {
        "Code": 59057006,
        "Display": "Product containing antihemophilic factor agent (medicinal product)"
      },
      {
        "Code": 59187003,
        "Display": "Product containing dopamine (medicinal product)"
      },
      {
        "Code": 59240002,
        "Display": "Product containing mitomycin (medicinal product)"
      },
      {
        "Code": 59255006,
        "Display": "Product containing sulfonamide and antibiotic (product)"
      },
      {
        "Code": 59270007,
        "Display": "Product containing loxapine (medicinal product)"
      },
      {
        "Code": 59456005,
        "Display": "Product containing astemizole (medicinal product)"
      },
      {
        "Code": 59589008,
        "Display": "Product containing pyrimethamine (medicinal product)"
      },
      {
        "Code": 59594008,
        "Display": "Product containing nondepolarizing neuromuscular blocker"
      },
      {
        "Code": 59751001,
        "Display": "Antitussive agent"
      },
      {
        "Code": 59941008,
        "Display": "Product containing diltiazem (medicinal product)"
      },
      {
        "Code": 59953007,
        "Display": "Product containing pyridostigmine (medicinal product)"
      },
      {
        "Code": 60149003,
        "Display": "Product containing indometacin (medicinal product)"
      },
      {
        "Code": 60169008,
        "Display": "Medicinal product acting as antacid agent (product)"
      },
      {
        "Code": 60468008,
        "Display": "Product containing magnesium hydroxide (medicinal product)"
      },
      {
        "Code": 60533005,
        "Display": "Medicinal product acting as astringent (product)"
      },
      {
        "Code": 60541005,
        "Display": "Product containing lanatoside C (medicinal product)"
      },
      {
        "Code": 60682004,
        "Display": "Product containing ecothiopate (medicinal product)"
      },
      {
        "Code": 60731009,
        "Display": "Product containing diethylcarbamazine (medicinal product)"
      },
      {
        "Code": 60881009,
        "Display": "Product containing diamorphine (medicinal product)"
      },
      {
        "Code": 60978003,
        "Display": "Product containing barbiturate (product)"
      },
      {
        "Code": 61020000,
        "Display": "Product containing thyroid hormone (medicinal product)"
      },
      {
        "Code": 61093008,
        "Display": "Product containing prolactin inhibiting factor (medicinal product)"
      },
      {
        "Code": 61132004,
        "Display": "Product containing gas gangrene antitoxin (medicinal product)"
      },
      {
        "Code": 61181002,
        "Display": "Product containing meprednisone (medicinal product)"
      },
      {
        "Code": 61408004,
        "Display": "Product containing molindone (medicinal product)"
      },
      {
        "Code": 61457001,
        "Display": "Product containing adrenal hormone (product)"
      },
      {
        "Code": 61621000,
        "Display": "Medicinal product acting as laxative (product)"
      },
      {
        "Code": 61623002,
        "Display": "Product containing buclizine (medicinal product)"
      },
      {
        "Code": 61651006,
        "Display": "Product containing cefamandole (medicinal product)"
      },
      {
        "Code": 61862008,
        "Display": "Product containing meticillin (medicinal product)"
      },
      {
        "Code": 61946003,
        "Display": "Product containing estrogen (product)"
      },
      {
        "Code": 62051009,
        "Display": "Product containing dichlorisone (medicinal product)"
      },
      {
        "Code": 62288001,
        "Display": "Product containing anthelmintic (product)"
      },
      {
        "Code": 62294009,
        "Display": "Varicella-zoster virus antibody-containing product"
      },
      {
        "Code": 62529008,
        "Display": "Product containing tiotixene (medicinal product)"
      },
      {
        "Code": 62560008,
        "Display": "Product containing fluorometholone in ocular dose form (medicinal product form)"
      },
      {
        "Code": 62782004,
        "Display": "Product containing clonidine (medicinal product)"
      },
      {
        "Code": 63094006,
        "Display": "Medicinal product acting as anticonvulsant agent (product)"
      },
      {
        "Code": 63136007,
        "Display": "Product containing phytomenadione (medicinal product)"
      },
      {
        "Code": 63318000,
        "Display": "Product containing benzoic acid (medicinal product)"
      },
      {
        "Code": 63470003,
        "Display": "Product containing fluoxymesterone (medicinal product)"
      },
      {
        "Code": 63639004,
        "Display": "Product containing nicotinic acid (medicinal product)"
      },
      {
        "Code": 63682003,
        "Display": "Product containing halothane (medicinal product)"
      },
      {
        "Code": 63758001,
        "Display": "Product containing norethisterone (medicinal product)"
      },
      {
        "Code": 63822004,
        "Display": "Product containing vitamin E and vitamin E derivative (product)"
      },
      {
        "Code": 64083002,
        "Display": "Genitourinary smooth muscle relaxant"
      },
      {
        "Code": 64115004,
        "Display": "Product containing amodiaquine (medicinal product)"
      },
      {
        "Code": 64127001,
        "Display": "Product containing dactinomycin (medicinal product)"
      },
      {
        "Code": 64240003,
        "Display": "Product containing methandrostenolone (medicinal product)"
      },
      {
        "Code": 64349004,
        "Display": "Product containing griseofulvin (medicinal product)"
      },
      {
        "Code": 64462001,
        "Display": "Product containing terpin (medicinal product)"
      },
      {
        "Code": 64558005,
        "Display": "Methixene-containing product"
      },
      {
        "Code": 64851009,
        "Display": "Product containing diiodohydroxyquinoline (medicinal product)"
      },
      {
        "Code": 64878006,
        "Display": "Product containing methylthiouracil (medicinal product)"
      },
      {
        "Code": 65020006,
        "Display": "Product containing benzocaine (medicinal product)"
      },
      {
        "Code": 65026000,
        "Display": "Product containing ephedrine (medicinal product)"
      },
      {
        "Code": 65041000,
        "Display": "Product containing biperiden (medicinal product)"
      },
      {
        "Code": 65092008,
        "Display": "Product containing chloropyrilene (medicinal product)"
      },
      {
        "Code": 65484006,
        "Display": "Product containing prostacyclin PGI2 (product)"
      },
      {
        "Code": 65502005,
        "Display": "Product containing epinephrine (medicinal product)"
      },
      {
        "Code": 65505007,
        "Display": "Gastrointestinal smooth muscle relaxant"
      },
      {
        "Code": 65627005,
        "Display": "Product containing vitamin K5 (medicinal product)"
      },
      {
        "Code": 65823007,
        "Display": "Protective agent"
      },
      {
        "Code": 65884003,
        "Display": "Product containing dantron (medicinal product)"
      },
      {
        "Code": 65965000,
        "Display": "Product containing Micrurus fulvius antivenom (medicinal product)"
      },
      {
        "Code": 66094001,
        "Display": "Product containing probenecid (medicinal product)"
      },
      {
        "Code": 66125007,
        "Display": "Product containing flunisolide in nasal dose form (medicinal product form)"
      },
      {
        "Code": 66261008,
        "Display": "Product containing tetracycline (medicinal product)"
      },
      {
        "Code": 66349002,
        "Display": "Product containing androgen receptor agonist (product)"
      },
      {
        "Code": 66441000,
        "Display": "Product containing pantothenic acid (medicinal product)"
      },
      {
        "Code": 66492008,
        "Display": "Product containing isoflurane (medicinal product)"
      },
      {
        "Code": 66493003,
        "Display": "Product containing theophylline (medicinal product)"
      },
      {
        "Code": 66602007,
        "Display": "Product containing stanozolol (medicinal product)"
      },
      {
        "Code": 66742008,
        "Display": "Pigmenting agent"
      },
      {
        "Code": 66859009,
        "Display": "Product containing dipyridamole (medicinal product)"
      },
      {
        "Code": 66860004,
        "Display": "Product containing aluminium chloride (medicinal product)"
      },
      {
        "Code": 66919007,
        "Display": "Product containing methyclothiazide (medicinal product)"
      },
      {
        "Code": 66971004,
        "Display": "Product containing colestipol (medicinal product)"
      },
      {
        "Code": 67213005,
        "Display": "Product containing lymphocyte immunoglobulin (medicinal product)"
      },
      {
        "Code": 67423003,
        "Display": "Product containing acylaminopenicillin (product)"
      },
      {
        "Code": 67440007,
        "Display": "Product containing alpha adrenergic receptor antagonist (product)"
      },
      {
        "Code": 67507000,
        "Display": "Medicinal product acting as antiarrhythmic agent (product)"
      },
      {
        "Code": 67735003,
        "Display": "Product containing paclitaxel (medicinal product)"
      },
      {
        "Code": 67891001,
        "Display": "Product containing second generation cephalosporin (product)"
      },
      {
        "Code": 67939000,
        "Display": "Product containing apomorphine (medicinal product)"
      },
      {
        "Code": 68088000,
        "Display": "Product containing acebutolol (medicinal product)"
      },
      {
        "Code": 68206008,
        "Display": "Product containing calcitriol (medicinal product)"
      },
      {
        "Code": 68395000,
        "Display": "Product containing calcium chloride (medicinal product)"
      },
      {
        "Code": 68398003,
        "Display": "Product containing somatomedin (medicinal product)"
      },
      {
        "Code": 68402007,
        "Display": "Product containing carbonic anhydrase inhibitor (product)"
      },
      {
        "Code": 68407001,
        "Display": "Hydrogen peroxide 300 mg/mL cutaneous solution"
      },
      {
        "Code": 68422006,
        "Display": "Product containing cloxacillin (medicinal product)"
      },
      {
        "Code": 68424007,
        "Display": "Product containing isoflurophate (medicinal product)"
      },
      {
        "Code": 68444001,
        "Display": "Product containing doxorubicin (medicinal product)"
      },
      {
        "Code": 68490009,
        "Display": "Product containing sodium propionate (medicinal product)"
      },
      {
        "Code": 68622003,
        "Display": "Product containing secretin (medicinal product)"
      },
      {
        "Code": 68702006,
        "Display": "Product containing sodium aurothiomalate (medicinal product)"
      },
      {
        "Code": 68774008,
        "Display": "Product containing isoxsuprine (medicinal product)"
      },
      {
        "Code": 68887009,
        "Display": "Product containing methotrexate (medicinal product)"
      },
      {
        "Code": 68892006,
        "Display": "Product containing penicillinase-resistant penicillin (product)"
      },
      {
        "Code": 69107004,
        "Display": "Product containing dantrolene (medicinal product)"
      },
      {
        "Code": 69204002,
        "Display": "Product containing guanadrel (medicinal product)"
      },
      {
        "Code": 69236009,
        "Display": "Product containing amiodarone (medicinal product)"
      },
      {
        "Code": 69242008,
        "Display": "Medicinal product acting as miotic (product)"
      },
      {
        "Code": 69331001,
        "Display": "Product containing ciclacillin (medicinal product)"
      },
      {
        "Code": 69431002,
        "Display": "Medicinal product acting as immunosuppressant (product)"
      },
      {
        "Code": 69576000,
        "Display": "Product containing menadione (medicinal product)"
      },
      {
        "Code": 69708003,
        "Display": "Product containing clonazepam (medicinal product)"
      },
      {
        "Code": 69879000,
        "Display": "Product containing altretamine (medicinal product)"
      },
      {
        "Code": 69918003,
        "Display": "Product containing aztreonam (medicinal product)"
      },
      {
        "Code": 69967001,
        "Display": "Product containing sucralfate (medicinal product)"
      },
      {
        "Code": 70047000,
        "Display": "Product containing sulfamethoxazole (medicinal product)"
      },
      {
        "Code": 70254000,
        "Display": "Product containing sulfamethizole (medicinal product)"
      },
      {
        "Code": 70343008,
        "Display": "Product containing piperazine derivative and histamine receptor antagonist (product)"
      },
      {
        "Code": 70379000,
        "Display": "Product containing sodium chloride (medicinal product)"
      },
      {
        "Code": 70460002,
        "Display": "Fish liver oil-containing product"
      },
      {
        "Code": 70702006,
        "Display": "Product containing deferoxamine (medicinal product)"
      },
      {
        "Code": 70776005,
        "Display": "Product containing pemoline (medicinal product)"
      },
      {
        "Code": 70841003,
        "Display": "Product containing chymotrypsin (medicinal product)"
      },
      {
        "Code": 70864001,
        "Display": "Product containing meprobamate (medicinal product)"
      },
      {
        "Code": 70934008,
        "Display": "Product containing demecarium (medicinal product)"
      },
      {
        "Code": 71289008,
        "Display": "Product containing snake antivenom immunoglobulin (product)"
      },
      {
        "Code": 71451001,
        "Display": "Product containing kanamycin (medicinal product)"
      },
      {
        "Code": 71453003,
        "Display": "Product containing mupirocin (medicinal product)"
      },
      {
        "Code": 71455005,
        "Display": "Product containing fludroxycortide (medicinal product)"
      },
      {
        "Code": 71462001,
        "Display": "Product containing Podophyllum resin (medicinal product)"
      },
      {
        "Code": 71516007,
        "Display": "Product containing ergocalciferol (medicinal product)"
      },
      {
        "Code": 71584004,
        "Display": "Product containing monobasic sodium phosphate (medicinal product)"
      },
      {
        "Code": 71634000,
        "Display": "Product containing chlormezanone (medicinal product)"
      },
      {
        "Code": 71699007,
        "Display": "Product containing trifluoperazine (medicinal product)"
      },
      {
        "Code": 71724000,
        "Display": "Product containing ferrous sulfate (medicinal product)"
      },
      {
        "Code": 71731001,
        "Display": "Product containing medrysone in ocular dose form (medicinal product form)"
      },
      {
        "Code": 71759000,
        "Display": "Product containing glyceryl trinitrate (medicinal product)"
      },
      {
        "Code": 71770007,
        "Display": "Product containing monoamine oxidase inhibitor (product)"
      },
      {
        "Code": 71798005,
        "Display": "Product containing fenoprofen (medicinal product)"
      },
      {
        "Code": 71837009,
        "Display": "Cytotoxic agent"
      },
      {
        "Code": 72312007,
        "Display": "Product containing cyclandelate (medicinal product)"
      },
      {
        "Code": 72416006,
        "Display": "Product containing metacycline (medicinal product)"
      },
      {
        "Code": 72623000,
        "Display": "Product containing tioguanine (medicinal product)"
      },
      {
        "Code": 72824008,
        "Display": "Product containing colestyramine (medicinal product)"
      },
      {
        "Code": 72870001,
        "Display": "Product containing scopolamine (medicinal product)"
      },
      {
        "Code": 72924009,
        "Display": "Product containing clofazimine (medicinal product)"
      },
      {
        "Code": 72968006,
        "Display": "Product containing sodium salicylate (medicinal product)"
      },
      {
        "Code": 73074003,
        "Display": "Product containing colistin (medicinal product)"
      },
      {
        "Code": 73093001,
        "Display": "Product containing neomycin (medicinal product)"
      },
      {
        "Code": 73133000,
        "Display": "Product containing colchicine (medicinal product)"
      },
      {
        "Code": 73170009,
        "Display": "Product containing menthol (medicinal product)"
      },
      {
        "Code": 73212002,
        "Display": "Product containing iodipamide (medicinal product)"
      },
      {
        "Code": 73277004,
        "Display": "Product containing mecamylamine (medicinal product)"
      },
      {
        "Code": 73454001,
        "Display": "Product containing desmopressin (medicinal product)"
      },
      {
        "Code": 73572009,
        "Display": "Product containing morphine (medicinal product)"
      },
      {
        "Code": 73647000,
        "Display": "Product containing dipivefrin (medicinal product)"
      },
      {
        "Code": 73756003,
        "Display": "Product containing amobarbital (medicinal product)"
      },
      {
        "Code": 73763003,
        "Display": "Product containing extended spectrum penicillin (product)"
      },
      {
        "Code": 73805002,
        "Display": "Product containing thyrotropin releasing factor (medicinal product)"
      },
      {
        "Code": 73949004,
        "Display": "Product containing atropine (medicinal product)"
      },
      {
        "Code": 73986003,
        "Display": "Product containing cefuroxime (medicinal product)"
      },
      {
        "Code": 74022005,
        "Display": "Product containing mepenzolate (medicinal product)"
      },
      {
        "Code": 74065006,
        "Display": "Product containing prazepam (medicinal product)"
      },
      {
        "Code": 74074008,
        "Display": "Product containing atracurium (medicinal product)"
      },
      {
        "Code": 74213004,
        "Display": "Product containing indapamide (medicinal product)"
      },
      {
        "Code": 74226000,
        "Display": "Product containing vitamin K and vitamin K derivative (product)"
      },
      {
        "Code": 74470007,
        "Display": "Product containing cyclophosphamide (medicinal product)"
      },
      {
        "Code": 74480006,
        "Display": "Medicinal product acting as potassium supplement (product)"
      },
      {
        "Code": 74575000,
        "Display": "Product containing piperacillin (medicinal product)"
      },
      {
        "Code": 74583006,
        "Display": "Product containing hydroquinone (medicinal product)"
      },
      {
        "Code": 74632002,
        "Display": "Succinimide-containing product"
      },
      {
        "Code": 74674007,
        "Display": "Product containing propofol (medicinal product)"
      },
      {
        "Code": 74771007,
        "Display": "Product containing phenoxybenzamine (medicinal product)"
      },
      {
        "Code": 74782004,
        "Display": "Product containing naturally occurring alkaloid (product)"
      },
      {
        "Code": 74798006,
        "Display": "Product containing pipenzolate (medicinal product)"
      },
      {
        "Code": 74819009,
        "Display": "Product containing acetohydroxamic acid (medicinal product)"
      },
      {
        "Code": 75029008,
        "Display": "Product containing 11-deoxycorticosterone (medicinal product)"
      },
      {
        "Code": 75203002,
        "Display": "Product containing mometasone (medicinal product)"
      },
      {
        "Code": 75429004,
        "Display": "Product containing dexbrompheniramine (medicinal product)"
      },
      {
        "Code": 75501004,
        "Display": "Product containing bromazine (medicinal product)"
      },
      {
        "Code": 75661008,
        "Display": "Product containing delta tocopherol (medicinal product)"
      },
      {
        "Code": 75927008,
        "Display": "Product containing floxuridine (medicinal product)"
      },
      {
        "Code": 75959001,
        "Display": "Product containing tamoxifen (medicinal product)"
      },
      {
        "Code": 75969007,
        "Display": "Product containing gonadotropin releasing factor (product)"
      },
      {
        "Code": 76058001,
        "Display": "Product containing prazosin (medicinal product)"
      },
      {
        "Code": 76155001,
        "Display": "Product containing iopanoic acid (medicinal product)"
      },
      {
        "Code": 76286000,
        "Display": "Product containing gallamine (medicinal product)"
      },
      {
        "Code": 76289007,
        "Display": "Product containing xylometazoline (medicinal product)"
      },
      {
        "Code": 76385003,
        "Display": "Product containing alpha-1 adrenergic receptor antagonist (product)"
      },
      {
        "Code": 76390000,
        "Display": "Product containing practolol (medicinal product)"
      },
      {
        "Code": 76591000,
        "Display": "Product containing bleomycin (medicinal product)"
      },
      {
        "Code": 76696004,
        "Display": "Product containing noscapine (medicinal product)"
      },
      {
        "Code": 76759004,
        "Display": "Product containing disopyramide (medicinal product)"
      },
      {
        "Code": 76962009,
        "Display": "Product containing iproniazid (medicinal product)"
      },
      {
        "Code": 77035009,
        "Display": "Product containing clofibrate (medicinal product)"
      },
      {
        "Code": 77048008,
        "Display": "Product containing diphtheria antitoxin (medicinal product)"
      },
      {
        "Code": 77237006,
        "Display": "Medicinal product acting as emetic (product)"
      },
      {
        "Code": 77390008,
        "Display": "Product containing benzatropine (medicinal product)"
      },
      {
        "Code": 77398001,
        "Display": "Medicinal product acting as antidiarrheal agent (product)"
      },
      {
        "Code": 77549006,
        "Display": "Product containing terpene (product)"
      },
      {
        "Code": 77731008,
        "Display": "Product containing acetylcysteine (medicinal product)"
      },
      {
        "Code": 77750008,
        "Display": "Product containing dacarbazine (medicinal product)"
      },
      {
        "Code": 77856005,
        "Display": "Product containing esmolol (medicinal product)"
      },
      {
        "Code": 77885004,
        "Display": "Product containing mestranol (medicinal product)"
      },
      {
        "Code": 77898008,
        "Display": "Product containing simeticone (medicinal product)"
      },
      {
        "Code": 78025001,
        "Display": "Product containing ganciclovir (medicinal product)"
      },
      {
        "Code": 78174002,
        "Display": "Product containing mezlocillin (medicinal product)"
      },
      {
        "Code": 78379001,
        "Display": "Product containing reserpine (medicinal product)"
      },
      {
        "Code": 78449007,
        "Display": "Product containing nitrazepam (medicinal product)"
      },
      {
        "Code": 78507004,
        "Display": "Product containing benzylpenicillin (medicinal product)"
      },
      {
        "Code": 78542000,
        "Display": "Product containing potassium citrate (medicinal product)"
      },
      {
        "Code": 78684000,
        "Display": "Product containing mesoridazine (medicinal product)"
      },
      {
        "Code": 78700004,
        "Display": "Product containing fenfluramine (medicinal product)"
      },
      {
        "Code": 78983008,
        "Display": "Product containing etamivan (medicinal product)"
      },
      {
        "Code": 79129001,
        "Display": "Product containing prochlorperazine (medicinal product)"
      },
      {
        "Code": 79138004,
        "Display": "Product containing gelatin (medicinal product)"
      },
      {
        "Code": 79221007,
        "Display": "Product containing propoxycaine (medicinal product)"
      },
      {
        "Code": 79225003,
        "Display": "Product containing oxazepam (medicinal product)"
      },
      {
        "Code": 79305004,
        "Display": "Product containing guanethidine (medicinal product)"
      },
      {
        "Code": 79332009,
        "Display": "Product containing diethylstilbestrol (medicinal product)"
      },
      {
        "Code": 79356008,
        "Display": "Product containing acenocoumarol (medicinal product)"
      },
      {
        "Code": 79440004,
        "Display": "Product containing corticosteroid and corticosteroid derivative (product)"
      },
      {
        "Code": 79543000,
        "Display": "Psychostimulant"
      },
      {
        "Code": 79736009,
        "Display": "Product containing ciclopirox (medicinal product)"
      },
      {
        "Code": 79873000,
        "Display": "Vaccinia human immune globulin-containing product"
      },
      {
        "Code": 80024007,
        "Display": "Product containing neostigmine (medicinal product)"
      },
      {
        "Code": 80127003,
        "Display": "Product containing phenylpropanolamine (medicinal product)"
      },
      {
        "Code": 80165005,
        "Display": "Product containing hydroxyzine (medicinal product)"
      },
      {
        "Code": 80229008,
        "Display": "Product containing antimalarial (product)"
      },
      {
        "Code": 80311000,
        "Display": "Product containing chlorphenesin (medicinal product)"
      },
      {
        "Code": 80399002,
        "Display": "Product containing aluminium hydroxide (medicinal product)"
      },
      {
        "Code": 80618000,
        "Display": "Product containing ethylestrenol (medicinal product)"
      },
      {
        "Code": 80732005,
        "Display": "Product containing sulfafurazole (medicinal product)"
      },
      {
        "Code": 80802008,
        "Display": "Product containing cyclobenzaprine (medicinal product)"
      },
      {
        "Code": 80834004,
        "Display": "Product containing rabies human immune globulin (medicinal product)"
      },
      {
        "Code": 80870001,
        "Display": "Product containing glibenclamide (medicinal product)"
      },
      {
        "Code": 80906007,
        "Display": "Product containing ciclosporin (medicinal product)"
      },
      {
        "Code": 81073007,
        "Display": "Product containing dimenhydrinate (medicinal product)"
      },
      {
        "Code": 81088002,
        "Display": "Product containing cefazolin (medicinal product)"
      },
      {
        "Code": 81219009,
        "Display": "Mumps human immune globulin-containing product"
      },
      {
        "Code": 81252003,
        "Display": "Product containing third generation cephalosporin (product)"
      },
      {
        "Code": 81335000,
        "Display": "Product containing isoniazid (medicinal product)"
      },
      {
        "Code": 81457006,
        "Display": "Product containing desoximetasone (medicinal product)"
      },
      {
        "Code": 81583003,
        "Display": "Product containing procarbazine (medicinal product)"
      },
      {
        "Code": 81609008,
        "Display": "Product containing furosemide (medicinal product)"
      },
      {
        "Code": 81646007,
        "Display": "Product containing diphenylpyraline (medicinal product)"
      },
      {
        "Code": 81728006,
        "Display": "Product containing digitoxin (medicinal product)"
      },
      {
        "Code": 81759008,
        "Display": "Immune enhancement agent"
      },
      {
        "Code": 81839001,
        "Display": "Medicinal product acting as anticoagulant agent (product)"
      },
      {
        "Code": 81947000,
        "Display": "Product containing etacrynic acid (medicinal product)"
      },
      {
        "Code": 82133001,
        "Display": "Product containing noretynodrel (medicinal product)"
      },
      {
        "Code": 82156005,
        "Display": "Product containing retinol (medicinal product)"
      },
      {
        "Code": 82165003,
        "Display": "Product containing phentolamine (medicinal product)"
      },
      {
        "Code": 82166002,
        "Display": "Product containing prolactin (medicinal product)"
      },
      {
        "Code": 82240008,
        "Display": "Product containing norgestrel (medicinal product)"
      },
      {
        "Code": 82264009,
        "Display": "Product containing homatropine (medicinal product)"
      },
      {
        "Code": 82290007,
        "Display": "Product containing bismuth (medicinal product)"
      },
      {
        "Code": 82312001,
        "Display": "Product containing bacampicillin (medicinal product)"
      },
      {
        "Code": 82573000,
        "Display": "Product containing lidocaine (medicinal product)"
      },
      {
        "Code": 82746003,
        "Display": "Product containing chlordiazepoxide (medicinal product)"
      },
      {
        "Code": 82804004,
        "Display": "Product manufactured as nasal dose form (product)"
      },
      {
        "Code": 82896009,
        "Display": "Product containing nadolol (medicinal product)"
      },
      {
        "Code": 82951001,
        "Display": "Product containing guanabenz (medicinal product)"
      },
      {
        "Code": 83085007,
        "Display": "Product containing nalbuphine (medicinal product)"
      },
      {
        "Code": 83179003,
        "Display": "Nephrogenic vitamin D preparation"
      },
      {
        "Code": 83192000,
        "Display": "Product containing mescaline (medicinal product)"
      },
      {
        "Code": 83201006,
        "Display": "Product containing oxacillin (medicinal product)"
      },
      {
        "Code": 83288003,
        "Display": "Product containing diloxanide (medicinal product)"
      },
      {
        "Code": 83490000,
        "Display": "Product containing hydroxychloroquine (medicinal product)"
      },
      {
        "Code": 83532008,
        "Display": "Product containing cimetidine (medicinal product)"
      },
      {
        "Code": 83692001,
        "Display": "Product containing mineralocorticoid (product)"
      },
      {
        "Code": 83973001,
        "Display": "Product containing methocarbamol (medicinal product)"
      },
      {
        "Code": 83999008,
        "Display": "Product containing clarithromycin (medicinal product)"
      },
      {
        "Code": 84078002,
        "Display": "Product containing methyldopa (medicinal product)"
      },
      {
        "Code": 84737005,
        "Display": "Product containing mafenide (medicinal product)"
      },
      {
        "Code": 84812008,
        "Display": "Product containing heparin (medicinal product)"
      },
      {
        "Code": 84844007,
        "Display": "Product containing butoconazole (medicinal product)"
      },
      {
        "Code": 84951002,
        "Display": "Product containing meclozine (medicinal product)"
      },
      {
        "Code": 84986000,
        "Display": "Product containing corticotropin releasing factor (product)"
      },
      {
        "Code": 85063003,
        "Display": "Product containing opioid receptor partial agonist (product)"
      },
      {
        "Code": 85272000,
        "Display": "Product containing nifedipine (medicinal product)"
      },
      {
        "Code": 85343003,
        "Display": "Product containing nitrofurantoin (medicinal product)"
      },
      {
        "Code": 85354008,
        "Display": "Product containing cyclizine (medicinal product)"
      },
      {
        "Code": 85408000,
        "Display": "Product containing antazoline (medicinal product)"
      },
      {
        "Code": 85417000,
        "Display": "Product containing autonomic agent (product)"
      },
      {
        "Code": 85429009,
        "Display": "Product containing physostigmine (medicinal product)"
      },
      {
        "Code": 85468002,
        "Display": "Product containing polythiazide (medicinal product)"
      },
      {
        "Code": 85507008,
        "Display": "Product containing esterified estrogen (medicinal product)"
      },
      {
        "Code": 85591001,
        "Display": "Product containing timolol (medicinal product)"
      },
      {
        "Code": 85990009,
        "Display": "Product containing codeine (medicinal product)"
      },
      {
        "Code": 86066003,
        "Display": "Product containing spectinomycin (medicinal product)"
      },
      {
        "Code": 86080005,
        "Display": "Product containing botulinum antitoxin (medicinal product)"
      },
      {
        "Code": 86085000,
        "Display": "Product containing vecuronium (medicinal product)"
      },
      {
        "Code": 86131002,
        "Display": "Product containing metirosine (medicinal product)"
      },
      {
        "Code": 86162003,
        "Display": "Product containing nandrolone (medicinal product)"
      },
      {
        "Code": 86308005,
        "Display": "Product containing sympathomimetic (product)"
      },
      {
        "Code": 86337009,
        "Display": "Product containing tetanus immunoglobulin of human origin (medicinal product)"
      },
      {
        "Code": 86389004,
        "Display": "Product containing shark liver oil (medicinal product)"
      },
      {
        "Code": 86536001,
        "Display": "Product containing natural penicillin (product)"
      },
      {
        "Code": 86647004,
        "Display": "Product containing bumetanide (medicinal product)"
      },
      {
        "Code": 86906004,
        "Display": "Product containing propylamino derivative of phenothiazine (product)"
      },
      {
        "Code": 86939001,
        "Display": "Product containing sulfaguanidine (medicinal product)"
      },
      {
        "Code": 86977007,
        "Display": "Product containing mesalazine (medicinal product)"
      },
      {
        "Code": 87233003,
        "Display": "Product containing low molecular weight heparin (product)"
      },
      {
        "Code": 87285001,
        "Display": "Product containing nimodipine (medicinal product)"
      },
      {
        "Code": 87395005,
        "Display": "Product containing amiloride (medicinal product)"
      },
      {
        "Code": 87567009,
        "Display": "Product containing mefloquine (medicinal product)"
      },
      {
        "Code": 87586001,
        "Display": "Product containing neuromuscular blocker"
      },
      {
        "Code": 87617007,
        "Display": "Product containing naltrexone (medicinal product)"
      },
      {
        "Code": 87652004,
        "Display": "Product containing atenolol (medicinal product)"
      },
      {
        "Code": 87881000,
        "Display": "Product containing danazol (medicinal product)"
      },
      {
        "Code": 88134000,
        "Display": "Product containing rauwolfia alkaloid (medicinal product)"
      },
      {
        "Code": 88226000,
        "Display": "Product containing hydrocortisone in nasal dose form (medicinal product form)"
      },
      {
        "Code": 88279005,
        "Display": "Medicinal product acting as antirheumatic agent (product)"
      },
      {
        "Code": 88519001,
        "Display": "Product containing calcifediol (medicinal product)"
      },
      {
        "Code": 88566002,
        "Display": "Product containing liver extract (medicinal product)"
      },
      {
        "Code": 88870000,
        "Display": "Product containing first generation cephalosporin (product)"
      },
      {
        "Code": 88997008,
        "Display": "Product containing thiotepa (medicinal product)"
      },
      {
        "Code": 89018006,
        "Display": "Product containing naloxone (medicinal product)"
      },
      {
        "Code": 89029005,
        "Display": "Product containing levomepromazine (medicinal product)"
      },
      {
        "Code": 89045007,
        "Display": "Product containing pertussis human immune globulin (medicinal product)"
      },
      {
        "Code": 89092006,
        "Display": "Product containing tranylcypromine (medicinal product)"
      },
      {
        "Code": 89132005,
        "Display": "Product containing chenodeoxycholic acid (medicinal product)"
      },
      {
        "Code": 89192008,
        "Display": "Product containing fludrocortisone (medicinal product)"
      },
      {
        "Code": 89265009,
        "Display": "Product containing cytarabine (medicinal product)"
      },
      {
        "Code": 89435001,
        "Display": "Product containing poliomyelitis human immune globulin (medicinal product)"
      },
      {
        "Code": 89466007,
        "Display": "Product containing methallenestril (medicinal product)"
      },
      {
        "Code": 89505005,
        "Display": "Product containing sulindac (medicinal product)"
      },
      {
        "Code": 89626004,
        "Display": "Medicinal product acting as antidote agent (product)"
      },
      {
        "Code": 89664002,
        "Display": "Product containing metocurine (medicinal product)"
      },
      {
        "Code": 89692007,
        "Display": "Product containing crotamiton (medicinal product)"
      },
      {
        "Code": 89695009,
        "Display": "Product containing tobramycin (medicinal product)"
      },
      {
        "Code": 89785009,
        "Display": "Product containing ritodrine (medicinal product)"
      },
      {
        "Code": 90000002,
        "Display": "Smooth muscle relaxant"
      },
      {
        "Code": 90017009,
        "Display": "Product containing estrone (medicinal product)"
      },
      {
        "Code": 90332006,
        "Display": "Product containing paracetamol (medicinal product)"
      },
      {
        "Code": 90346006,
        "Display": "Product containing razoxane (medicinal product)"
      },
      {
        "Code": 90356005,
        "Display": "Product containing pilocarpine (medicinal product)"
      },
      {
        "Code": 90370005,
        "Display": "Product containing benzalkonium (medicinal product)"
      },
      {
        "Code": 90426002,
        "Display": "Product containing trimipramine (medicinal product)"
      },
      {
        "Code": 90614001,
        "Display": "Product containing beta-lactam and antibiotic (product)"
      },
      {
        "Code": 90659009,
        "Display": "Product containing natamycin in ocular dose form (medicinal product form)"
      },
      {
        "Code": 90704004,
        "Display": "Product containing aminopenicillin (product)"
      },
      {
        "Code": 90802006,
        "Display": "Product containing reversible anticholinesterase (product)"
      },
      {
        "Code": 90882008,
        "Display": "Product containing carbinoxamine (medicinal product)"
      },
      {
        "Code": 91107009,
        "Display": "Product containing caffeine (medicinal product)"
      },
      {
        "Code": 91135008,
        "Display": "Product containing bendroflumethiazide (medicinal product)"
      },
      {
        "Code": 91143003,
        "Display": "Product containing salbutamol (medicinal product)"
      },
      {
        "Code": 91169009,
        "Display": "Product containing nafcillin (medicinal product)"
      },
      {
        "Code": 91307002,
        "Display": "Digitalis-containing product"
      },
      {
        "Code": 91339009,
        "Display": "Product containing trimetrexate (medicinal product)"
      },
      {
        "Code": 91376007,
        "Display": "Product containing pentoxifylline (medicinal product)"
      },
      {
        "Code": 91435002,
        "Display": "Product containing pseudoephedrine (medicinal product)"
      },
      {
        "Code": 91452003,
        "Display": "Product containing buspirone (medicinal product)"
      },
      {
        "Code": 91479004,
        "Display": "Product containing gramicidin (medicinal product)"
      },
      {
        "Code": 91667005,
        "Display": "Product containing hydrochlorothiazide (medicinal product)"
      },
      {
        "Code": 96011002,
        "Display": "Product containing carbomycin (medicinal product)"
      },
      {
        "Code": 96014005,
        "Display": "Product containing teicoplanin (medicinal product)"
      },
      {
        "Code": 96015006,
        "Display": "Product containing fusidic acid (medicinal product)"
      },
      {
        "Code": 96018008,
        "Display": "Product containing tiamulin (medicinal product)"
      },
      {
        "Code": 96020006,
        "Display": "Product containing tylosin (medicinal product)"
      },
      {
        "Code": 96023008,
        "Display": "Product containing virginiamycin (medicinal product)"
      },
      {
        "Code": 96029007,
        "Display": "Product containing apramycin (medicinal product)"
      },
      {
        "Code": 96034006,
        "Display": "Product containing azithromycin (medicinal product)"
      },
      {
        "Code": 96038009,
        "Display": "Product containing itraconazole (medicinal product)"
      },
      {
        "Code": 96044008,
        "Display": "Product containing ceftiofur (medicinal product)"
      },
      {
        "Code": 96047001,
        "Display": "Product containing cefpirome (medicinal product)"
      },
      {
        "Code": 96049003,
        "Display": "Product containing cefpodoxime (medicinal product)"
      },
      {
        "Code": 96051004,
        "Display": "Product containing ceftibuten (medicinal product)"
      },
      {
        "Code": 96052006,
        "Display": "Product containing cefixime (medicinal product)"
      },
      {
        "Code": 96053001,
        "Display": "Product containing cefsulodin (medicinal product)"
      },
      {
        "Code": 96054007,
        "Display": "Product containing cefprozil (medicinal product)"
      },
      {
        "Code": 96055008,
        "Display": "Product containing cefodizime (medicinal product)"
      },
      {
        "Code": 96062004,
        "Display": "Product containing meropenem (medicinal product)"
      },
      {
        "Code": 96063009,
        "Display": "Product containing mecillinam (medicinal product)"
      },
      {
        "Code": 96064003,
        "Display": "Product containing pivmecillinam (medicinal product)"
      },
      {
        "Code": 96065002,
        "Display": "Product containing temocillin (medicinal product)"
      },
      {
        "Code": 96067005,
        "Display": "Product containing flucloxacillin (medicinal product)"
      },
      {
        "Code": 96072001,
        "Display": "Product containing pivampicillin (medicinal product)"
      },
      {
        "Code": 96073006,
        "Display": "Product containing talampicillin (medicinal product)"
      },
      {
        "Code": 96077007,
        "Display": "Product containing lymecycline (medicinal product)"
      },
      {
        "Code": 96081007,
        "Display": "Product containing cinoxacin (medicinal product)"
      },
      {
        "Code": 96084004,
        "Display": "Product containing enoxacin (medicinal product)"
      },
      {
        "Code": 96086002,
        "Display": "Product containing ofloxacin (medicinal product)"
      },
      {
        "Code": 96087006,
        "Display": "Product containing levofloxacin (medicinal product)"
      },
      {
        "Code": 96088001,
        "Display": "Product containing lomefloxacin (medicinal product)"
      },
      {
        "Code": 96090000,
        "Display": "Product containing sparfloxacin (medicinal product)"
      },
      {
        "Code": 96091001,
        "Display": "Product containing temafloxacin (medicinal product)"
      },
      {
        "Code": 96093003,
        "Display": "Product containing rosoxacin (medicinal product)"
      },
      {
        "Code": 96097002,
        "Display": "Product containing famciclovir (medicinal product)"
      },
      {
        "Code": 96099004,
        "Display": "Product containing foscarnet (medicinal product)"
      },
      {
        "Code": 96103009,
        "Display": "Product containing ipronidazole (medicinal product)"
      },
      {
        "Code": 96107005,
        "Display": "Product containing antibabesial (product)"
      },
      {
        "Code": 96108000,
        "Display": "Product containing imidocarb (medicinal product)"
      },
      {
        "Code": 96119002,
        "Display": "Product containing albendazole (medicinal product)"
      },
      {
        "Code": 96138006,
        "Display": "Product containing ivermectin (medicinal product)"
      },
      {
        "Code": 96144005,
        "Display": "Coccidiostat-containing product"
      },
      {
        "Code": 96149000,
        "Display": "Product containing bambermycin (medicinal product)"
      },
      {
        "Code": 96169005,
        "Display": "Product containing salinomycin (medicinal product)"
      },
      {
        "Code": 96183007,
        "Display": "Product containing alfentanil (medicinal product)"
      },
      {
        "Code": 96185000,
        "Display": "Product containing tilidine (medicinal product)"
      },
      {
        "Code": 96191003,
        "Display": "Product containing dextromoramide (medicinal product)"
      },
      {
        "Code": 96195007,
        "Display": "Product containing lamotrigine (medicinal product)"
      },
      {
        "Code": 96196008,
        "Display": "Product containing butalbital (medicinal product)"
      },
      {
        "Code": 96199001,
        "Display": "Product containing bupropion (medicinal product)"
      },
      {
        "Code": 96200003,
        "Display": "Product containing mianserin (medicinal product)"
      },
      {
        "Code": 96209002,
        "Display": "Product containing clomipramine (medicinal product)"
      },
      {
        "Code": 96213009,
        "Display": "Product containing fluvoxamine (medicinal product)"
      },
      {
        "Code": 96220002,
        "Display": "Product containing flupentixol (medicinal product)"
      },
      {
        "Code": 96221003,
        "Display": "Product containing clozapine (medicinal product)"
      },
      {
        "Code": 96231005,
        "Display": "Product containing zolpidem (medicinal product)"
      },
      {
        "Code": 96233008,
        "Display": "Product containing lormetazepam (medicinal product)"
      },
      {
        "Code": 96234002,
        "Display": "Product containing bromazepam (medicinal product)"
      },
      {
        "Code": 96236000,
        "Display": "Product containing clobazam (medicinal product)"
      },
      {
        "Code": 96237009,
        "Display": "Product containing flunitrazepam (medicinal product)"
      },
      {
        "Code": 96246003,
        "Display": "Product containing benzodiazepine receptor antagonist (product)"
      },
      {
        "Code": 96247007,
        "Display": "Product containing flumazenil (medicinal product)"
      },
      {
        "Code": 96252002,
        "Display": "Product containing prolintane (medicinal product)"
      },
      {
        "Code": 96278006,
        "Display": "Product containing hyaluronic acid (medicinal product)"
      },
      {
        "Code": 96280000,
        "Display": "Product containing bone resorption inhibitor"
      },
      {
        "Code": 96281001,
        "Display": "Product containing bisphosphonate (product)"
      },
      {
        "Code": 96284009,
        "Display": "Product containing etidronic acid (medicinal product)"
      },
      {
        "Code": 96298001,
        "Display": "Product containing mexiletine (medicinal product)"
      },
      {
        "Code": 96299009,
        "Display": "Product containing oxprenolol (medicinal product)"
      },
      {
        "Code": 96300001,
        "Display": "Product containing propafenone (medicinal product)"
      },
      {
        "Code": 96301002,
        "Display": "Product containing sotalol (medicinal product)"
      },
      {
        "Code": 96302009,
        "Display": "Product containing 3-hydroxy-3-methylglutaryl-coenzyme A reductase inhibitor (product)"
      },
      {
        "Code": 96304005,
        "Display": "Product containing simvastatin (medicinal product)"
      }
    ]
  };
}());
