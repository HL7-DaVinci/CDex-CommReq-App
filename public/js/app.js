var CDEX;
if (!CDEX) {
    CDEX = {};
}

var PATIENT;
if (!PATIENT) {
    PATIENT = {};
}

var CLAIM;
if (!CLAIM) {
    CLAIM = {};
}

(function () {

    CDEX.client = null;
    CDEX.patient = null;
    CDEX.index = 0;
    CDEX.subscribe = false;

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
        $('#task-intro-screen').hide();
        $('#preview-communication-screen').hide();
        $('#preview-screen').hide();
        $('#data-request-screen').hide();
        $('#review-screen').hide();
        $('#confirm-screen').hide();
        $('#dq-confirm-screen').hide();
        $('#config-screen').hide();
        $('#communication-request-screen').hide();
        $('#direct-query-request-screen').hide();
        $('#attachment-submit-screen').hide();
        $('#query-request-screen').hide();
        $('#attachment-confirm-screen').hide();
        $('#attachment-requested-screen').hide();
        $('#attachment-submit-screen').hide();
        $('#request-provider-attachments').hide();
        $('#submit-payer-attachments').hide();
        $('#attch-request-screen').hide();
        $('#attch-req-confirm-screen').hide();
        if (screenID === 'intro-screen') {
            $('#task-intro-screen').show();
        } else {
            $('#' + screenID).show();
        }
    };

    CDEX.displayIntroScreen = () => {
        CDEX.displayScreen('intro-screen');
    }

    CDEX.displayPreviewCommunicationScreen = (comm) => {
        CDEX.displayScreen('preview-communication-screen');

        let resources = {
            "docRefs": [],
            "queries": []
        }

        let table = "";

        comm.forEach(function (content, index) {
            if (content.resourceType === "DocumentReference") {
                resources.docRefs.push(content);
            } else {
                resources.queries.push(content);
            }
        });

        resources.docRefs.forEach((resource) => {
            table += "<table class='table'><thead><th>Document</th></thead><tbody>";
            table += "<tr><td>" + CDEX.openPreview(resource) + "</td></tr>";
            table += "</tbody></table>";
        });

        resources.queries.forEach((resource) => {
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
        const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
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

            const blob = new Blob(byteArrays, { type: contentType });
            return blob;
        }

        if (attachment.contentType === "application/pdf") {
            const blob = b64toBlob(attachment.data, "application/pdf");
            return displayBlob(blob);
        } else if (attachment.contentType === "application/hl7-v3+xml") {
            return "<textarea rows='20' cols='40' style='border:none;'>" + atob(attachment.data) + "</textarea>";
        } else if (attachment.contentType === "application/fhir+xml") {
            let bundle = JSON.parse(atob(attachment.data));
            let result = "";
            bundle.entry.forEach(function (content) {
                if (content.resource.text) { result += content.resource.text.div; }
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

    CDEX.showTimePicker = () => {
        if ($('#subobs1').is(':checked')) {
            $('#obs-time').show();
            $('#select-range').show();
        } else {
            $('#obs-time').hide();
            $('#select-range').hide();
        }
    };

    CDEX.showClaimTimePicker = () => {
        if ($('#subclaim0').is(':checked')) {
            $('#claim-time').show();
            $('#select-range-claim').show();
        } else {
            $('#claim-time').hide();
            $('#select-range-claim').hide();
        }
    };

    CDEX.claimSubsearch = () => {
        let subsearchParam = 0;
        CDEX.claimParameters.criteria.forEach((value) => {
            $('#subsearch').append(
                "<div><input type='checkbox' id='subclaim" + subsearchParam +
                "' value='" + value.value + "'>" +
                "<label for='subclaim" + subsearchParam + "'>" + value.name +
                "</label></div></div>"
            );
            if (value.value === "date") {
                $('#subclaim0').change(function () {
                    CDEX.showClaimTimePicker();
                });
                let today = new Date();
                let todayFormatted = today.getFullYear() + '/' + ('0' + (today.getMonth() + 1)).slice(-2) + '/' + ('0' + today.getDate()).slice(-2);
                $('#subsearch').append(
                    "<div class='sub-inline'>" +
                    "<div><select class='form-control' id='select-range-claim'>" +
                    "<option value='eq'>On date</option>" +
                    "<option value='lt'>Before</option>" +
                    "<option value='gt'>After</option>" +
                    "<option value='ge'>On or after</option>" +
                    "<option value='le'>On or before</option>" +
                    "</select></div>" +
                    "<input type='datetime-local' id='claim-time'" +
                    "name='claim-time' value='" + todayFormatted + "'>" +
                    "</div>"
                );
                $('#claim-time').val(new Date().toJSON().slice(0, 19));
                $('#claim-time').hide();
                $('#select-range-claim').hide();
            }
            subsearchParam++;
        });

    };

    CDEX.showCodeInput = () => {
        if ($('#subobs0').is(':checked')) {
            $('#obs-code').show();
        } else {
            $('#obs-code').hide();
        }
    };

    CDEX.observationSubsearch = () => {
        let subsearchParam = 0;
        CDEX.observationParameters.criteria.forEach((value) => {
            $('#subsearch').append(
                "<div><input type='checkbox' id='subobs" + subsearchParam +
                "' value='" + value.value + "'>" +
                "<label for='signature'>" + value.name +
                "</label></div></div>"
            );
            if (value.value === "date") {
                $('#subobs1').change(function () {
                    CDEX.showTimePicker();
                });
                let today = new Date();
                let todayFormatted = today.getFullYear() + '/' + ('0' + (today.getMonth() + 1)).slice(-2) + '/' + ('0' + today.getDate()).slice(-2);
                $('#subsearch').append(
                    "<div class='sub-inline'>" +
                    "<div><select class='form-control' id='select-range'>" +
                    "<option value='eq'>On date</option>" +
                    "<option value='lt'>Before</option>" +
                    "<option value='gt'>After</option>" +
                    "<option value='ge'>On or after</option>" +
                    "<option value='le'>On or before</option>" +
                    "</select></div>" +
                    "<input type='datetime-local' id='obs-time'" +
                    "name='obs-time' value='" + todayFormatted + "'>" +
                    "</div>"
                );
                $('#obs-time').val(new Date().toJSON().slice(0, 19));
                $('#obs-time').hide();
                $('#select-range').hide();
            } else {
                $('#subobs0').change(function () {
                    CDEX.showCodeInput();
                });
                $('#subsearch').append(
                    "<div><input id='obs-code'" +
                    "name='obs-code'></div>"
                );
                $('#obs-code').hide();
            }
            subsearchParam++;
        });

    };

    CDEX.showClinicalStatus = () => {
        if ($('#condition0').is(':checked')) {
            $('#active').show();
            $('#recurrance').show();
            $('#remission').show();
            $('#foractive').show();
            $('#forrecurrance').show();
            $('#forremission').show();
        } else {
            $('#active').hide();
            $('#recurrance').hide();
            $('#remission').hide();
            $('#foractive').hide();
            $('#forrecurrance').hide();
            $('#forremission').hide();
        }
    };

    CDEX.showProvenance = () => {
        if ($('#provenance1').is(':checked')) {
            $('#sub-provenance').show();
            $('#forsub-provenance').show();
        } else {
            $('#sub-provenance').hide();
            $('#forsub-provenance').hide();
        }
    };

    CDEX.conditionSubsearch = () => {
        let subsearchParam = 0;
        CDEX.conditionParameters.criteria.forEach((value) => {
            if (value.value === "clinical-status") {
                $('#subsearch').append(
                    "<div class='sub.inline'" + subsearchParam +
                    "><input type='checkbox' id='condition" + subsearchParam +
                    "' value='" + value.value + "' class='inline-elem'>" +
                    "<label for='condition" + subsearchParam +
                    "'>" + value.name + "</label>" +
                    "<input type='checkbox' id='active' value='active' class='inline-elem'>" +
                    "<label id='foractive' for='active'>Active</label>" +
                    "<input type='checkbox' id='recurrance' value='recurrance' class='inline-elem'>" +
                    "<label id='forrecurrance' for='recurrance'>Recurrance</label>" +
                    "<input type='checkbox' id='remission' value='remission' class='inline-elem'>" +
                    "<label id='forremission' for='remission'>Remission</label>" +
                    "</div>"
                );

                $('#active').hide();
                $('#foractive').hide();
                $('#recurrance').hide();
                $('#forrecurrance').hide();
                $('#remission').hide();
                $('#forremission').hide();
                $('#condition0').change(function () {
                    CDEX.showClinicalStatus();
                });

            }
            if (value.value === "_revinclude") {
                $('#subsearch').append(
                    "<div class='sub.inline'" + subsearchParam +
                    "><input type='checkbox' id='provenance" + subsearchParam +
                    "' value='" + value.value + "' class='inline-elem'>" +
                    "<label for='provenance" + subsearchParam +
                    "'>" + value.name + "</label>" +
                    "<input type='checkbox' id='sub-provenance' value='_revinclude' class='inline-elem'>" +
                    "<label id='forsub-provenance' for='sub-provenance'>Provenance:target</label>" +
                    "</div>"
                );
                $('#sub-provenance').prop('checked', true);
                $('#sub-provenance').hide();
                $('#forsub-provenance').hide();

                $('#provenance1').change(function () {
                    CDEX.showProvenance();
                });
            }
            subsearchParam++;
        });

    };

    CDEX.showDocInput = () => {
        if ($('#subdoc0').is(':checked')) {
            $('#codes').show();
        } else {
            $('#codes').hide();
        }
    };

    CDEX.showCatInput = () => {
        if ($('#subdoc1').is(':checked')) {
            $('#categories').show();
        } else {
            $('#categories').hide();
        }
    };

    CDEX.documentSubsearch = () => {
        let subsearchParam = 0;
        CDEX.documentReferenceParameters.criteria.forEach((value) => {
            $('#subsearch').append(
                "<div id='doc" + subsearchParam + "'><input type='checkbox' id='subdoc" + subsearchParam +
                "' value='" + value.value + "'>" +
                "<label for='" + value.name + "'>" + value.name +
                "</label></div></div>"
            );

            if (value.value === "type") {
                $('#subdoc0').change(function () {
                    CDEX.showDocInput();
                });
                $('#doc0').append(
                    "<div id='codes'><input id='codeInput' list='codesList'>" +
                    "<datalist id='codesList'>" +
                    "</datalist></div>"
                );
                CDEX.loincTypes.loinc.forEach((code) => {
                    $('#codesList').append(
                        "<option value='" + code.code + "'>" +
                        code.display + "</option>"
                    );
                });
                $('#codes').hide();
            }
            if (value.value === "category") {
                $('#subdoc1').change(function () {
                    CDEX.showCatInput();
                });
                $('#doc1').append(
                    "<div id='categories'><input id='catInput' list='catList'>" +
                    "<datalist id='catList'>" +
                    "</datalist></div>"
                );
                CDEX.docRefCodes.docRefCodeList.forEach((code) => {
                    $('#catList').append(
                        "<option value='" + code.Code + "'>" +
                        code.Display + "</option>"
                    );
                });
                $('#categories').hide();
            }
            subsearchParam++;
        });

    };

    CDEX.showMedInput = () => {
        if ($('#submed0').is(':checked')) {
            $('#medcodes').show();
        } else {
            $('#medcodes').hide();
        }
    };

    CDEX.medicationSubsearch = () => {
        let subsearchParam = 0;
        CDEX.medicationParameters.criteria.forEach((value) => {
            $('#subsearch').append(
                "<div id='med" + subsearchParam + "'><input type='checkbox' id='submed" + subsearchParam +
                "' value='" + value.value + "'>" +
                "<label for='" + value.name + "'>" + value.name +
                "</label></div></div>"
            );

            if (value.value === "code") {
                $('#submed0').change(function () {
                    CDEX.showMedInput();
                });
                $('#med0').append(
                    "<div id='medcodes'><input id='medcodeInput' list='medcodesList'>" +
                    "<datalist id='medcodesList'>" +
                    "</datalist></div>"
                );
                CDEX.medCodes.snomedct.forEach((code) => {
                    $('#medcodesList').append(
                        "<option value='" + code.Code + "'>" +
                        code.Display + "</option>"
                    );
                });
                $('#medcodes').hide();
            }
            subsearchParam++;
        });

    };

    CDEX.selectSearchType = (subsearch) => {
        $('#subsearch').html("");
        switch (subsearch) {
            case "Observation":
                CDEX.observationSubsearch();
                break;
            case "Condition":
                CDEX.conditionSubsearch();
                break;
            default:
                break;
        }
    }

    CDEX.searchClaims = async (component, firstOption) => {
        $(`#${component}`).html(firstOption);
        CLAIM.claimLookupByPatient(CDEX.patient.id).then(res => {
            if (res.total > 0) {
                res.entry.forEach((value) => {
                    $(`#${component}`).append("<option value='" + value.resource.id +
                        "'>" + value.resource.id + "</option>");
                });
            } else {
                alert(`Not available claims for selected patient`);
                $("#type-claim").checked = true;
            }
        });
    }

    CDEX.displayAttachmentScreen = () => {
        CDEX.searchClaims("submit-searchClaim", "<option>-- Select tracking control number --</option>").then(() => {
            $('#loincCodes').html("<label>Code</label>");
            $('#loincCodes').append(
                "<div id='codes'><input id='codeInput' list='codesList'>" +
                "<datalist id='codesList'>" +
                "</datalist></div>"
            );
            CDEX.loincTypes.loinc.forEach((code) => {
                $('#codesList').append(
                    "<option value='" + code.code + "' id='" + code.code + "'>" +
                    code.display + "</option>"
                );
            });
            CDEX.displayScreen('attachment-submit-screen');
            $("#type-claim").click(function () {
                if ($(this).is(":checked")) {
                    $("#claimid").removeAttr("disabled");
                    $("#claimid").focus();
                    $("#submit-searchClaim").attr("disabled", "disabled");
                    $("#radio-claim").removeAttr("disabled");
                    $("#radio-auth").removeAttr("disabled");
                } else {
                    $("#claimid").attr("disabled", "disabled");
                    $("#submit-searchClaim").removeAttr("disabled");
                    $("#radio-claim").attr("disabled", "disabled");
                    $("#radio-auth").attr("disabled", "disabled");
                }
            });
        });
    };


    CDEX.displayDirectQueryScreen = () => {
        $('#search-criteria').html('');
        CDEX.searchCriteria.criteria.forEach((value) => {
            $('#search-criteria').append("<option value='" + value.value +
                "'>" + value.name + "</option>");
        });
        $('#search-criteria').change(() => {
            if ($('#search-criteria').find(":selected").val() === 'custom') {
                $('#subsearch').html(
                    "<label for='customquery'>Insert your query as {Resource}?{Search 1}&{Search 2}&...{Search n} :</label>" +
                    "<input id='customquery'" +
                    "name='customquery'>");
            } else {
                $('#subsearch').html('');
            }
        });
        CDEX.displayScreen('direct-query-request-screen');
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
        $('#final-list').html('');
        for (let idx = 0; idx < CDEX.index; idx++) {
            const primaryTypeSelected = $("#typeId" + idx).find(":selected").text();
            const secondaryTypeSelected = $("#secondaryTypeId" + idx).find(":selected").text();
            let out = primaryTypeSelected + " - " + secondaryTypeSelected;
            $('#final-list').append(out);
        }
        CDEX.subscribe = $('#subscription').is(':checked');
        $('#review-workflow').html(CDEX.subscribe ? 'Subscription' : 'Polling');

        CDEX.addToPayload();
        CDEX.displayScreen('review-screen');
    }

    CDEX.displayErrorScreen = (title, message) => {
        $('#error-title').html(title);
        $('#error-message').html(message);
        CDEX.displayScreen('error-screen');
    }

    CDEX.displayRequestAttachmentScreen = () => {
        CDEX.searchClaims("req-searchClaim", "<option>-- Select a Claim --</option>").then(() => {
            $("#req-searchClaim").on('change keydown paste input', function () {
                $('#trackingIdCol').html($('#req-searchClaim').val().toString() + "-T1234");
            });
            $('#payerIdCol').html(`${CDEX.patient.id}`);
            $('#patientAccCol').html(`${CDEX.patient.id}`);
            $('#urlCol').html(`${CDEX.payerEndpoint.url}`);
            $('#patientDOBCol').html(`${CDEX.patient.birthDate}`);
            $('#patientNameCol').html(`${CDEX.patient.name[0].given[0]} ${CDEX.patient.name[0].family}`);
            let currentDate = new Date();
            let dueDate = new Date();
            dueDate.setDate(currentDate.getDate() + 10);
            $('#serviceDateCol').html(currentDate.toISOString().slice(0, 10));
            $('#dueDateCol').html(dueDate.toISOString().slice(0, 10));
            $('#memberIdCol').html(`${CDEX.patient.id}`);
            $('#incloincCodes').html("<label>Code</label>");
            $('#incloincCodes').append(
                `<div id='codes'><input id='inccodeInput' list='codesList' class='inline-elem'>
                    <datalist id='codesList'></datalist>
                    <button type="button" class="btn btn-success btn-sm" id='btn-add-code'>+</button>
                    <button type="button" class="btn btn-danger btn-sm" id='btn-remove-code'>-</button>
                    <div id="new_chq"></div>
                </div>
                <input type="hidden" value="1" id="total_chq">`
            );
            $("#inccodeInput").on('change', function () {
                let loinVal = $("#inccodeInput").val();
                $('#loincCol').html(loinVal);
                try {
                    $('#lineItemsCol').html($(`#${loinVal}`).html());
                } catch {
                    $('#lineItemsCol').html("");
                }
                for (let index = 2; index <= $('#total_chq').val(); index++) {
                    loinVal = $(`#new_${index}`).val();
                    $('#loincCol').append(`, ${loinVal}`);
                    try {
                        $('#lineItemsCol').append(", " + $(`#${loinVal}`).html());
                    } catch { }
                }
            });
            $("#req-searchClaim").on('change', function () {
                $('#claimIdCol').html($("#req-searchClaim").val());
            });
            $("#btn-add-code").on('click', CDEX.addInputCode);
            $("#btn-remove-code").on('click', CDEX.removeInputCode);
            CDEX.loincTypes.loinc.forEach((code) => {
                $('#codesList').append(
                    "<option value='" + code.code + "' id='" + code.code + "'>" +
                    code.display + "</option>"
                );
            });
            $("#btn-create-task").on('click', CDEX.fillReqAttachmentPayload);
            CDEX.displayScreen('request-provider-attachments');
        });
    };

    CDEX.addInputCode = () => {
        var new_chq_no = parseInt($('#total_chq').val()) + 1;
        var new_input = "<div><input id='new_" + new_chq_no + "' list='codesList' class='inline-elem'></div>";

        CDEX.loincTypes.loinc.forEach((code) => {
            $(`#new_${new_chq_no}`).append(
                "<option value='" + code.code + "' id='" + code.code + "'>" +
                code.display + "</option>"
            );
        });

        $('#new_chq').append(new_input);

        $('#total_chq').val(new_chq_no);

        $(`#new_${new_chq_no}`).on('change', function () {
            $('#loincCol').html($("#inccodeInput").val());
            let loinVal = $("#inccodeInput").val();
            try {
                $('#lineItemsCol').html($(`#${loinVal}`).html());
            } catch {
                $('#lineItemsCol').html("");
            }
            for (let index = 2; index <= $('#total_chq').val(); index++) {
                loinVal = $(`#new_${index}`).val();
                $('#loincCol').append(`, ${loinVal}`);
                try {
                    $('#lineItemsCol').append(", " + $(`#${loinVal}`).html());
                } catch { }
            }
        });
    };

    CDEX.removeInputCode = () => {
        var last_chq_no = $('#total_chq').val();

        if (last_chq_no > 1) {
            $('#new_' + last_chq_no).remove();
            $('#total_chq').val(last_chq_no - 1);
        }

        $('#loincCol').html($("#inccodeInput").val());
        let loinVal = $("#inccodeInput").val();
        try {
            $('#lineItemsCol').html($(`#${loinVal}`).html());
        } catch {
            $('#lineItemsCol').html("");
        }
        for (let index = 2; index <= $('#total_chq').val(); index++) {
            loinVal = $(`#new_${index}`).val();
            $('#loincCol').append(`, ${loinVal}`);
            try {
                $('#lineItemsCol').append(", " + $(`#${loinVal}`).html());
            } catch { }
        }
    };

    CDEX.fillReqAttachmentPayload = () => {
        if ($("#req-searchClaim").find(':selected').val() === "-- Select a Claim --") {
            alert(`Please select a valid Claim Id`);
        } else if ($('#inccodeInput').val() === "") {
            alert(`Please specify all codes for the request`);
        } else {
            let emptyLoinc = false;
            for (let index = 2; index <= $('#total_chq').val(); index++) {
                if ($(`#new_${index}`).val() === "") {
                    emptyLoinc = true;
                    break;
                }
            }
            if (emptyLoinc && $('#total_chq').val() > 1) {
                alert(`Please specify all codes for the request`);
            } else {
                CDEX.requestAttachmentPayload.identifier[0].system = CDEX.payerEndpoint.url.toString();
                CDEX.requestAttachmentPayload.id = $('#req-searchClaim').val().toString() + "-T1234";
                CDEX.requestAttachmentPayload.identifier[0].value = $('#req-searchClaim').val().toString() + "-T1234";
                CDEX.requestAttachmentPayload.for.reference = CDEX.payerEndpoint.url + "/Patient/" + CDEX.patient.id;
                CDEX.requestAttachmentPayload.authoredOn = $('#serviceDateCol').html();
                CDEX.requestAttachmentPayload.lastModified = $('#serviceDateCol').html();
                CDEX.requestAttachmentPayload.requester.identifier.value = CDEX.patient.id;
                CDEX.requestAttachmentPayload.owner.identifier.value = "cdex-example-practitioner";
                CDEX.requestAttachmentPayload.restriction.period.end = $('#dueDateCol').html();

                //Create line item
                CDEX.requestAttachmentPayload.input = [];
                let loinVal = $('#inccodeInput').val();
                CDEX.addAttachmentRequest($('#inccodeInput').val(), $(`#${loinVal}`).html(), $(`#${loinVal}`).html(), 1);

                for (let index = 2; index <= $('#total_chq').val(); index++) {
                    loinVal = $(`#new_${index}`).val();
                    CDEX.addAttachmentRequest(loinVal, $(`#${loinVal}`).html(), $(`#${loinVal}`).html(), index);
                }

                if ($('#task-signature').is(":checked")) {
                    CDEX.requestAttachmentPayload.input.push(
                        {
                            "type": {
                                "coding": [
                                    {
                                        "system": "http://hl7.org/fhir/us/davinci-cdex/CodeSystem/cdex-temp",
                                        "code": "signature-flag"
                                    }
                                ]
                            },
                            "valueBoolean": true
                        }
                    );
                } else {
                    CDEX.requestAttachmentPayload.input.push(
                        {
                            "type": {
                                "coding": [
                                    {
                                        "system": "http://hl7.org/fhir/us/davinci-cdex/CodeSystem/cdex-temp",
                                        "code": "signature-flag"
                                    }
                                ]
                            },
                            "valueBoolean": false
                        }
                    );
                }

                CDEX.requestAttachmentPayload.input.push(
                    {
                        "type": {
                            "coding": [
                                {
                                    "system": "http://hl7.org/fhir/us/davinci-cdex/CodeSystem/cdex-temp",
                                    "code": "payer-url"
                                }
                            ]
                        },
                        "valueUrl": `${CDEX.payerEndpoint.url}/$submit-attachment`
                    },
                    {
                        "type": {
                            "coding": [
                                {
                                    "system": "http://hl7.org/fhir/us/davinci-cdex/CodeSystem/cdex-temp",
                                    "code": "service-date"
                                }
                            ]
                        },
                        "valueDate": `${$('#serviceDateCol').html()}`
                    }
                );

                let configProvider = {
                    type: 'PUT',
                    url: CDEX.providerEndpoint.url + CDEX.submitTaskEndpoint + "/" + $('#req-searchClaim').val().toString() + "-T1234",
                    data: JSON.stringify(CDEX.requestAttachmentPayload),
                    contentType: "application/fhir+json"
                };
                $.ajax(configProvider).then((res) => {
                    $('#req-task-output').html(JSON.stringify(res, null, 2));
                    CDEX.displayScreen('attachment-requested-screen');
                });
            }
        }
    };

    CDEX.addAttachmentRequest = (code, display, text, lineitem) => {
        CDEX.requestAttachmentPayload.input.push(
            {
                "extension": [
                    {
                        "url": "http://hl7.org/fhir/us/davinci-pas/StructureDefinition/extension-serviceLineNumber",
                        "valuePositiveInt": lineitem
                    }
                ],
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
                            "code": `${code}`,
                            "display": `${display}`
                        }
                    ],
                    "text": `${text}`
                }
            }
        );
    };

    $('#download-reqattch').click(() => {
        CDEX.downloadAttchReqTask();
    });

    CDEX.downloadAttchReqTask = () => {
        var zip = new JSZip();
        //Task
        var resourceContent = document.getElementById('req-task-output').innerHTML;
        zip.file("requestedAttachmens.json", resourceContent);

        zip.generateAsync({ type: "blob" })
            .then(function (content) {
                // Force down of the Zip file
                saveAs(content, "reqAttachment.zip");
            });
    };

    CDEX.enable = (id) => {
        $("#" + id).prop("disabled", false);
    }

    CDEX.disable = (id) => {
        $("#" + id).prop("disabled", true);
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
        const pouId = "pouId" + CDEX.index;
        const id = CDEX.index;

        let out = "<div class='card alert-info'>" +
            "<div class='card-body' id='" + divId + "'>" +
            "<div class='form-group'><label for='" + typeId + "'>Type</label>" +
            "<select class='form-control' id='" + typeId + "'></select></div>" +
            "<div class='secondary form-group'><label for='" + secondaryTypeId + "'>Request</label>" +
            "<select class='form-control' id='" + secondaryTypeId + "'></select></div>" +
            "<div class='form-group'><label for='" + pouId + "'>Purpose of use</label>" +
            "<select class='form-control' id='" + pouId + "'></select></div>" +
            "<div><input type='checkbox' id='signature' name='signature' value='signed'>" +
            "<label for='signature'> Signature required </label></div></div>";

        $('#selection-query-list').append(out);
        $('#' + typeId).change(() => { CDEX.selectType(id) });

        for (let key in CDEX.menu) {
            $('#' + typeId).append("<option>" + CDEX.menu[key].name + "</option>");
        }

        CDEX.menu.DocRef.values.forEach((secondaryType) => {
            $('#' + secondaryTypeId).append("<option>" + secondaryType.name + "</option>");
        });

        CDEX.purposeOfUse.Purpose.values.forEach((value) => {
            $('#' + pouId).append("<option>" + value.name + "</option>");
        });
        CDEX.index++;
    }

    CDEX.selectType = (typeId) => {
        const secondaryTypeId = "secondaryTypeId" + typeId;
        const type = $("#typeId" + typeId).find(":selected").text();
        $('#divId' + typeId + ' div.secondary').empty();

        if (type === CDEX.menu.DocRef.name) {
            $('#divId' + typeId + ' div.secondary').append("<label for='" + secondaryTypeId +
                "'>Request</label><select class='form-control' id='" + secondaryTypeId + "'></select>");

            CDEX.menu.DocRef.values.forEach((secondary) => {
                $('#' + secondaryTypeId).append("<option>" + secondary.name + "</option>");
            });
        } else if (type === CDEX.menu.FHIRQuery.name) {
            $('#divId' + typeId + ' div.secondary').append("<label for='" + secondaryTypeId +
                "'>Request</label><select class='form-control' id='" + secondaryTypeId + "'></select>");

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
        let pou = {};

        communicationRequest.id = CDEX.getGUID();
        communicationRequest.contained[0].id = CDEX.getGUID();
        communicationRequest.contained[0].identifier[0].system = CDEX.providerEndpoint.url;
        communicationRequest.contained[0].identifier[0].value = CDEX.providerEndpoint.name;
        communicationRequest.recipient[0].reference = "#" + communicationRequest.contained[0].id;
        communicationRequest.authoredOn = timestamp;
        CDEX.operationPayload = communicationRequest;

        for (let idx = 0; idx < CDEX.index; idx++) {
            const primaryTypeSelected = $("#typeId" + idx).find(":selected").text();
            const secondaryTypeSelected = $("#secondaryTypeId" + idx).find(":selected").text();

            if (primaryTypeSelected === CDEX.menu.DocRef.name) {
                CDEX.menu.DocRef.values.forEach((secondaryType) => {
                    if (secondaryType.name === secondaryTypeSelected) {
                        payload[idx] = {};
                        Object.assign(payload[idx], CDEX.extensionDocRef);
                        payload[idx].valueCodeableConcept.coding[0].code = secondaryType.generalCode;
                        payload[idx].valueCodeableConcept.text = secondaryType.name;
                    }
                });
            } else if (primaryTypeSelected === CDEX.menu.FHIRQuery.name) {
                CDEX.menu.FHIRQuery.values.forEach((secondaryType) => {
                    if (secondaryType.name === secondaryTypeSelected) {
                        let queryString = secondaryType.FHIRQueryString.replace("[this patient's id]", CDEX.patient.id);
                        payload[idx] = {};
                        Object.assign(payload[idx], CDEX.extensionQuery);
                        payload[idx].valueString = queryString;
                        payload[idx].text = secondaryType.name;
                    }
                });
            }
        }

        const pouTypeSelected = $("#pouId0").find(":selected").text();
        CDEX.purposeOfUse.Purpose.values.forEach((value) => {
            if (value.name === pouTypeSelected) {
                Object.assign(pou, CDEX.pouRef);
                pou.valueCodeableConcept.coding[0].system += value.codeSystem;
                pou.valueCodeableConcept.coding[0].code = value.generalCode;
            }
        });

        task.id = communicationRequest.id;
        task.basedOn[0].reference = "CommunicationRequest/" + CDEX.operationPayload.id;
        task.authoredOn = timestamp;
        task.lastModified = timestamp;
        task.input = payload;
        task.input.push(pou);
        if ($("#signature").is(":checked")) {
            task.input.push(CDEX.docSignRef);
        }
        CDEX.taskPayload = task;
    }

    CDEX.formatDate = (date) => {
        // TODO: implement a more sensible screen date formatter that uses an ISO date parser and translates to local time
        const d = date.split('T');
        return d[0] + ' ' + d[1].substring(0, 5);
    }

    CDEX.processRequests = function (commRequests, firstRun = true) {
        let promises = [];
        for (let commReq of commRequests) {
            const url = commReq.about[0].reference;
            const promise = (async () => {
                let conf = {
                    type: 'GET',
                    url: url,
                    contentType: "application/fhir+json"
                };
                let task = await $.ajax(conf);
                return { url: url, base: commReq.contained[0].identifier[0].system, task: task };
            })();
            promises.push(promise);
        }
        let promise = $.Deferred();
        Promise.all(promises).then((results) => {
            if (firstRun) {
                $('#comm-request-list').html('');
            }
            results.sort((a, b) => (a.task.authoredOn > b.task.authoredOn) ? 1 : ((b.task.authoredOn > a.task.authoredOn) ? -1 : 0)).forEach((result) => {
                const task = result.task;
                const url = result.url;
                const base = result.base;
                const workflow = (result.url.includes(CDEX.payerEndpoint.url)) ? "subscription" : "polling";
                const reqTagID = 'REQ-' + task.id;
                if (firstRun) {
                    const out = "<tr><td><a href='" + url + "' target='_blank'>" + task.id + "</a></td><td>" + CDEX.formatDate(task.authoredOn) + "</td><td>" + workflow + "</td><td id='" + reqTagID + "'></td></tr>";
                    $('#comm-request-list').append(out);
                }

                if (task.status === "completed") {
                    const idButton = "COMM-" + task.id;
                    $('#' + reqTagID).html("<div><a href='#' id='" + idButton + "'>" + task.status + "</a></div>");
                    $('#' + idButton).click(() => {
                        let resources = [];
                        let promises = [];

                        task.output.map((e) => e.valueReference.reference).forEach((resourceURI) => {
                            promises.push((async (resourceURI) => {
                                let result = null;
                                if (resourceURI.startsWith("#")) {
                                    result = task.contained.find((e) => {
                                        return e.id === resourceURI.substring(1);
                                    });
                                } else {
                                    // based on https://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
                                    function absolute(base, relative) {
                                        if (relative.startsWith("http://") || relative.startsWith("https://")) {
                                            return relative;
                                        }
                                        var stack = base.split("/"),
                                            parts = relative.split("/");
                                        for (var i = 0; i < parts.length; i++) {
                                            if (parts[i] == ".")
                                                continue;
                                            if (parts[i] == "..")
                                                stack.pop();
                                            else
                                                stack.push(parts[i]);
                                        }
                                        return stack.join("/");
                                    }

                                    let url = absolute(base, resourceURI);
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
                    $('#' + reqTagID).html("<div>" + message + "</div>");
                }
            });
            $('#communication-request-screen-loader').hide();
            promise.resolve();
        });
        return promise;
    }

    CDEX.loadData = (client) => {
        $('#task-intro').html(CDEX.taskScenarioDescription.description);
        $('#query-intro').html(CDEX.directQueryScenarioDescription.description);
        try {
            CDEX.client = client;

            CDEX.client.patient.read().then((pt) => {
                CDEX.patient = pt;
                CDEX.displayPatient(pt);
            }).then(() => {
                CDEX.client.api.fetchAll(
                    {
                        type: "CommunicationRequest",
                        query: {
                            subject: CDEX.patient.id
                        }
                    }
                ).then((commRequests) => {
                    let commReqs = commRequests.filter(c => c.about && c.about.length > 0 && c.contained && c.contained.length > 0);
                    CDEX.processRequests(commReqs).then(() => {
                        setInterval(() => CDEX.processRequests(commReqs, false), 3000);
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
        $('#btn-submit').html("<i class='fa fa-circle-o-notch fa-spin'></i> Submit");

        CDEX.finalize();
    };

    CDEX.initialize = (client) => {
        CDEX.displayIntroScreen();
        CDEX.loadConfig();
        CDEX.loadData(client);
    };

    CDEX.loadConfig = () => {
        let configText = window.localStorage.getItem("cdex-app-config");
        if (configText) {
            let conf = JSON.parse(configText);
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

        let configPayer = {
            type: 'POST',
            url: CDEX.payerEndpoint.url + CDEX.submitEndpoint,
            data: JSON.stringify(CDEX.operationPayload),
            contentType: "application/fhir+json"
        };

        $.ajax(configPayer).then((commReq) => {
            let url = CDEX.payerEndpoint.url + CDEX.submitEndpoint + "/" + commReq.id;
            CDEX.taskPayload.basedOn[0].reference = url;
            CDEX.taskPayload.id = 's' + commReq.id;

            let subscribe = CDEX.subscribe;

            let configProvider = {
                type: subscribe ? 'PUT' : 'POST',
                url: CDEX.providerEndpoint.url + CDEX.submitTaskEndpoint + (subscribe ? ('/' + CDEX.taskPayload.id) : ''),
                data: JSON.stringify(CDEX.taskPayload),
                contentType: "application/fhir+json"
            };

            $.ajax(configProvider).then((res) => {

                CDEX.taskPayload.id = res.id;

                if (CDEX.subscribe) {
                    commReq.about = [
                        {
                            "reference": CDEX.payerEndpoint.url + CDEX.submitTaskEndpoint + "/" + CDEX.taskPayload.id
                        }
                    ];
                } else {
                    commReq.about = [
                        {
                            "reference": CDEX.providerEndpoint.url + CDEX.submitTaskEndpoint + "/" + CDEX.taskPayload.id
                        }
                    ];
                }

                let configPayer2 = {
                    type: 'PUT',
                    url: CDEX.payerEndpoint.url + CDEX.submitEndpoint + "/" + commReq.id,
                    data: JSON.stringify(commReq),
                    contentType: "application/fhir+json"
                };

                $('#request-id').html("<p><strong>Task ID:</strong> " + CDEX.taskPayload.id + "</p>");
                console.log(CDEX.taskPayload);
                $("#submit-endpoint").html(configProvider.type + ' ' + configProvider.url);
                $("#text-output").html(JSON.stringify(CDEX.taskPayload, null, '  '));

                if (CDEX.subscribe) {
                    let configPayer3 = {
                        type: 'PUT',
                        url: CDEX.payerEndpoint.url + CDEX.submitTaskEndpoint + "/" + res.id,
                        data: JSON.stringify(res),
                        contentType: "application/fhir+json"
                    };

                    CDEX.subscriptionPayload.criteria = "Task?_id=" + res.id;
                    let configProvider2 = {
                        type: 'POST',
                        url: CDEX.providerEndpoint.url + CDEX.submitSubscriptionEndpoint,
                        data: JSON.stringify(CDEX.subscriptionPayload),
                        contentType: "application/fhir+json"
                    };

                    $.when($.ajax(configPayer3), $.ajax(configProvider2)).then(() => {
                        $.ajax(configPayer2).then(() => {
                            $('#submit-endpoint2').show();
                            $("#text-output2").show();
                            console.log(CDEX.subscriptionPayload);
                            $("#submit-endpoint2").html(configProvider2.type + ' ' + configProvider2.url);
                            $("#text-output2").html(JSON.stringify(CDEX.subscriptionPayload, null, '  '));

                            CDEX.displayConfirmScreen();
                        }, () => CDEX.displayErrorScreen("Communication request submission failed", "Please check the endpoint configuration <br> You can close this window now"));
                    }, () => CDEX.displayErrorScreen("Communication request submission failed", "Please check the endpoint configuration <br> You can close this window now"));
                } else {
                    $.ajax(configPayer2).then(() => {
                        $('#submit-endpoint2').hide();
                        $("#text-output2").hide();
                        CDEX.displayConfirmScreen();
                    }, () => CDEX.displayErrorScreen("Communication request submission failed", "Please check the endpoint configuration <br> You can close this window now"));
                }
            }, () => CDEX.displayErrorScreen("Communication request submission failed", "Please check the submit endpoint configuration <br> You can close this window now"));
        }, () => CDEX.displayErrorScreen("Communication request submission failed", "Please check the submit endpoint configuration <br> You can close this window now"));

    };

    CDEX.restart = () => {
        /*$('#discharge-selection').show();
        $('#comm-request-list').html('');
        CDEX.enable('btn-submit');
        CDEX.enable('btn-edit');
        $('#btn-submit').html("Submit");
        $('#selection-query-list').html('');
        $('#communication-request-screen-loader').show();
        CDEX.index = 0;

        CDEX.loadData(CDEX.client); 
        CDEX.displayCommReqScreen(); */
        CDEX.displayScreen('task-intro-screen');
    }

    CDEX.submitSelectedAttch = (claimForTask, resource) => {

    };

    CDEX.getTasks = () => {
        let configProvider = {
            type: 'GET',
            url: `${CDEX.providerEndpoints[0].url}/Task?_patient=${CDEX.patient.id}`,
            contentType: "application/fhir+json"
        };
        $.ajax(configProvider).then((res) => {
            $('#tasks-list').html('');
            res.entry.forEach(task => {
                $('#tasks-list').append(`<tr>
                    <td>
                        <a href="https://api.logicahealth.org/DaVinciCDexProvider/open/Task/${task.resource.id}">
                            ${task.resource.id}
                        </a>
                    </td>
                    <td>${task.resource.authoredOn}</td>
                    <td><a href="#" id="btn-${task.resource.id}">View</a></td>
                    <td>${task.resource.status}</td>
                </tr>`);
                $(`#btn-${task.resource.id}`).on('click', () => {
                    $('#total_attch').val(0);
                    $('#attch-request-list').html("");
                    $('#req-patient-name').html(`${CDEX.patient.name[0].given[0]} ${CDEX.patient.name[0].family}`);
                    $('#attch-request-list').append(`<p><b>Task: </b>${task.resource.id}</p>`);
                    let claimForTask = task.resource.id.split("-T");
                    $('#attch-request-list').append(`<p><b>Claim: </b><span id="currentClaimId">${claimForTask[0]}</span></p><p><b>Requested attachments: </b></p>`);
                    task.resource.input.forEach(attch => {
                        if (attch.valueCodeableConcept) {
                            $('#attch-request-list').append(`
                                <p>${attch.valueCodeableConcept.coding[0].code} / ${attch.valueCodeableConcept.coding[0].display}</p>
                            `);
                        }
                    });
                    let configProvider = {
                        type: 'GET',
                        url: `${CDEX.payerEndpoint.url}/Observation?patient=${CDEX.patient.id}`,
                        contentType: "application/fhir+json"
                    };
                    $.ajax(configProvider).then((res) => {
                        $('#total_attch').val(1);
                        $('#selection-list').html("");
                        let current_attch = parseInt($('#total_attch').val());
                        res.entry.forEach(resource => {
                            resource.resource.code.coding.forEach(coding => {
                                if (coding.system === "http://loinc.org") {
                                    $('#selection-list').append(`
                                        <tr>
                                            <td><input type="checkbox" id="chk_${current_attch}" name="chk_${current_attch}" value="Observation/${resource.resource.id}"></td>
                                            <td>${coding.display}</td>
                                            <td>${resource.resource.issued}</td>
                                            <td>${coding.code}</td>
                                        </tr>
                                    `);
                                    current_attch++;
                                }
                            });
                        });
                        configProvider = {
                            type: 'GET',
                            url: `${CDEX.payerEndpoint.url}/Condition?patient=${CDEX.patient.id}`,
                            contentType: "application/fhir+json"
                        };
                        $.ajax(configProvider).then((res) => {
                            res.entry.forEach(resource => {
                                resource.resource.code.coding.forEach(coding => {
                                    if (coding.system === "http://loinc.org") {
                                        $('#selection-list').append(`
                                            <tr>
                                                <td><input type="checkbox" id="chk_${current_attch}" name="chk_${current_attch}" value="Condition/${resource.resource.id}"></td>
                                                <td>${coding.display}</td>
                                                <td>${resource.resource.recordedDate}</td>
                                                <td>${coding.code}</td>
                                            </tr>
                                        `);
                                        current_attch++;
                                    }
                                });
                            });
                        });
                        $('#total_attach').val(current_attch - 1);
                        $('#btn-submit-req-attch').click(function () {
                            const resourcesId = Date.now();
                            const currentDate = new Date().toISOString().slice(0, 10);

                            CDEX.claimPayloadAttachment.patient.reference = `Patient/${CDEX.patient.id}`;
                            let parameter = [
                                {
                                    "name": "AttachTo",
                                    "valueCode": "claim"
                                },
                                {
                                    "name": "TrackingId",
                                    "valueString": `${$('#currentClaimId').text()}`
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
                                        "value": `${CDEX.patient.id}`
                                    }
                                },
                                {
                                    "name": "ServiceDate",
                                    "valueDate": `${currentDate}`
                                }
                            ]
                            CDEX.attachmentRequestedPayload.id = `CDex-parameter-${resourcesId}`;

                            //Claim
                            let configProvider = {
                                type: 'GET',
                                url: `${CDEX.payerEndpoint.url}/Claim/${$('#currentClaimId').text()}`,
                                contentType: "application/fhir+json"
                            };
                            $.ajax(configProvider).then((res) => {
                                for (let index = 1; index < current_attch; index++) {
                                    if ($(`#chk_${index}`).is(':checked')) {
                                        let supportingInfo = {
                                            "sequence": 1,
                                            "category": {
                                                "text": "sample text"
                                            },
                                            "valueReference": {
                                                "reference": `${$(`#chk_${index}`).val()}`
                                            }
                                        };
                                        res.supportingInfo = [];
                                        res.supportingInfo.push(supportingInfo);
                                    }
                                }
                                CLAIM.claimUpsert(res);
                                $('#req-claim-output').html(JSON.stringify(res, null, '  '));
                            });

                            //Update attachments
                            for (let index = 1; index < current_attch; index++) {
                                if ($(`#chk_${index}`).is(':checked')) {
                                    configProvider = {
                                        type: 'GET',
                                        url: `${CDEX.payerEndpoint.url}/${$(`#chk_${index}`).val()}`,
                                        contentType: "application/fhir+json"
                                    };
                                    $.ajax(configProvider).then((resourceRes) => {
                                        //let signedRes = CDEX.signReqRes();
                                        //console.log(JSON.stringify(signedRes, null, '    '));
                                        let attachment = {
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
                                                                "code": `${resourceRes.code.coding[0].code}`,
                                                                "display": `${resourceRes.code.coding[0].display}`
                                                            }
                                                        ]
                                                    }
                                                },
                                                {
                                                    "name": "Content",
                                                    "resource": resourceRes
                                                }
                                            ]
                                        };
                                        parameter.push(attachment);
                                        CDEX.attachmentRequestedPayload.parameter = parameter;
                                        configProvider = {
                                            type: 'PUT',
                                            url: `${CDEX.payerEndpoint.url}/Parameters/${CDEX.attachmentRequestedPayload.id}`,
                                            data: JSON.stringify(CDEX.attachmentRequestedPayload),
                                            contentType: "application/json"
                                        };
                                        $.ajax(configProvider).then(response => {
                                            $('#req-parameter-output').html(JSON.stringify(response, null, '  '));
                                            console.log(response);
                                            const operationOutcome = {
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
                                            };
                                            $('#req-operation-output').html(JSON.stringify(operationOutcome, null, '  '));
                                        });
                                    });
                                }
                            }
                            CDEX.displayScreen('attch-req-confirm-screen');
                        });
                    });
                    CDEX.displayScreen('attch-request-screen');
                });
            });

            CDEX.displayScreen('submit-payer-attachments');
        }, () => CDEX.displayErrorScreen("Communication request submission failed", "Please check the submit endpoint configuration <br> You can close this window now"));
    };

    $('#req-attch-btn-restart').click(function () {
        CDEX.restart();
    });

    $('#btn-back-comm-list').click(function () {
        CDEX.displayScreen('submit-payer-attachments');
    });

    $('#req-download-resources').click(() => {
        CDEX.downloadReqResources();
    });

    CDEX.downloadReqResources = () => {
        var zip = new JSZip();
        //Parameters
        var resourceContent = document.getElementById('req-parameter-output').innerHTML;
        zip.file("parameter.json", resourceContent);

        //Claim
        resourceContent = document.getElementById('req-claim-output').innerHTML;
        zip.file("claim.json", resourceContent);

        zip.generateAsync({ type: "blob" })
            .then(function (content) {
                // Force down of the Zip file
                saveAs(content, "submitReqAttachment.zip");
            });
    };

    CDEX.signReqRes = async () => {
        const fs = require('fs');
        const cert = fs.readFileSync('../../config/cert.pem', 'utf8');

        const der = cert.toString().replace('-----BEGIN CERTIFICATE-----', '').replace('-----END CERTIFICATE-----', '').replace(/(\r\n|\n|\r)/gm, '')

        const header = {
            alg: 'RS256',
            kty: "RS",
            x5c: [der]
        }

        const privateKeyPath = path.join(__dirname, '../config/private-key.pem')
        const privateKey = fs.readFileSync(privateKeyPath)

        const key = await jose.JWK.asKey(privateKey, 'pem')

        const { id, meta, ...rest } = req.body

        const payload = canonicalize(rest)

        const signature = await jose.JWS.createSign({ format: 'compact' }, { key, header }).update(payload).final()
        const base64JWS = btoa(signature)

        const sigElement = {
            type: [
                {
                    system: "urn:iso-astm:E1762-95:2013",
                    code: "1.2.840.10065.1.12.1.5",
                    display: "Verification Signature"
                }
            ],
            when: "2021-10-05T22:42:19-07:00",
            who: {
                reference: "Practitioner/123"
            },
            onBehalfOf: {
                reference: "Organization/123"
            },
            data: base64JWS,
        }
    }

    $('#select-attch').change(function () {
        let fname = $('#select-attch').get(0).files[0].name;
        var fsize = $('#select-attch').get(0).files[0].size;

        $('#selected-attch').html(
            fname + " (<b>" + fsize + "</b> bytes)<br />"
        );
    });

    $('#btn-task-request').click(function () {
        CDEX.displayDataRequestScreen();
        CDEX.addTypeSelection();
    });

    $('#btn-query-request').click(function () {
        //CDEX.displayScreen('query-request-screen');

        if ($('#search-criteria')[0].selectedIndex === 2) {
            if ($('#customquery').val() === '') {
                alert("Please specify a custom query");
            } else {
                CDEX.directQueryRequest();
            }
        } else {
            CDEX.directQueryRequest();
        }

    });

    $('#btn-attch-submit').click(() => {
        let claimID = "";
        if ($("#type-claim").is(':checked')) {
            claimID = $("#claimid").val()
        } else {
            claimID = $("#submit-searchClaim").find(':selected').val();
        }
        if ($('#select-attch').get(0).files.length == 0) {
            alert("No file(s) selected. Please select at least one file to submit");
        } else if (claimID === '-- Select tracking control number --' || claimID === "") {
            alert('Please select or specify a tracking id ');
        } else if ($('#codeInput').val() === "") {
            alert('Please select or specify a code');
        } else if ($('#serviceDate').val() === "") {
            alert('Please select or specify a service date');
        } else {
            CDEX.submitAttachments(claimID);
            $('#attachment-submit-screen').hide();
        }
    });

    $('#btn-execute-query').click(function () {
        CDEX.directQueryRequest();
    });

    $('#btn-review').click(CDEX.displayReviewScreen);
    $('#btn-task').click(CDEX.displayCommReqScreen);
    $('#btn-query').click(CDEX.displayDirectQueryScreen);
    $('#btn-attach').click(CDEX.displayAttachmentScreen);
    $('#btn-request-attach').click(CDEX.displayRequestAttachmentScreen);
    $('#btn-task-restart').click(CDEX.restart);
    $('#btn-query-restart').click(CDEX.restart);
    $('#btn-task-restart').click(CDEX.restart);
    $('#dq-btn-restart').click(CDEX.restart);
    $('#btn-restart-task').click(CDEX.restart);
    $('#btn-restart-attachment').click(CDEX.restart);
    $('#attch-btn-restart').click(CDEX.restart);
    $('#reqattch-btn-restart').click(CDEX.restart);
    $('#attch-req-restart').click(CDEX.restart);
    $('#btn-restart-comm-list').click(CDEX.restart);
    $('#btn-back').click(CDEX.displayCommReqScreen);
    $('#btn-edit').click(CDEX.displayDataRequestScreen);
    $('#btn-submit').click(CDEX.reconcile);
    $('#btn-configuration').click(CDEX.displayConfigScreen);
    $('#btn-config').click(function () {
        let selection = $('#config-select').val();
        if (selection !== 'custom') {
            window.localStorage.setItem("cdex-app-config", JSON.stringify({ 'selection': parseInt(selection) }));
        } else {
            let configtext = $('#config-text').val();
            let myconf;
            try {
                myconf = JSON.parse(configtext);
                window.localStorage.setItem("cdex-app-config", JSON.stringify({ 'custom': myconf }));
            } catch (err) {
                alert("Unable to parse configuration. Please try again.");
            }
        }
        CDEX.loadConfig();
        CDEX.displayReviewScreen();
    });
    $('#btn-submit-attach').click(CDEX.getTasks);

    CDEX.providerEndpoints.forEach((e, id) => {
        $('#config-select').append("<option value='" + id + "'>" + e.name + "</option>");
    });
    $('#config-select').append("<option value='custom'>Custom</option>");
    $('#config-text').val(JSON.stringify(CDEX.providerEndpoints[0], null, "   "));

    $('#config-select').on('change', function () {
        if (this.value !== "custom") {
            $('#config-text').val(JSON.stringify(CDEX.providerEndpoints[parseInt(this.value)], null, 2));
        }
    });

    $('#config-text').bind('input propertychange', () => {
        $('#config-select').val('custom');
    });

    FHIR.oauth2.ready(CDEX.initialize);

    CDEX.submitAttachments = (claimId) => {
        let operationOutcome = '';
        const reader = new FileReader();
        const resourcesId = Date.now();
        const fileName = $('#select-attch').get(0).files.item(0);

        CDEX.claimPayloadAttachment.patient.reference = `Patient/${CDEX.patient.id}`;

        CDEX.attachmentPayload.id = `CDex-parameter-${resourcesId}`;
        CDEX.attachmentPayload.parameter[0].valueCode = 'claim';//To check: $('#radio-claim').is(':checked')?'claim':'prior-auth';
        CDEX.attachmentPayload.parameter[1].valueString = `${claimId}`;
        CDEX.attachmentPayload.parameter[4].valueIdentifier.value = `${CDEX.patient.id}`;
        CDEX.attachmentPayload.parameter[5].valueDate = $('#serviceDate').val();
        //Setting the parameters payload
        CDEX.attachmentPayload.parameter[6].part[1].valueCodeableConcept.coding[0].code = `${$('#codeInput').val()}`;
        let displayValue = $(`#${CDEX.attachmentPayload.parameter[6].part[1].valueCodeableConcept.coding[0].code}`).text();
        CDEX.attachmentPayload.parameter[6].part[1].valueCodeableConcept.coding[0].display = `${displayValue}`;

        if (fileName.type === 'application/pdf' || fileName.type === "text/xml") {
            reader.readAsDataURL(fileName);
            reader.onloadend = (evt) => {
                if (evt.target.readyState === FileReader.DONE) {
                    //Setting the document reference
                    CDEX.documentReferencePayload.content[0].attachment.data = `${reader.result.split(';base64,')[1]}`;
                    CDEX.documentReferencePayload.content[0].attachment.title = `${$('#select-attch').get(0).files.item(0).name}`;
                    CDEX.documentReferencePayload.content[0].attachment.contentType = `${fileName.type}`;
                    CDEX.documentReferencePayload.id = `CDex-Document-Reference-${resourcesId}`;

                    CDEX.attachmentPayload.parameter[6].part[2].resource = CDEX.documentReferencePayload;

                    let configProvider = {
                        type: 'PUT',
                        url: `${CDEX.payerEndpoint.url}/DocumentReference/CDex-Document-Reference-${resourcesId}?upsert=true`,
                        data: JSON.stringify(CDEX.documentReferencePayload),
                        contentType: "application/json"
                    };
                    $.ajax(configProvider).then(response => {
                        $('#Resource').html('Document reference successfully created.');
                        $('#binary-output').html(JSON.stringify(response, null, '  '));
                        // CLaim lookup
                        CLAIM.claimLookupById(claimId).then((results) => {
                            if (Object.keys(results).length === 0) {
                                //New Claim creation
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
                                };
                                $('#claimCreateUpdate').html('Claim successfully created.');
                                CDEX.claimPayloadAttachment.id = claimId;
                                CDEX.claimPayloadAttachment.supportingInfo.valueReference.reference = `DocumentReference/CDex-Document-Reference-${resourcesId}`;
                                CDEX.claimPayloadAttachment.created = $("#serviceDate").val();
                                CDEX.claimPayloadAttachment.use = $('#radio-claim').is(':checked') ? 'claim' : 'preauthorization';
                                CLAIM.claimUpsert(CDEX.claimPayloadAttachment).then((results) => {
                                    $('#claim-output').html(JSON.stringify(results, null, '  '));
                                });
                            } else {
                                //Existing claim update
                                $('#claimCreateUpdate').html('Claim successfully updated.');
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
                                };
                                results.supportingInfo = {
                                    "sequence": 1,
                                    "category": {
                                        "text": "sample text"
                                    },
                                    "valueReference": {
                                        "reference": `DocumentReference/CDex-Document-Reference-${resourcesId}`
                                    }
                                }
                                CLAIM.claimUpsert(results).then((results) => {
                                    $('#claim-output').html(JSON.stringify(results, null, '  '));
                                });
                            }
                            //Parameter creation
                            configProvider = {
                                type: 'PUT',
                                url: `${CDEX.payerEndpoint.url}/Parameters/${CDEX.attachmentPayload.id}`,
                                data: JSON.stringify(CDEX.attachmentPayload),
                                contentType: "application/json"
                            };
                            $.ajax(configProvider).then(response => {
                                $('#parameter-output').html(JSON.stringify(response, null, '  '));
                                $('#operation-output').html(JSON.stringify(operationOutcome, null, '  '));
                                CDEX.displayScreen('attachment-confirm-screen');
                            });
                        });
                    });
                }
            }
        } else if (fileName.type === 'application/json') {
            reader.readAsText(fileName);
            reader.onloadend = (evt) => {
                //Setting the parameters payload
                let jsonContent = JSON.parse(reader.result);
                CDEX.attachmentPayload.parameter[6].part[2].resource = jsonContent;
                let resourceIdentifier = `CDex-${jsonContent.resourceType}-${resourcesId}`;
                if (jsonContent.id) {
                    resourceIdentifier = jsonContent.id;
                }
                if (jsonContent.resourceType !== 'Bundle')
                    jsonContent.subject.reference = `Patient/${CDEX.patient.id}`;
                else {
                    jsonContent.entry.forEach(resource => {
                        if (resource.resource.resourceType === 'Patient')
                            resource.resource.id = `Patient/${CDEX.patient.id}`;
                    });
                }
                configProvider = {
                    type: 'PUT',
                    url: `${CDEX.payerEndpoint.url}/${jsonContent.resourceType}/${resourceIdentifier}`,
                    data: JSON.stringify(jsonContent),
                    contentType: "application/json"
                };
                $.ajax(configProvider).then(response => {
                    $('#Resource').html(`${jsonContent.resourceType} resource successfully created.`);
                    $('#binary-output').html(JSON.stringify(response, null, '  '));
                    CLAIM.claimLookupById(claimId).then((results) => {
                        if (Object.keys(results).length === 0) {
                            //New Claim creation
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
                            };
                            $('#claimCreateUpdate').html('Claim successfully created.');
                            CDEX.claimPayloadAttachment.id = claimId;
                            CDEX.claimPayloadAttachment.supportingInfo.valueReference.reference = `${jsonContent.resourceType}/${jsonContent.id}`;
                            CDEX.claimPayloadAttachment.created = $("#serviceDate").val();
                            CDEX.claimPayloadAttachment.use = $('#radio-claim').is(':checked') ? 'claim' : 'preauthorization';
                            CLAIM.claimUpsert(CDEX.claimPayloadAttachment).then((results) => {
                                $('#claim-output').html(JSON.stringify(results, null, '  '));
                            });
                        } else {
                            //Existing claim update
                            $('#claimCreateUpdate').html('Claim successfully updated.');
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
                            };
                            results.supportingInfo = {
                                "sequence": 1,
                                "category": {
                                    "text": "sample text"
                                },
                                "valueReference": {
                                    "reference": `${jsonContent.resourceType}/${jsonContent.id}`
                                }
                            }
                            CLAIM.claimUpsert(results).then((results) => {
                                $('#claim-output').html(JSON.stringify(results, null, '  '));
                            });
                        }
                        //Parameter creation
                        configProvider = {
                            type: 'PUT',
                            url: `${CDEX.payerEndpoint.url}/Parameters/${CDEX.attachmentPayload.id}`,
                            data: JSON.stringify(CDEX.attachmentPayload),
                            contentType: "application/json"
                        };
                        $.ajax(configProvider).then(response => {
                            $('#parameter-output').html(JSON.stringify(response, null, '  '));
                            $('#operation-output').html(JSON.stringify(operationOutcome, null, '  '));
                            CDEX.displayScreen('attachment-confirm-screen');
                        });
                    });

                    $('#parameter-output').html(JSON.stringify(response));
                    $('#operation-output').html(JSON.stringify(operationOutcome));
                    CDEX.displayScreen('attachment-confirm-screen');
                });
            }
        }
    }

    $('#download-resources').click(() => {
        CDEX.downloadResources();
    });

    CDEX.downloadResources = () => {
        var zip = new JSZip();
        //Parameters
        var resourceContent = document.getElementById('parameter-output').innerHTML;
        zip.file("parameter.json", resourceContent);

        //Claim
        resourceContent = document.getElementById('claim-output').innerHTML;
        zip.file("claim.json", resourceContent);

        //Attachment
        resourceContent = document.getElementById('binary-output').innerHTML;
        zip.file("attachment.json", resourceContent);

        zip.generateAsync({ type: "blob" })
            .then(function (content) {
                // Force down of the Zip file
                saveAs(content, "submitAttachment.zip");
            });
    };

    CDEX.signAttachment = async (bundle) => {
        let configProvider = {
            type: 'POST',
            url: 'http://127.0.0.1:9090/api/sign',
            data: JSON.stringify(bundle),
            contentType: "application/json"
        };
        const signedBundle = $.ajax(configProvider).then(response => {
            return response;
        });
        return signedBundle;
    };

    CDEX.directQueryRequest = () => {
        let queryType = '';
        if ($('#search-criteria').val() === 'Observation - HbA1c') {
            queryType = 'Observation?patient=5849&code=4548-4';
        } else if ($('#search-criteria').val() !== 'custom') {
            queryType = `${$('#search-criteria').val()}?patient=${CDEX.patient.id}`;
        } else {
            queryType = $('#customquery').val();
        }
        let configPayer = {
            type: 'GET',
            url: `${CDEX.payerEndpoint.url}/${queryType}`,
            contentType: "application/fhir+json"
        };

        $.ajax(configPayer).then((res) => {
            $("#dq-text-output").html(JSON.stringify(res, null, '  '));
            $('#dq-submit-endpoint').html("<b>" + res.link[0].url + "</b>");
            //$('#dq-submit-endpoint').append("<b>" + res.link[0].url + "</b>");
            $('#subsearch').html('');
            CDEX.displayScreen('dq-confirm-screen');
        }, () => CDEX.displayErrorScreen("Communication request submission failed", "Please check the submit endpoint configuration <br> You can close this window now"));

    };
}());
