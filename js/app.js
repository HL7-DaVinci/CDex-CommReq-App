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

    CDEX.getGUID = () => {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    CDEX.displayPatient = (pt) => {
        $('#commRes-patient-name, #patient-name, #review-name').html(CDEX.getPatientName(pt));
    };

    CDEX.displayScreen = (screenID) => {
        $('#intro-screen').hide();
        $('#preview-communication-screen').hide();
        $('#preview-screen').hide();
        $('#data-request-screen').hide();
        $('#review-screen').hide();
        $('#confirm-screen').hide();
        $('#config-screen').hide();
        $('#communication-request-screen').hide();
        $('#'+screenID).show();
    };

    CDEX.displayIntroScreen = () => {
        CDEX.displayScreen('intro-screen');
    }

    CDEX.displayPreviewCommunicationScreen = (comm) => {
        CDEX.displayScreen('preview-communication-screen');

        let resources = {
            "docRefs" : [],
            "queries" : []
        }

        let table = "";

        comm.forEach(function (content, index) {
            if(content.resourceType === "DocumentReference") {
                resources.docRefs.push(content);
            } else {
                resources.queries.push(content);
            }
        });
        
        resources.docRefs.forEach ((resource) => {
                table += "<table class='table'><thead><th>Document</th></thead><tbody>";
                table += "<tr><td>" + CDEX.openPreview(resource) + "</td></tr>";
                table += "</tbody></table>";
        });

        resources.queries.forEach ((resource) => {
            table += "<table class='table'><tbody><tr><td><h5>Resource</h5></td></tr>";
            table += "<tr><td><pre>" + JSON.stringify(resource, null, "  ") + "</pre></td></tr></tbody></table>";
        });

        if (table.length === 0) table = "<h4>No content found in communication</h4>"
        $('#resources-list').html(table);
    }

    CDEX.openPreview = (docRef) => {
        let attachment = docRef.content[0].attachment;

        const displayBlob = (blob) => {
            const blobUrl = URL.createObjectURL(blob);
            const blobType = blob.type;
            return "<p><object data='" + blobUrl + "' type='" + blobType + "' width='100%' height='600px' /></p>";
        }

        // based on https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
        const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
            const byteCharacters = atob(b64Data);
            const byteArrays = [];

            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                const slice = byteCharacters.slice(offset, offset + sliceSize);

                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            const blob = new Blob(byteArrays, {type: contentType});
            return blob;
        }

        if (attachment.contentType === "application/pdf") {
            const blob = b64toBlob(attachment.data, "application/pdf");
            return displayBlob(blob);
        }else if(attachment.contentType === "application/hl7-v3+xml"){
            return "<textarea rows='20' cols='40' style='border:none;'>" + atob(attachment.data) + "</textarea>";
        }else if(attachment.contentType === "application/fhir+xml"){
            let bundle = JSON.parse(atob(attachment.data));
            let result = "";
            bundle.entry.forEach(function (content) {
                if (content.resource.text) {result += content.resource.text.div ;}
            });
            return result;
        }
    };

    CDEX.displayPreviewScreen = () => {
        CDEX.displayScreen('preview-screen');
    }

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
        for(let idx = 0; idx < CDEX.index; idx++){
            const primaryTypeSelected = $("#typeId" + idx).find(":selected").text();
            const secondaryTypeSelected = $("#secondaryTypeId" + idx).find(":selected").text();
            let out = "<li><span class='request-type'>"+primaryTypeSelected+":</span> <span>"+secondaryTypeSelected+"</span></li>";
            $('#final-list').append(out);
        }
        CDEX.addToPayload();
        $('#final-details-list').empty();
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

        let out =   "<div class='card alert-info'>" +
                    "<div class='card-body' id='" + divId + "'>" +
                    "<div class='form-group'><label for='"+ typeId + "'>Type</label>" +
                    "<select class='form-control' id='"+ typeId + "'></select></div>" +
                    "<div class='secondary form-group'><label for='"+ secondaryTypeId + "'>Request</label>" +
                    "<select class='form-control' id='" + secondaryTypeId + "'></select></div></div></div>";

        $('#selection-query-list').append(out);
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
        $('#divId' + typeId + ' div.secondary').empty();

        if(type === CDEX.menu.DocRef.name) {
            $('#divId' + typeId + ' div.secondary').append("<label for='"+ secondaryTypeId +
            "'>Request</label><select class='form-control' id='" + secondaryTypeId +"'></select>");

            CDEX.menu.DocRef.values.forEach((secondary) => {
                $('#' + secondaryTypeId).append("<option>" + secondary.name + "</option>");
            });
        }else if(type === CDEX.menu.FHIRQuery.name){
            $('#divId' + typeId + ' div.secondary').append("<label for='"+ secondaryTypeId +
            "'>Request</label><select class='form-control' id='" + secondaryTypeId +"'></select>");

            CDEX.menu.FHIRQuery.values.forEach((secondary) => {
                $('#' + secondaryTypeId).append("<option>" + secondary.name + "</option>");
            });
        }
    }

    CDEX.addToPayload = () => {
        let timestamp = CDEX.now();
        let communicationRequest = CDEX.operationPayload;
        let task = CDEX.taskPayload;
        let payload = [];

        communicationRequest.id = CDEX.getGUID();
        communicationRequest.contained[0].id = CDEX.getGUID();
        communicationRequest.contained[0].identifier[0].system = CDEX.providerEndpoint.url;
        communicationRequest.contained[0].identifier[0].value = CDEX.providerEndpoint.name;
        communicationRequest.recipient[0].reference = "#" + communicationRequest.contained[0].id;
        communicationRequest.authoredOn = timestamp;
        CDEX.operationPayload = communicationRequest;

        for(let idx = 0; idx < CDEX.index; idx++){
            const primaryTypeSelected = $("#typeId" + idx).find(":selected").text();
            const secondaryTypeSelected = $("#secondaryTypeId" + idx).find(":selected").text();

            if(primaryTypeSelected === CDEX.menu.DocRef.name) {
                CDEX.menu.DocRef.values.forEach((secondaryType) => {
                    if(secondaryType.name === secondaryTypeSelected) {
                        payload[idx] = {};
                        Object.assign(payload[idx], CDEX.extensionDocRef);
                        payload[idx].valueCodeableConcept.coding[0].code = secondaryType.generalCode;
                        payload[idx].valueCodeableConcept.text = secondaryType.name;
                    }
                });
            }else if(primaryTypeSelected === CDEX.menu.FHIRQuery.name){
                CDEX.menu.FHIRQuery.values.forEach((secondaryType) => {
                    if(secondaryType.name === secondaryTypeSelected) {
                        let queryString = secondaryType.FHIRQueryString.replace("[this patient's id]", CDEX.patient.id);
                        payload[idx] = {};
                        Object.assign(payload[idx], CDEX.extensionQuery);
                        payload[idx].valueString = queryString;
                        payload[idx].text = secondaryType.name;
                    }
                });
            }
        }

        task.id = communicationRequest.id;
        task.basedOn[0].reference = "CommunicationRequest/" + CDEX.operationPayload.id;
        task.authoredOn = timestamp;
        task.lastModified = timestamp;
        task.input = payload;
        CDEX.taskPayload = task;
    }

    CDEX.formatDate = (date) => {
        // TODO: implement a more sensible screen date formatter that uses an ISO date parser and translates to local time
        const d = date.split('T');
        return d[0] + ' ' + d[1].substring(0,5);
    }

    CDEX.loadData = (client) => {
        $('#scenario-intro').html(CDEX.scenarioDescription.description);
        try {
            CDEX.client = client;
            CDEX.displayIntroScreen();

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
                    let promises = [];
                    for (let commReq of commRequests) {
                        const url = commReq.contained[0].identifier[0].system + CDEX.submitTaskEndpoint + commReq.id;
                        const promise = (async () => {
                            let conf = {
                                type: 'GET',
                                url: url,
                                contentType: "application/fhir+json"
                            };
                            let task = await $.ajax(conf);
                            return {url: url, base: commReq.contained[0].identifier[0].system, task: task};
                        })();
                        promises.push(promise);
                    }
                    Promise.all(promises).then((results)=>{
                        results.sort((a,b) => (a.task.authoredOn > b.task.authoredOn) ? 1 : ((b.task.authoredOn > a.task.authoredOn) ? -1 : 0)).forEach((result) => {
                            const task = result.task;
                            const url = result.url;
                            const base = result.base;
                            const reqTagID = 'REQ-' + task.id;
                            const out = "<tr><td><a href='" + url + "' target='_blank'>" + task.id + "</a></td><td>" + CDEX.formatDate(task.authoredOn) + "</td><td id='" + reqTagID + "'></td></tr>";
                            $('#comm-request-list').append(out);

                            if (task.status === "completed") {
                                const idButton = "COMM-" + task.id;
                                $('#'+reqTagID).append("<div><a href='#' id='" + idButton + "'>" + task.status + "</a></div>");
                                $('#' + idButton).click(() => {
                                    let resources = [];
                                    let promises = [];

                                    task.output.map((e) => e.valueReference.reference).forEach((resourceURI) => {
                                        promises.push ((async (resourceURI) => {
                                            let result = null;
                                            if (resourceURI.startsWith("#")) {
                                                result = task.contained.find((e) => {
                                                    return e.id === resourceURI.substring(1);
                                                });
                                            } else {
                                                // based on https://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
                                                function absolute(base, relative) {
                                                    var stack = base.split("/"),
                                                        parts = relative.split("/");
                                                    for (var i=0; i<parts.length; i++) {
                                                        if (parts[i] == ".")
                                                            continue;
                                                        if (parts[i] == "..")
                                                            stack.pop();
                                                        else
                                                            stack.push(parts[i]);
                                                    }
                                                    return stack.join("/");
                                                }

                                                let url = absolute (base, resourceURI);
                                                let conf = {
                                                    type: 'GET',
                                                    url: url,
                                                    contentType: "application/fhir+json"
                                                };
                                                
                                                result = await $.ajax(conf);
                                            }

                                            if (result.resourceType === "Bundle") {
                                                result.entry.map((e) => e.resource).forEach((r) => {
                                                    resources.push(r);
                                                });
                                            } else {
                                                resources.push(result);
                                            }
                                        })(resourceURI));
                                    });

                                    Promise.all(promises).then(() => {
                                        CDEX.displayPreviewCommunicationScreen(resources);
                                    });
                                    return false;
                                });
                            } else {
                                let message = task.status;
                                if (task.businessStatus && task.businessStatus.text) {
                                    message += " (" + task.businessStatus.text + ")";
                                }
                                $('#'+reqTagID).append("<div>" + message + "</div>");
                            }
                        });
                        $('#communication-request-screen-loader').hide();
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

        CDEX.finalize();
    };

    CDEX.initialize = (client) => {
        CDEX.loadConfig();
        CDEX.loadData(client);
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
            url: CDEX.providerEndpoint.url + CDEX.submitTaskEndpoint + CDEX.taskPayload.id,
            data: JSON.stringify(CDEX.taskPayload),
            contentType: "application/fhir+json"
        };

        let configPayer = {
            type: 'PUT',
            url: CDEX.payerEndpoint.url + CDEX.submitEndpoint + CDEX.operationPayload.id,
            data: JSON.stringify(CDEX.operationPayload),
            contentType: "application/fhir+json"
        };

        let configPayer2 = {
            type: 'PUT',
            url: CDEX.providerEndpoint.url + CDEX.submitEndpoint + CDEX.operationPayload.id,
            data: JSON.stringify(CDEX.operationPayload),
            contentType: "application/fhir+json"
        };
        let promiseProvider2 = $.ajax(configPayer2);

        promiseProvider2.then(() => {
            promiseProvider = $.ajax(configProvider);

            promiseProvider.then(() => {
                $('#request-id').empty();
                $('#request-id').append("<p><strong>Task ID:</strong> " + CDEX.taskPayload.id + "</p>");
                CDEX.displayConfirmScreen();

                let promisePayer;
                promisePayer = $.ajax(configPayer);

                console.log(CDEX.taskPayload);
                promisePayer.then(() => {}, () => CDEX.displayErrorScreen("Communication request submission failed", "Please check the endpoint configuration <br> You can close this window now"));
            }, () => CDEX.displayErrorScreen("Communication request submission failed", "Please check the submit endpoint configuration <br> You can close this window now"));
        }, () => CDEX.displayErrorScreen("Communication request submission failed", "Please check the submit endpoint configuration <br> You can close this window now"));
    };

    $('#btn-create').click(function() {
        CDEX.displayDataRequestScreen();
        CDEX.addTypeSelection();
    });
    $('#btn-add').click(() => {
        CDEX.addTypeSelection();
        return false;
    });
    $('#btn-review').click(CDEX.displayReviewScreen);
    $('#btn-start').click(CDEX.displayCommReqScreen);
    $('#btn-back').click(CDEX.displayCommReqScreen);
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
