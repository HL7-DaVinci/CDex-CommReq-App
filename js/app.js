var CDEX;
if (!CDEX) {
    CDEX = {};
}

(function () {

    CDEX.client = null;
    CDEX.patient = null;
    CDEX.index = 0;

    CDEX.now = () => {
        let date = new Date();
        return date.toISOString();
    };

    CDEX.displayPatient = (pt) => {
        $('#commRes-patient-name, #patient-name, #review-name').html(CDEX.getPatientName(pt));
    };

    CDEX.displayScreen = (screenID) => {
        $('#data-request-screen').hide();
        $('#review-screen').hide();
        $('#confirm-screen').hide();
        $('#config-screen').hide();
        $('#communication-request-screen').hide();
        $('#'+screenID).show();
    };

    CDEX.displayCommReqScreen = () => {
        CDEX.displayScreen('communication-request-screen');
    };

    CDEX.displayDataRequestScreen = () => {
       CDEX.displayScreen('data-request-screen');
    };

    CDEX.displayConfirmScreen = () => {
        CDEX.displayScreen('confirm-screen');
    };

    CDEX.displayConfigScreen = () => {
        if (CDEX.configSetting === "custom") {
            $('#config-select').val("custom");
        } else {
            $('#config-select').val(CDEX.configSetting);
        }
        $('#config-text').val(JSON.stringify(CDEX.providerEndpoint, null, 2));
        CDEX.displayScreen('config-screen');
    };

    CDEX.displayReviewScreen = () => {
        $('#final-list').empty();
        for(let idx = 0; idx <= CDEX.index; idx++){
            const primaryTypeId = "finalPrimaryTypeId" + idx;
            const secondaryTypeId = "finalSecondaryTypeId" + idx;
            const primaryTypeSelected = $("#typeId" + idx).find(":selected").text();
            const secondaryTypeSelected = $("#secondaryTypeId" + idx).find(":selected").text();
            const secondaryFreeText = $('#secondaryTypeId' + idx).val();

            if(primaryTypeSelected === CDEX.menu.DocRef.name) {
                $('#final-list').append("<div><select disabled='disabled' id='" + primaryTypeId +
                    "'></select><div><label>" + CDEX.menu.DocRef.description + "</label><select id='" +
                    secondaryTypeId +"' disabled='disabled'></select></div></div>");

                CDEX.menu.DocRef.values.forEach((secondary) => {
                    if(secondaryTypeSelected === secondary.name) {
                        $('#' + secondaryTypeId).append("<option selected='selected' disabled='disabled'>" +
                            secondary.name + "</option>");
                    }
                });
            }else if(primaryTypeSelected === CDEX.menu.FHIRQuery.name){
                $('#final-list').append("<div><select id='" + primaryTypeId +
                    "' disabled='disabled'></select><div><label>" + CDEX.menu.FHIRQuery.description +
                    "</label><select id='" + secondaryTypeId +"' disabled='disabled'></select></div></div>");

                CDEX.menu.FHIRQuery.values.forEach((secondary) => {
                    if(secondaryTypeSelected === secondary.name) {
                        $('#' + secondaryTypeId).append("<option selected='selected' disabled='disabled'>" +
                            secondary.name + "</option>");
                    }
                });
            }else if(primaryTypeSelected === CDEX.menu.FreeText.name){
                $('#final-list').append("<div><select disabled='disabled' id='" + primaryTypeId +
                    "'></select><div><label>" + CDEX.menu.FreeText.description + "</label><textarea id='" +
                    secondaryTypeId + "' disabled='disabled'>" + secondaryFreeText + "</textarea></div></div>");
            }

            for (let key in CDEX.menu) {
                if(primaryTypeSelected === CDEX.menu[key].name) {
                    $('#' + primaryTypeId).append("<option selected='selected' disabled='disabled'>" + CDEX.menu[key].name + "</option>");
                }
            }
        }
        CDEX.displayScreen('review-screen');
    }

    CDEX.displayErrorScreen = (title, message) => {
        $('#error-title').html(title);
        $('#error-message').html(message);
        CDEX.displayScreen('error-screen');
    }

    CDEX.disable = (id) => {
        $("#"+id).prop("disabled",true);
    };

    CDEX.getPatientName = (pt) => {
        if (pt.name) {
            let names = pt.name.map((n) => n.given.join(" ") + " " + n.family);
            return names.join(" / ");
        } else {
            return "anonymous";
        }
    };

    CDEX.addTypeSelection = () => {
        const typeId = "typeId" + CDEX.index;
        const divId = "divId" + CDEX.index;
        const secondaryTypeId = "secondaryTypeId" + CDEX.index;
        const id = CDEX.index;

        $('#selection-query-list').append("<div id='" + divId + "'><select id='"+ typeId +
            "'></select><div><label>" + CDEX.menu.DocRef.description + "</label><select id='" +
            secondaryTypeId + "'></select></div></div>");
        $('#' + typeId).change(() => {CDEX.selectType(id)});

        for (let key in CDEX.menu) {
            $('#' + typeId).append("<option>" + CDEX.menu[key].name + "</option>");
        }

        CDEX.menu.DocRef.values.forEach((secondaryType) => {
            $('#' + secondaryTypeId).append("<option>" + secondaryType.name + "</option>");
        });

        CDEX.index++;
    }

    CDEX.selectType = (typeId) => {
        const secondaryTypeId = "secondaryTypeId" + typeId;
        const type = $("#typeId" + typeId).find(":selected").text();
        $('#divId' + typeId).empty();

        if(type === CDEX.menu.DocRef.name) {
            $('#divId' + typeId).append("<select id='typeId" + typeId + "'></select><div><label>" +
                CDEX.menu.DocRef.description + "</label><select id='" + secondaryTypeId +"'></select></div>");

            CDEX.menu.DocRef.values.forEach((secondary) => {
                $('#' + secondaryTypeId).append("<option>" + secondary.name + "</option>");
            });
        }else if(type === CDEX.menu.FHIRQuery.name){
            $('#divId' + typeId).append("<select id='typeId" + typeId + "'></select><div><label>" +
                CDEX.menu.FHIRQuery.description + "</label><select id='" + secondaryTypeId +"'></select></div>");

            CDEX.menu.FHIRQuery.values.forEach((secondary) => {
                $('#' + secondaryTypeId).append("<option>" + secondary.name + "</option>");
            });
        }else if(type === CDEX.menu.FreeText.name){
            $('#divId' + typeId).append("<select id='typeId" + typeId +
                "'></select><div><label>" + CDEX.menu.FreeText.description + "</label><textarea id='" +
                secondaryTypeId + "'></textarea></div>");
        }

        $('#typeId' + typeId).change(() => {CDEX.selectType(typeId)});

        for (let key in CDEX.menu) {
            if(type === CDEX.menu[key].name) {
                $('#typeId' + typeId).append("<option selected='selected'>" + CDEX.menu[key].name + "</option>");
            }else{
                $('#typeId' + typeId).append("<option>" + CDEX.menu[key].name + "</option>");
            }
        }
    }

    CDEX.addToPayload = () => {
        let timestamp = CDEX.now();
        let communicationRequest = CDEX.operationPayload;

        communicationRequest.authoredOn = timestamp;
        let payload = [];
        for(let idx = 0; idx <= CDEX.index; idx++){
            const primaryTypeSelected = $("#finalPrimaryTypeId" + idx).find(":selected").text();
            const secondaryTypeSelected = $("#finalSecondaryTypeId" + idx).find(":selected").text();
            const secondaryFreeText = $("#finalSecondaryTypeId" + idx).val();

            if(primaryTypeSelected === CDEX.menu.DocRef.name) {
                CDEX.menu.DocRef.values.forEach((secondaryType) => {
                    if(secondaryType.name === secondaryTypeSelected) {
                        payload[idx] = {
                            "extension": [{
                                    "url": "http://hl7.org/fhir/us/davinci-cdex/StructureDefinition/cdex-payload-clinical-note-type",
                                    "valueCodeableConcept": {
                                        "coding": [{
                                                "system": "http://loinc.org",
                                                "code": "CODE"}]}}],
                            "contentString": ""};
                        payload[idx].extension[0].valueCodeableConcept.coding[0].code = secondaryType.generalCode;
                        payload[idx].contentString = secondaryType.name + "s";

                    }
                });
            }else if(primaryTypeSelected === CDEX.menu.FHIRQuery.name){
                CDEX.menu.FHIRQuery.values.forEach((secondaryType) => {
                    if(secondaryType.name === secondaryTypeSelected) {
                        let queryString = secondaryType.FHIRQueryString.replace("[this patient's id]", CDEX.patient.id);
                        payload[idx] = {"extension": [{
                                    "url": "http://hl7.org/fhir/us/davinci-cdex/StructureDefinition/cdex-payload-query-string",
                                    "valueString": "VALUE_STRING"}],
                            "contentString": "CONTENT"
                        };
                        payload[idx].extension[0].valueString = queryString;
                        payload[idx].contentString = secondaryType.name;
                    }
                });
            }else if(primaryTypeSelected === CDEX.menu.FreeText.name){
                payload[idx] = {"contentString": "CONTENT"};
                payload[idx].contentString = secondaryFreeText;
            }
        }
        communicationRequest.payload = payload;
        CDEX.operationPayload = communicationRequest;
    }

    CDEX.previewCommunication = (communication) => {

    }

    CDEX.loadData = (client) => {
        CDEX.communications = [];
        try {
            CDEX.client = client;
            CDEX.displayCommReqScreen();
            CDEX.client.patient.read().then((pt) => {
                CDEX.patient = pt;
                CDEX.displayPatient (pt);
            }).then(() => {

            CDEX.client.api.fetchAll(
                {
                    type: "CommunicationRequest",
                    query: {
                        subject: CDEX.patient.id
                    }
                }
            ).then(function (commRequests) {
                commRequests.forEach((commReq) => {
                    CDEX.client.api.fetchAll(
                        {
                            type: "Communication",
                            query: {
                                'based-on' : commReq.id
                            }
                        }
                    ).then(function (communications) {
                        if(communications.length === 0){
                            $('#comm-request-list').append("<tr><td>" + commReq.id + "</td><td>Open</td></tr>");
                        }
                        communications.forEach((communication) => {
                            CDEX.communications.push(communication);
                            let idButton = "Communication" + communication.id;
                            $('#comm-request-list').append("<tr><td>" + commReq.id + "</td><td>Completed</td><td><button id='" +
                                idButton + "'>Show Communication</button></td></tr>");
                            $('#' + idButton).click(() => {
                                CDEX.previewCommunication(communication);
                            });
                        });
                    });

                });
            });
        });
        } catch (err) {
            CDEX.displayErrorScreen("Failed to initialize request menu", "Please make sure that everything is OK with request configuration");
        }
    };

    CDEX.reconcile = () => {

        $('#discharge-selection').hide();
        CDEX.disable('btn-submit');
        CDEX.disable('btn-edit');
        $('#btn-submit').html("<i class='fa fa-circle-o-notch fa-spin'></i> Submit Communication Request");

        CDEX.addToPayload();
        CDEX.finalize();

    };

    CDEX.initialize = (client) => {
        CDEX.loadConfig();
        if (sessionStorage.operationPayload) {
            if (JSON.parse(sessionStorage.tokenResponse).refresh_token) {
                // save state in localStorage
                let state = JSON.parse(sessionStorage.tokenResponse).state;
                localStorage.tokenResponse = sessionStorage.tokenResponse;
                localStorage[state] = sessionStorage[state];
            }
            CDEX.operationPayload = JSON.parse(sessionStorage.operationPayload);
            CDEX.providerEndpoint.accessToken = JSON.parse(sessionStorage.tokenResponse).access_token;
            CDEX.finalize();
        } else {
            CDEX.loadData(client);
        }
    };

    CDEX.loadConfig = () => {
        let configText = window.localStorage.getItem("cdex-app-config");
        if (configText) {
            let conf = JSON.parse (configText);
            if (conf['custom']) {
                CDEX.providerEndpoint = conf['custom'];
                CDEX.configSetting = "custom";
            } else {
                CDEX.providerEndpoint = CDEX.providerEndpoints[conf['selection']];
                CDEX.configSetting = conf['selection'];
            }
        }
    }

    CDEX.finalize = () => {
        let promiseProvider;

        let configProvider = {
            type: 'PUT',
            url: CDEX.providerEndpoint.url + CDEX.submitEndpoint + CDEX.operationPayload.id + "$submit-data",
            data: JSON.stringify(CDEX.operationPayload),
            contentType: "application/fhir+json"
        };

        let configPayer = {
            type: 'PUT',
            url: CDEX.providerEndpoint.url + CDEX.submitEndpoint + CDEX.operationPayload.id + "$submit-data",
            data: JSON.stringify(CDEX.operationPayload),
            contentType: "application/fhir+json"
        };

        promiseProvider = $.ajax(configProvider);

        promiseProvider.then(() => {
            CDEX.displayConfirmScreen();
            let promisePayer;
            promisePayer = $.ajax(configPayer);
            promisePayer.then(() => {
            }, () => CDEX.displayErrorScreen("Communication request submission failed", "Please check the submit endpoint configuration \n You can close this window now"));
        }, () => CDEX.displayErrorScreen("Communication request submission failed", "Please check the submit endpoint configuration \n You can close this window now"));
    };

    $('#btn-create').click(function() {
        CDEX.displayDataRequestScreen();
        CDEX.addTypeSelection();
    });
    $('#btn-add').click(CDEX.addTypeSelection);
    $('#btn-review').click(CDEX.displayReviewScreen);

    $('#btn-edit').click(CDEX.displayDataRequestScreen);
    $('#btn-submit').click(CDEX.reconcile);
    $('#btn-configuration').click(CDEX.displayConfigScreen);
    $('#btn-config').click(function () {
        let selection = $('#config-select').val();
        if (selection !== 'custom') {
            window.localStorage.setItem("cdex-app-config", JSON.stringify({'selection': parseInt(selection)}));
        } else {
            let configtext = $('#config-text').val();
            let myconf;
            try {
                myconf = JSON.parse(configtext);
                window.localStorage.setItem("cdex-app-config", JSON.stringify({'custom': myconf}));
            } catch (err) {
                alert ("Unable to parse configuration. Please try again.");
            }
        }
        CDEX.loadConfig();
        CDEX.displayReviewScreen();
    });

    CDEX.providerEndpoints.forEach((e, id) => {
        $('#config-select').append("<option value='" + id + "'>" + e.name + "</option>");
    });
    $('#config-select').append("<option value='custom'>Custom</option>");
    $('#config-text').val(JSON.stringify(CDEX.providerEndpoints[0],null,"   "));

    $('#config-select').on('change', function() {
        if (this.value !== "custom") {
            $('#config-text').val(JSON.stringify(CDEX.providerEndpoints[parseInt(this.value)],null,2));
        }
    });

    $('#config-text').bind('input propertychange', () => {
        $('#config-select').val('custom');
    });

    FHIR.oauth2.ready(CDEX.initialize);

}());
