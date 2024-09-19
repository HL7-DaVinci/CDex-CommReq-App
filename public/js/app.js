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

let parsed;

(function () {
  CDEX.tasks = [];
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
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  };

  CDEX.displayPatient = (pt) => {
    $("#commRes-patient-name, #patient-name, #review-name").html(
      CDEX.getPatientName(pt)
    );
  };

  CDEX.displayScreen = (screenID) => {
    $("#task-intro-screen").hide();
    $("#preview-communication-screen").hide();
    $("#preview-screen").hide();
    $("#data-request-screen").hide();
    $("#review-screen").hide();
    $("#confirm-screen").hide();
    $("#dq-confirm-screen").hide();
    $("#config-screen").hide();
    $("#communication-request-screen").hide();
    $("#direct-query-request-screen").hide();
    $("#attachment-submit-screen").hide();
    $("#query-request-screen").hide();
    $("#attachment-confirm-screen").hide();
    $("#attachment-requested-screen").hide();
    $("#request-provider-attachments").hide();
    $("#submit-payer-attachments").hide();
    $("#attch-request-screen").hide();
    $("#attch-req-confirm-screen").hide();
    $("#attch-questionnaire-screen").hide();
    $("#questionnaire-req-confirm-screen").hide();
    $("#preauth-response-screen").hide();
    $("#preauth-task-screen").hide();

    if (screenID === "intro-screen") {
      $("#task-intro-screen").show();
    } else {
      $("#" + screenID).show();
    }
  };

  CDEX.completeTask = (taskId) => {
    const configProvider = {
      type: "GET",
      url: `${window.PROVIDER_SERVER_BASE_URL}/Task/${taskId}`,
      contentType: "application/fhir+json",
    };
    $.ajax(configProvider).then((taskResource) => {
      taskResource.status = "completed";
      configProvider.type = "PUT";
      configProvider.data = JSON.stringify(taskResource);
      $.ajax(configProvider).then((modifiedTaskRes) => {
        alert(`Task ${modifiedTaskRes.id} status changed to completed`);
      });
    });
  };

  $("#attachment-codes").click(function () {
    $("#lineItems").show();
    $("#incloincCodes").show();
    $("#table-task-info").show();
    $("#questionnaire-form").hide();
  });

  $("#questionnaire").click(function () {
    $("#lineItems").hide();
    $("#incloincCodes").hide();
    $("#table-task-info").hide();
    $("#questionnaire-form").show();
  });

  CDEX.displayIntroScreen = () => {
    CDEX.displayScreen("intro-screen");
  };

  CDEX.displayPreviewCommunicationScreen = (comm) => {
    CDEX.displayScreen("preview-communication-screen");

    let resources = {
      docRefs: [],
      queries: [],
    };

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
      table +=
        "<table class='table'><tbody><tr><td><h5>Resource</h5></td></tr>";
      table +=
        "<tr><td><pre>" +
        JSON.stringify(resource, null, "  ") +
        "</pre></td></tr></tbody></table>";
    });

    if (table.length === 0)
      table = "<h4>No content found in communication</h4>";
    $("#resources-list").html(table);
  };

  CDEX.openPreview = (docRef) => {
    let attachment = docRef.content[0].attachment;

    const displayBlob = (blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const blobType = blob.type;
      return (
        "<p><object data='" +
        blobUrl +
        "' type='" +
        blobType +
        "' width='100%' height='600px' /></p>"
      );
    };

    // based on https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
    const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
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
    };

    if (attachment.contentType === "application/pdf") {
      const blob = b64toBlob(attachment.data, "application/pdf");
      return displayBlob(blob);
    } else if (attachment.contentType === "application/hl7-v3+xml") {
      return (
        "<textarea rows='20' cols='40' style='border:none;'>" +
        atob(attachment.data) +
        "</textarea>"
      );
    } else if (attachment.contentType === "application/fhir+xml") {
      let bundle = JSON.parse(atob(attachment.data));
      let result = "";
      bundle.entry.forEach(function (content) {
        if (content.resource.text) {
          result += content.resource.text.div;
        }
      });
      return result;
    }
  };

  CDEX.openPreviewProvider = (docRef) => {

    let attachment = docRef.content[0].attachment;
    CDEX.displayPreviewScreen();

    const displayBlob = (blob) => {
        $('#spinner-preview').hide();
        const blobUrl = URL.createObjectURL(blob);
        const blobType = blob.type;
        $('#preview-list').html("");
        $('#preview-list').append("<p><object data='" + blobUrl + "' type='" + blobType + "' width='100%' height='600px' /></p>");
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

        if (attachment.url) {
            CDEX.client.fetchBinary(attachment.url).then(displayBlob);
        } else if (attachment.data) {
            const blob = b64toBlob(attachment.data, "application/pdf");
            displayBlob(blob);
        }
    }
    else if(attachment.contentType === "application/hl7-v3+xml"){
        let promiseBinary;
        let config = {
            type: 'GET',
            url: window.PROVIDER_SERVER_BASE_URL + attachment.url
        };

        promiseBinary = $.ajax(config);
        promiseBinary.then((binary) => {
            let oSerializer = new XMLSerializer();
            let sXML = oSerializer.serializeToString(binary);
            $('#spinner-preview').hide();
            $('#preview-list').append("<tr><td><textarea rows='20' cols='80' style='border:none;'>" + sXML + "</textarea></td></tr>")
        });
    }else if(attachment.contentType === "application/fhir+xml"){
        let promiseBundle;
        let config = {
            type: 'GET',
            url: window.PROVIDER_SERVER_BASE_URL + attachment.url
        };

        promiseBundle = $.ajax(config);
        promiseBundle.then((bundles) => {
            let bundle = bundles.entry;
            bundle.forEach(function (content) {
                if (content.resource.text) {
                    $('#spinner-preview').hide();
                    $('#preview-list').append("<tr><td>" + content.resource.text.div + "</td></tr>");
                }
            });
        });
    }
};

  CDEX.displayPreviewScreen = () => {
    CDEX.displayScreen("preview-screen");
  };

  CDEX.displayCommReqScreen = () => {
    CDEX.displayScreen("communication-request-screen");
  };

  CDEX.showTimePicker = () => {
    if ($("#subobs1").is(":checked")) {
      $("#obs-time").show();
      $("#select-range").show();
    } else {
      $("#obs-time").hide();
      $("#select-range").hide();
    }
  };

  CDEX.showClaimTimePicker = () => {
    if ($("#subclaim0").is(":checked")) {
      $("#claim-time").show();
      $("#select-range-claim").show();
    } else {
      $("#claim-time").hide();
      $("#select-range-claim").hide();
    }
  };

  CDEX.claimSubsearch = () => {
    let subsearchParam = 0;
    CDEX.claimParameters.criteria.forEach((value) => {
      $("#subsearch").append(
        "<div><input type='checkbox' id='subclaim" +
          subsearchParam +
          "' value='" +
          value.value +
          "'>" +
          "<label for='subclaim" +
          subsearchParam +
          "'>" +
          value.name +
          "</label></div></div>"
      );
      if (value.value === "date") {
        $("#subclaim0").change(function () {
          CDEX.showClaimTimePicker();
        });
        let today = new Date();
        let todayFormatted =
          today.getFullYear() +
          "/" +
          ("0" + (today.getMonth() + 1)).slice(-2) +
          "/" +
          ("0" + today.getDate()).slice(-2);
        $("#subsearch").append(
          "<div class='sub-inline'>" +
            "<div><select class='form-control' id='select-range-claim'>" +
            "<option value='eq'>On date</option>" +
            "<option value='lt'>Before</option>" +
            "<option value='gt'>After</option>" +
            "<option value='ge'>On or after</option>" +
            "<option value='le'>On or before</option>" +
            "</select></div>" +
            "<input type='datetime-local' id='claim-time'" +
            "name='claim-time' value='" +
            todayFormatted +
            "'>" +
            "</div>"
        );
        $("#claim-time").val(new Date().toJSON().slice(0, 19));
        $("#claim-time").hide();
        $("#select-range-claim").hide();
      }
      subsearchParam++;
    });
  };

  CDEX.showCodeInput = () => {
    if ($("#subobs0").is(":checked")) {
      $("#obs-code").show();
    } else {
      $("#obs-code").hide();
    }
  };

  CDEX.observationSubsearch = () => {
    let subsearchParam = 0;
    CDEX.observationParameters.criteria.forEach((value) => {
      $("#subsearch").append(
        "<div><input type='checkbox' id='subobs" +
          subsearchParam +
          "' value='" +
          value.value +
          "'>" +
          "<label for='signature'>" +
          value.name +
          "</label></div></div>"
      );
      if (value.value === "date") {
        $("#subobs1").change(function () {
          CDEX.showTimePicker();
        });
        let today = new Date();
        let todayFormatted =
          today.getFullYear() +
          "/" +
          ("0" + (today.getMonth() + 1)).slice(-2) +
          "/" +
          ("0" + today.getDate()).slice(-2);
        $("#subsearch").append(
          "<div class='sub-inline'>" +
            "<div><select class='form-control' id='select-range'>" +
            "<option value='eq'>On date</option>" +
            "<option value='lt'>Before</option>" +
            "<option value='gt'>After</option>" +
            "<option value='ge'>On or after</option>" +
            "<option value='le'>On or before</option>" +
            "</select></div>" +
            "<input type='datetime-local' id='obs-time'" +
            "name='obs-time' value='" +
            todayFormatted +
            "'>" +
            "</div>"
        );
        $("#obs-time").val(new Date().toJSON().slice(0, 19));
        $("#obs-time").hide();
        $("#select-range").hide();
      } else {
        $("#subobs0").change(function () {
          CDEX.showCodeInput();
        });
        $("#subsearch").append(
          "<div><input id='obs-code'" + "name='obs-code'></div>"
        );
        $("#obs-code").hide();
      }
      subsearchParam++;
    });
  };

  CDEX.showClinicalStatus = () => {
    if ($("#condition0").is(":checked")) {
      $("#active").show();
      $("#recurrance").show();
      $("#remission").show();
      $("#foractive").show();
      $("#forrecurrance").show();
      $("#forremission").show();
    } else {
      $("#active").hide();
      $("#recurrance").hide();
      $("#remission").hide();
      $("#foractive").hide();
      $("#forrecurrance").hide();
      $("#forremission").hide();
    }
  };

  CDEX.showProvenance = () => {
    if ($("#provenance1").is(":checked")) {
      $("#sub-provenance").show();
      $("#forsub-provenance").show();
    } else {
      $("#sub-provenance").hide();
      $("#forsub-provenance").hide();
    }
  };

  CDEX.conditionSubsearch = () => {
    let subsearchParam = 0;
    CDEX.conditionParameters.criteria.forEach((value) => {
      if (value.value === "clinical-status") {
        $("#subsearch").append(
          "<div class='sub.inline'" +
            subsearchParam +
            "><input type='checkbox' id='condition" +
            subsearchParam +
            "' value='" +
            value.value +
            "' class='inline-elem'>" +
            "<label for='condition" +
            subsearchParam +
            "'>" +
            value.name +
            "</label>" +
            "<input type='checkbox' id='active' value='active' class='inline-elem'>" +
            "<label id='foractive' for='active'>Active</label>" +
            "<input type='checkbox' id='recurrance' value='recurrance' class='inline-elem'>" +
            "<label id='forrecurrance' for='recurrance'>Recurrance</label>" +
            "<input type='checkbox' id='remission' value='remission' class='inline-elem'>" +
            "<label id='forremission' for='remission'>Remission</label>" +
            "</div>"
        );

        $("#active").hide();
        $("#foractive").hide();
        $("#recurrance").hide();
        $("#forrecurrance").hide();
        $("#remission").hide();
        $("#forremission").hide();
        $("#condition0").change(function () {
          CDEX.showClinicalStatus();
        });
      }
      if (value.value === "_revinclude") {
        $("#subsearch").append(
          "<div class='sub.inline'" +
            subsearchParam +
            "><input type='checkbox' id='provenance" +
            subsearchParam +
            "' value='" +
            value.value +
            "' class='inline-elem'>" +
            "<label for='provenance" +
            subsearchParam +
            "'>" +
            value.name +
            "</label>" +
            "<input type='checkbox' id='sub-provenance' value='_revinclude' class='inline-elem'>" +
            "<label id='forsub-provenance' for='sub-provenance'>Provenance:target</label>" +
            "</div>"
        );
        $("#sub-provenance").prop("checked", true);
        $("#sub-provenance").hide();
        $("#forsub-provenance").hide();

        $("#provenance1").change(function () {
          CDEX.showProvenance();
        });
      }
      subsearchParam++;
    });
  };

  CDEX.showDocInput = () => {
    if ($("#subdoc0").is(":checked")) {
      $("#codes").show();
    } else {
      $("#codes").hide();
    }
  };

  CDEX.showCatInput = () => {
    if ($("#subdoc1").is(":checked")) {
      $("#categories").show();
    } else {
      $("#categories").hide();
    }
  };

  CDEX.documentSubsearch = () => {
    let subsearchParam = 0;
    CDEX.documentReferenceParameters.criteria.forEach((value) => {
      $("#subsearch").append(
        "<div id='doc" +
          subsearchParam +
          "'><input type='checkbox' id='subdoc" +
          subsearchParam +
          "' value='" +
          value.value +
          "'>" +
          "<label for='" +
          value.name +
          "'>" +
          value.name +
          "</label></div></div>"
      );

      if (value.value === "type") {
        $("#subdoc0").change(function () {
          CDEX.showDocInput();
        });
        $("#doc0").append(
          "<div id='codes'><input id='codeInput' list='codesList'>" +
            "<datalist id='codesList'>" +
            "</datalist></div>"
        );
        $("#codesList").html("");
        CDEX.loincTypes.loinc.forEach((code) => {
          $("#codesList").append(
            "<option value='" + code.code + "'>" + code.display + "</option>"
          );
        });
        $("#codes").hide();
      }
      if (value.value === "category") {
        $("#subdoc1").change(function () {
          CDEX.showCatInput();
        });
        $("#doc1").append(
          "<div id='categories'><input id='catInput' list='catList'>" +
            "<datalist id='catList'>" +
            "</datalist></div>"
        );
        CDEX.docRefCodes.docRefCodeList.forEach((code) => {
          $("#catList").append(
            "<option value='" + code.Code + "'>" + code.Display + "</option>"
          );
        });
        $("#categories").hide();
      }
      subsearchParam++;
    });
  };

  CDEX.showMedInput = () => {
    if ($("#submed0").is(":checked")) {
      $("#medcodes").show();
    } else {
      $("#medcodes").hide();
    }
  };

  CDEX.medicationSubsearch = () => {
    let subsearchParam = 0;
    CDEX.medicationParameters.criteria.forEach((value) => {
      $("#subsearch").append(
        "<div id='med" +
          subsearchParam +
          "'><input type='checkbox' id='submed" +
          subsearchParam +
          "' value='" +
          value.value +
          "'>" +
          "<label for='" +
          value.name +
          "'>" +
          value.name +
          "</label></div></div>"
      );

      if (value.value === "code") {
        $("#submed0").change(function () {
          CDEX.showMedInput();
        });
        $("#med0").append(
          "<div id='medcodes'><input id='medcodeInput' list='medcodesList'>" +
            "<datalist id='medcodesList'>" +
            "</datalist></div>"
        );
        CDEX.medCodes.snomedct.forEach((code) => {
          $("#medcodesList").append(
            "<option value='" + code.Code + "'>" + code.Display + "</option>"
          );
        });
        $("#medcodes").hide();
      }
      subsearchParam++;
    });
  };

  CDEX.selectSearchType = (subsearch) => {
    $("#subsearch").html("");
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
  };

  CDEX.searchClaims = async (component, firstOption) => {
    $(`#${component}`).html(firstOption);
    CLAIM.claimLookupByPatient(window.PATIENT_ID).then((res) => {
      if (res.total > 0) {
        res.entry.forEach((value) => {
          let optionText = value.resource.id;
          if (value.resource.use === "claim") {
            optionText = optionText.concat(" (C)");
          } else {
            optionText = optionText.concat(" (PA)");
          }
          $(`#${component}`).append(
            "<option value='" +
              value.resource.id +
              "'>" +
              optionText +
              "</option>"
          );
        });
      } else {
        alert(`Not available claims for selected patient`);
        $("#type-claim").checked = true;
      }
    });
  };

  CDEX.displayAttachmentScreen = () => {
    $("#subUnsAttchPayerEndpoint").hide();
    $("#subUnsAttchPayerEndpointLabel").hide();
    $("#subUnsAttchPayerEndpointInfo").hide();
    $("#subUnsAttchPayerEndpointSpan").hide();
    CDEX.searchClaims(
      "submit-searchClaim",
      "<option>-- Select tracking control number --</option>"
    ).then(() => {
      $("#loincCodes").html(`<label>LOINC Attachment Code</label>`);
      $("#loincCodes").append(
        "<div id='codes'><input id='codeInput' list='codesList'>" +
          `<a class="btninfo" href="#" data-toggle="tooltip" data-placement="bottom">
                <i class="fa fa-info"></i>
                <span>
                    <b>LOINC Attachment Code:</b><br>
                    LOINC code to identify the specific kind of information being communicated 
                    (e.g., a discharge summary or diagnostic imaging report) It SHOULD be present when submitting unsolicited attachments. 
                    For more information about LOINC attachment codes see https://loinc.org/attachments/
                </span>
            </a>` +
          "<datalist id='codesList'>" +
          "</datalist></div>"
      );
      $("#codesList").html("");
      CDEX.loincTypes.loinc.forEach((code) => {
        $("#codesList").append(
          "<option value='" +
            code.code +
            "' id='" +
            code.code +
            "'>" +
            code.display +
            "</option>"
        );
      });
      CDEX.displayScreen("attachment-submit-screen");
      $("#type-claim").click(function () {
        if ($(this).is(":checked")) {
          $("#claimid").removeAttr("disabled");
          $("#claimid").focus();
          $("#submit-searchClaim").attr("disabled", "disabled");
          $("#radio-claim").removeAttr("disabled");
          $("#radio-auth").removeAttr("disabled");
          $("#subUnsAttchPayerEndpoint").show();
          $("#subUnsAttchPayerEndpointLabel").show();
          $("#subUnsAttchPayerEndpointInfo").show();
          $("#subUnsAttchPayerEndpointSpan").show();
        } else {
          $("#claimid").attr("disabled", "disabled");
          $("#submit-searchClaim").removeAttr("disabled");
          $("#radio-claim").attr("disabled", "disabled");
          $("#radio-auth").attr("disabled", "disabled");
          $("#subUnsAttchPayerEndpoint").hide();
          $("#subUnsAttchPayerEndpointLabel").hide();
          $("#subUnsAttchPayerEndpointInfo").hide();
          $("#subUnsAttchPayerEndpointSpan").hide();
        }
      });
    });
  };

  CDEX.displayDirectQueryScreen = () => {
    $("#search-criteria").html("");
    CDEX.searchCriteria.criteria.forEach((value) => {
      $("#search-criteria").append(
        "<option value='" + value.value + "'>" + value.name + "</option>"
      );
    });
    $("#search-criteria").change(() => {
      if ($("#search-criteria").find(":selected").val() === "custom") {
        $("#subsearch").html(
          "<label for='customquery'>Insert your query as {Resource}?{Search 1}&{Search 2}&...{Search n} :</label>" +
            "<input id='customquery'" +
            "name='customquery'>"
        );
      } else {
        $("#subsearch").html("");
      }
    });
    CDEX.displayScreen("direct-query-request-screen");
  };

  CDEX.displayDataRequestScreen = () => {
    CDEX.displayScreen("data-request-screen");
  };

  CDEX.displayConfirmScreen = () => {
    CDEX.displayScreen("confirm-screen");
  };

  CDEX.displayConfigScreen = () => {
    if (CDEX.configSetting === "custom") {
      $("#config-select").val("custom");
    } else {
      $("#config-select").val(CDEX.configSetting);
    }
    $("#config-text").val(JSON.stringify(window.PROVIDER_SERVER_BASE_URL, null, 2));
    CDEX.displayScreen("config-screen");
  };

  CDEX.displayReviewScreen = () => {
    $("#final-list").html("");
    for (let idx = 0; idx < CDEX.index; idx++) {
      const primaryTypeSelected = $("#typeId" + idx)
        .find(":selected")
        .text();
      const secondaryTypeSelected = $("#secondaryTypeId" + idx)
        .find(":selected")
        .text();
      let out = primaryTypeSelected + " - " + secondaryTypeSelected;
      $("#final-list").append(out);
    }
    CDEX.subscribe = $("#subscription").is(":checked");
    $("#review-workflow").html(CDEX.subscribe ? "Subscription" : "Polling");

    CDEX.addToPayload();
    CDEX.displayScreen("review-screen");
  };

  CDEX.dataFulfill = false;

  CDEX.rejectTask = () => {
    CDEX.operationTaskPayload.status = "rejected";
    CDEX.operationTaskPayload.businessStatus = {"text": "Unable to verify claim"};
    CDEX.operationTaskPayload.statusReason = {"text": "Unable to verify claim"};
    
    let config = {
        type: 'PUT',
        url: window.PROVIDER_SERVER_BASE_URL + CDEX.submitTaskEndpoint + "/" + CDEX.operationTaskPayload.id,
        data: JSON.stringify(CDEX.operationTaskPayload),
        contentType: "application/fhir+json"
    };
    $.ajax(config);
    CDEX.notify(CDEX.operationTaskPayload);
    CDEX.skipLoadData = true;
    CDEX.getNotAttachmentRelatedTasks();
    return false;
  }

  CDEX.taskOutputContent = [];

  CDEX.displayReviewScreenProvider = () => {
    $("#card").empty();
    $("#final-list").empty();

    let checkboxes = $('#selection-query-list input[type=checkbox]');
    if(checkboxes.length === 0){
      const confirmation = confirm("No documents available. Do you want to reject the request?");
      if(confirmation) {
        CDEX.rejectTask();
      }
    } else {
      let checkedResources = [];
      for (let i = 0; i < checkboxes.length; i++) {
          if (checkboxes[i].checked == true) {
              checkedResources.push(checkboxes[i].id);
          }
      }
      if(checkedResources.length === 0){
        const confirmation = confirm("No documents selected. Do you want to reject the request?");
        if(confirmation) {
          CDEX.rejectTask();
        }
      } else {
        let docRefs = {};
        const promises = [];

        CDEX.resources.docRef.forEach(function (docRef, index) {
          if(checkedResources.includes("docRef/" + CDEX.resources.docRef[index].id)) {
              let attachment = docRef.docRefResource.content[0].attachment;
              attachment.url = `/DocumentReference/${CDEX.resources.docRef[index].id}`;
              CDEX.resources.docRef[index].results.push({
                  "url": attachment.url,
                  "contentType": attachment.contentType
              });
              let promiseConfig = {
                  "data": "",
                  "type": attachment.contentType,
                  "category": CDEX.resources.docRef[index].category,
                  "index": index,
                  "url":window.PROVIDER_SERVER_BASE_URL + attachment.url

              }
              if (attachment.contentType === "application/pdf") {
                  if (attachment.url) {
                      let promiseBinary = new Promise((resolve, reject) => $.ajax({
                          type: 'GET',
                          url: window.PROVIDER_SERVER_BASE_URL + attachment.url,
                          success: function(data) {resolve(btoa(unescape(encodeURIComponent(data))))},
                          error: function(error) {reject(error)}
                      }));

                      promiseConfig.data = promiseBinary;
                      promises.push(promiseConfig);
                  } else if (attachment.data) {
                      promiseConfig.data = attachment.data;
                      promises.push(promiseConfig);
                  }
              } else if (attachment.contentType === "application/hl7-v3+xml") {
                  let promiseBinary =  new Promise((resolve, reject) => $.ajax({
                      type: 'GET',
                      url: window.PROVIDER_SERVER_BASE_URL + attachment.url,
                      success: function(data) {resolve(btoa(new XMLSerializer().serializeToString(data.documentElement)))},
                      error: function(error) {reject(error)}
                  }));
                  promiseConfig.data = promiseBinary;
                  promises.push(promiseConfig);
              } else if (attachment.contentType === "application/fhir+xml") {
                  let promiseBundle;
                  promiseBundle = new Promise((resolve, reject) => $.ajax({
                      type: 'GET',
                      url: window.PROVIDER_SERVER_BASE_URL + attachment.url,
                      success: function(data) {resolve(btoa(JSON.stringify(data)))},
                      error: function(error) {reject(error)}
                  }));
                  promiseConfig.data = promiseBundle;
                  promises.push(promiseConfig);
              }
          }
        });
        Promise.all(promises).then(function(values) {
          values.map(element => {
              if (typeof element.data === 'object' && element.data !== null) {
                  element.data.then(function (result) {
                      CDEX.resources.docRef[element.index].results[CDEX.resources.docRef[element.index].results.length - 1].data = result;
                  });
              }else {
                  CDEX.resources.docRef[element.index].results[CDEX.resources.docRef[element.index].results.length - 1].data = element.data;
              }
              element.category = "Documents";
              if((element.category in docRefs)){
                  docRefs[element.category].push(CDEX.resources.docRef[element.index]);
              }else{
                  docRefs[element.category] = [];
                  docRefs[element.category].push(CDEX.resources.docRef[element.index]);
              }
          })

          let tr = "";
          Object.keys(docRefs).forEach(function(key) {
              tr = "<tr> <td class='medtd'><h6>" + key +
                  "</h6></td></tr><tr><td><table><thead><th>Id</th><th>Category</th>" +
                  "<th>Created On</th></thead><tbody>";
              docRefs[key].forEach(function (data){
                  tr += "<tr><td>" + data.docRefResource.id + "</td><td>" +
                      data.docRefResource.category[0].text + "</td><td>" +
                      CDEX.formatDate(data.docRefResource.date) + "</td></tr>";
              });
              tr += "</tbody></table></td></tr>";
              $('#final-list').append(tr);
          });

          CDEX.resources.queries.forEach(function (data) {
              if (data.answers) {
                  if(checkedResources.includes("query/" + data.answers.id)) {
                      $('#final-list').append(
                          "<tr> <td class='medtd'><h6>" + data.question +
                          "</h6>" + data.answers.id + "</td></tr>");
                  } else if (data.answers[0]) {
                      if(checkedResources.includes("query/" + data.answers[0].resource.id)) {
                          $('#final-list').append(
                              "<tr> <td class='medtd'><h6>" + data.question +
                              "</h6>" + data.answers[0].resource.id + "</td></tr>");
                      }
                  }
              }
          });
        })
        checkedResources.forEach((selectedResource) => {
          CDEX.taskOutputContent.push(
            {
              type: {
                coding: [{
                  system: "http://hl7.org/fhir/us/davinci-hrex/CodeSystem/hrex-temp",
                  code : "data-value"
                }]
              },
              valueReference: {
                reference: `DocumentReference/${selectedResource.split("/")[1]}`
              }
            }
          );
        });
        CDEX.addToPayload();
        CDEX.displayScreen('review-screen');
      }
    }
  }

  CDEX.displayErrorScreen = (title, message) => {
    $("#error-title").html(title);
    $("#error-message").html(message);
    CDEX.displayScreen("error-screen");
  };

  CDEX.displayRequestAttachmentScreen = () => {
    $("#questionnaire-form").hide();
    $("#lineItems").html("");
    $("#serviceDateCol").html("");
    $("#dueDateCol").html("");
    $("#claimIdCol").html("");
    CDEX.searchClaims(
      "req-searchClaim",
      "<option>-- Select a Claim or Prior Auth --</option>"
    ).then(() => {
      $("#req-searchClaim").on("change keydown paste input", function () {
        $("#trackingIdCol").html(
          $("#req-searchClaim").val().toString() + "-T1234"
        );
        if (
          $("#req-searchClaim").val().toString() !==
          "-- Select a Claim or Prior Auth --"
        ) {
          let accessToken = window.PAYER_SERVER_TOKEN;
          let accessTokenType = window.PAYER_SERVER_TOKEN_TYPE;
          let configProvider = {
            type: "GET",
            url: `${window.PAYER_SERVER_BASE_URL}/Claim/${$("#req-searchClaim")
              .val()
              .toString()}`,
            contentType: "application/fhir+json",
            headers: {
              authorization: `${accessTokenType} ${accessToken}`,
            }

          };
          $.ajax(configProvider).then((res) => {
            let claimServiceDate = "";
            if (res.item) {
              claimServiceDate = res.created;
              $("#lineItems").html("");
              $("#lineItems").append(`<br><h5>Line items</h5>
                                                    <table class='table'>
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">Sequence</th>
                                                                <th scope="col">Code</th>
                                                                <th scope="col">Description</th>
                                                                <th scope="col">Service date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody id='lineItemsBody'>
                                                        </tbody>
                                                    </table>`);
              $("#lineItemInput").html("");
              $("#lineItemInput").append(`<option value='0' id='Line0'>
                                No line item associated</option>
                            `);
              res.item.forEach((item) => {
                $("#lineItemsBody").append(`<tr>
                                                                <td>${item.sequence}</td>
                                                                <td>${item.productOrService.coding[0].code}</td>
                                                                <td>${item.productOrService.coding[0].display}</td>
                                                                <td id='lineDate_${item.sequence}'>${item.servicedDate}</td>
                                                            </tr>`);
                $("#lineItemInput")
                  .append(`<option value='${item.sequence}' id='${item.sequence}' date='${item.servicedDate}'>
                                    Line item ${item.sequence} (${item.productOrService.coding[0].code})</option>
                                `);
              });
            }
            $("#serviceDateCol").html(claimServiceDate);
          });
        }
      });
      $("#payerIdCol").html(`${window.PATIENT_ID}`);
      $("#patientAccCol").html(`${window.PATIENT_ID}`);
      $("#urlCol").html(`${window.PAYER_SERVER_BASE_URL}`);
      $("#patientDOBCol").html(`${CDEX.patient.birthDate}`);
      $("#patientNameCol").html(
        `${CDEX.patient.name[0].given[0]} ${CDEX.patient.name[0].family}`
      );
      let currentDate = new Date();
      let dueDate = new Date();
      dueDate.setDate(currentDate.getDate() + 10);
      $("#serviceDateCol").html(currentDate.toISOString().slice(0, 10));
      $("#dueDateCol").html(dueDate.toISOString().slice(0, 10));
      $("#memberIdCol").html(`${window.PATIENT_ID}`);
      $("#incloincCodes").html(`<p class="stayover">
                                        <br>LOINC Attachment Code
                                        <span>
                                            <b>LOINC Attachment Code:</b><br>
                                            Select the LOINC attachment code(s) to communicate the missing data. Typically, these
                                            concepts represent data in document form (e.g., a PDF or CCDA). For more information about
                                            LOINC attachment codes see https://loinc.org/attachments/
                                        </span>
                                    </p>
                                    <a class="stayover" href="#" data-toggle="tooltip" data-placement="bottom">
                                        <i class="fa fa-info"></i>
                                        <span>
                                            Can optionally select one or line numbers that refer to line items in the claim or 
                                            prior authorization and are associated with the selected LOINC attachment code.
                                        </span>
                                    </a>`);
      $("#incloincCodes").append(
        `<div id='codes'><input id='inccodeInput' list='codesList' class='inline-elem'>
                    <datalist id='codesList'></datalist>
                    <button type="button" class="btn btn-success btn-sm" id='btn-add-code'>+</button>
                    <button type="button" class="btn btn-danger btn-sm" id='btn-remove-code'>-</button>
                    <select id='lineItemInput' name='lineItemInput' class='inline-elem'>
                        <option value='0' id='Line0'>No line item associated</option>
                    </select>
                    <div id="new_chq"></div>
                </div>
                <input type="hidden" value="1" id="total_chq">`
      );
      $("#inccodeInput").on("change", function () {
        let loinVal = $("#inccodeInput").val(); //#${loinVal}`).html()
        $("#loincCol").html($(`#${loinVal}`).html() + `(${loinVal})`);
        for (let index = 2; index <= $("#total_chq").val(); index++) {
          loinVal = $(`#new_${index}`).val();
          $("#loincCol").append(
            ", " + $(`#${loinVal}`).html() + "(" + loinVal + ")"
          );
        }
      });
      $("#req-searchClaim").on("change", function () {
        $("#claimIdCol").html($("#req-searchClaim").val());
      });
      $("#btn-add-code").on("click", CDEX.addInputCode);
      $("#btn-remove-code").on("click", CDEX.removeInputCode);
      $("#codesList").html("");
      CDEX.loincTypes.loinc.forEach((code) => {
        $("#codesList").append(
          "<option value='" +
            code.code +
            "' id='" +
            code.code +
            "'>" +
            code.display +
            "</option>"
        );
      });
      $("#btn-create-task").on("click", CDEX.fillReqAttachmentPayload);
      CDEX.displayScreen("request-provider-attachments");
    });
  };

  CDEX.addInputCode = () => {
    var new_chq_no = parseInt($("#total_chq").val()) + 1;
    var new_input = `<div id='div_${new_chq_no}'>
                            <input id='new_${new_chq_no}' list='codesList' class='inline-elem'>
                            <select id='lineItemInput_${new_chq_no}' name='lineItemInput' class='inline-elem'>
                                ${$("#lineItemInput").html()}
                            </select>
                        </div>`;
    $(`#new_${new_chq_no}`).html("");
    CDEX.loincTypes.loinc.forEach((code) => {
      $(`#new_${new_chq_no}`).append(
        "<option value='" +
          code.code +
          "' id='" +
          code.code +
          "'>" +
          code.display +
          "</option>"
      );
    });

    $("#new_chq").append(new_input);
    $("#total_chq").val(new_chq_no);

    $(`#new_${new_chq_no}`).on("change", function () {
      let loinVal = $("#inccodeInput").val();
      $("#loincCol").html(
        $(`#${loinVal}`).html() + "(" + $("#inccodeInput").val() + ")"
      );
      for (let index = 2; index <= $("#total_chq").val(); index++) {
        loinVal = $(`#new_${index}`).val();
        $("#loincCol").append(
          ", " + $(`#${loinVal}`).html() + "(" + loinVal + ")"
        );
      }
    });
  };

  CDEX.removeInputCode = () => {
    var last_chq_no = $("#total_chq").val();

    if (last_chq_no > 1) {
      $("#new_" + last_chq_no).remove();
      $(`#lineItemInput_${last_chq_no}`).remove();
      $("#total_chq").val(last_chq_no - 1);
    }

    let loinVal = $("#inccodeInput").val();
    $("#loincCol").html(
      $(`#${loinVal}`).html() + "(" + $("#inccodeInput").val() + ")"
    );
    for (let index = 2; index <= $("#total_chq").val(); index++) {
      loinVal = $(`#new_${index}`).val();
      $("#loincCol").append(
        ", " + $(`#${loinVal}`).html() + "(" + loinVal + ")"
      );
    }
  };

  CDEX.fillReqAttachmentPayload = () => {
    if ($("#attachment-codes").is(":checked")) {
      if (
        $("#req-searchClaim").find(":selected").val() ===
        "-- Select a Claim or Prior Auth --"
      ) {
        alert(`Please select a valid Claim Id`);
      } else if ($("#inccodeInput").val() === "") {
        alert(`Please specify all codes for the request`);
      } else {
        let emptyLoinc = false;
        for (let index = 2; index <= $("#total_chq").val(); index++) {
          if ($(`#new_${index}`).val() === "") {
            emptyLoinc = true;
            break;
          }
        }
        if (emptyLoinc && $("#total_chq").val() > 1) {
          alert(`Please specify all codes for the request`);
        } else {
          CDEX.requestAttachmentPayload.id =
            $("#req-searchClaim").val().toString() + "-T1234";
          CDEX.requestAttachmentPayload.identifier[0].system =
            window.PAYER_SERVER_BASE_URL;
          CDEX.requestAttachmentPayload.identifier[0].value = $(
            "#req-searchClaim"
          )
            .val()
            .toString();
          CDEX.requestAttachmentPayload.authoredOn =
            $("#serviceDateCol").html();
          CDEX.requestAttachmentPayload.lastModified =
            $("#serviceDateCol").html();
          CDEX.requestAttachmentPayload.requester.identifier.value =
          window.PATIENT_ID;
          CDEX.requestAttachmentPayload.owner.identifier.value =
            "cdex-example-practitioner";
          CDEX.requestAttachmentPayload.restriction.period.end =
            $("#dueDateCol").html();
          CDEX.requestAttachmentPayload.reasonReference.identifier.value = $(
            "#req-searchClaim"
          )
            .val()
            .toString();
          //CDEX.requestAttachmentPayload.contained[0].id = window.PATIENT_ID;
          CDEX.requestAttachmentPayload.contained[0].name[0].family =
            CDEX.patient.name[0].family;
          CDEX.requestAttachmentPayload.contained[0].name[0].given =
            CDEX.patient.name[0].given;
          CDEX.requestAttachmentPayload.contained[0].birthDate =
            CDEX.patient.birthDate;

          //Create line item
          CDEX.requestAttachmentPayload.input = [];
          let loinVal = $("#inccodeInput").val();
          let lineItemVal =
            $("#lineItemInput").val() > 0 ? $("#lineItemInput").val() : 0;
          CDEX.addAttachmentRequest(
            $("#inccodeInput").val(),
            $(`#${loinVal}`).html(),
            $(`#${loinVal}`).html(),
            lineItemVal
          );

          for (let index = 2; index <= $("#total_chq").val(); index++) {
            lineItemVal =
              $(`#lineItemInput_${index}`).val() > 0
                ? $(`#lineItemInput_${index}`).val()
                : 0;
            loinVal = $(`#new_${index}`).val();
            CDEX.addAttachmentRequest(
              loinVal,
              $(`#${loinVal}`).html(),
              $(`#${loinVal}`).html(),
              lineItemVal
            );
          }

          CDEX.requestAttachmentPayload.input.push({
            type: {
              coding: [
                {
                  system:
                    "http://hl7.org/fhir/us/davinci-cdex/CodeSystem/cdex-temp",
                  code: "signature-flag",
                },
              ],
            },
            valueBoolean: $("#task-signature").is(":checked"),
          });
          CDEX.requestAttachmentPayload.input.push(
            {
              type: {
                coding: [
                  {
                    system:
                      "http://hl7.org/fhir/us/davinci-cdex/CodeSystem/cdex-temp",
                    code: "payer-url",
                  },
                ],
              },
              valueUrl: `${window.PAYER_SERVER_BASE_URL}/$submit-attachment`,
            },
            {
              type: {
                coding: [
                  {
                    system:
                      "http://hl7.org/fhir/us/davinci-cdex/CodeSystem/cdex-temp",
                    code: "service-date",
                  },
                ],
              },
              valueDate: `${$("#serviceDateCol").html()}`,
            }
          );
          let providerEndpoint =
            $("#customProviderEndpoint").val() !== ""
              ? $("#customProviderEndpoint").val()
              : window.PROVIDER_SERVER_BASE_URL;

          let accessToken = window.PROVIDER_SERVER_TOKEN
          let accessTokenType = window.PROVIDER_SERVER_TOKEN_TYPE
          
          let configProvider = {
            type: "PUT",
            url:
              providerEndpoint +
              CDEX.submitTaskEndpoint +
              "/" +
              $("#req-searchClaim").val().toString() +
              "-T1234",
            data: JSON.stringify(CDEX.requestAttachmentPayload),
            contentType: "application/fhir+json",
            headers: {
              authorization: `${accessTokenType} ${accessToken}`
            }

          };

          const spanHtml = `<span class="bg-custom"><b>Task created</b><br>
                    If the Task was successfully created, The user can complete the request by clicking the “OK”
                    button below and the “Submit Solicited Attachments” button on the CDex Dashboard</span>`;
          $.ajax(configProvider)
            .then((res) => {
              $("#req-task-output").html(JSON.stringify(res, null, 2));
              CDEX.displayScreen("attachment-requested-screen");
            })
            .catch(function (error) {
              $("#req-task-output").html(JSON.stringify(error, null, "  "));
            });
        }
      }
    } else {
      if (
        $("#req-searchClaim").find(":selected").val() ===
        "-- Select a Claim or Prior Auth --"
      ) {
        alert(`Please select a valid Claim Id`);
      } else {
        CDEX.requestQuestionnairePayload.id =
          $("#req-searchClaim").val().toString() + "-Q1234";
        CDEX.requestQuestionnairePayload.authoredOn =
          $("#serviceDateCol").html();
        CDEX.requestQuestionnairePayload.lastModified =
          $("#serviceDateCol").html();
        CDEX.requestQuestionnairePayload.requester.identifier.value =
          window.PATIENT_ID;
        CDEX.requestQuestionnairePayload.owner.identifier.value =
          "cdex-example-practitioner";
        CDEX.requestQuestionnairePayload.input[2].valueBoolean =
          $("#task-signature").is(":checked");
        CDEX.requestQuestionnairePayload.reasonReference.identifier.value = $(
          "#req-searchClaim"
        )
          .val()
          .toString();
        CDEX.requestQuestionnairePayload.requester.identifier.value =
        window.PATIENT_ID;
        CDEX.requestQuestionnairePayload.owner.identifier.value =
          "cdex-example-practitioner";

        //Create input
        //TODO: Determine right value cannonical for Questionnaire
        // CDEX.requestQuestionnairePayload.input[0].valueCanonical = $(
        //   "#req-questionnaire option:selected"
        // ).val();
        let providerEndpoint =
          $("#customProviderEndpoint").val() !== ""
            ? $("#customProviderEndpoint").val()
            : window.PROVIDER_SERVER_BASE_URL;
        
        let accessToken = window.PROVIDER_SERVER_TOKEN
        let accessTokenType = window.PROVIDER_SERVER_TOKEN_TYPE
          
        let configProvider = {
          type: "PUT",
          url:
          window.PROVIDER_SERVER_BASE_URL +
            CDEX.submitTaskEndpoint +
            "/" +
            $("#req-searchClaim").val().toString() +
            "-Q1234",
          data: JSON.stringify(CDEX.requestQuestionnairePayload),
          contentType: "application/fhir+json",
          headers: {
            authorization: `${accessTokenType} ${accessToken}`,
          }
        };

        $.ajax(configProvider).then((res) => {
          $("#req-task-output").html(JSON.stringify(res, null, 2));
          CDEX.displayScreen("attachment-requested-screen");
        });
      }
    }
  };

  CDEX.addAttachmentRequest = (code, display, text, lineitem) => {
    if (lineitem) {
      CDEX.requestAttachmentPayload.input.push({
        extension: [
          {
            url: "http://hl7.org/fhir/us/davinci-pas/StructureDefinition/extension-serviceLineNumber",
            valuePositiveInt: Number(lineitem),
          },
        ],
        type: {
          coding: [
            {
              system:
                "http://hl7.org/fhir/us/davinci-hrex/CodeSystem/hrex-temp",
              code: "data-code",
            },
          ],
        },
        valueCodeableConcept: {
          coding: [
            {
              system: "http://loinc.org",
              code: `${code}`,
              display: `${display}`,
            },
          ],
          text: `${text}`,
        },
      });
    } else {
      CDEX.requestAttachmentPayload.input.push({
        type: {
          coding: [
            {
              system:
                "http://hl7.org/fhir/us/davinci-hrex/CodeSystem/hrex-temp",
              code: "data-code",
            },
          ],
        },
        valueCodeableConcept: {
          coding: [
            {
              system: "http://loinc.org",
              code: `${code}`,
              display: `${display}`,
            },
          ],
          text: `${text}`,
        },
      });
    }
  };

  $("#download-reqattch").click(() => {
    CDEX.downloadAttchReqTask();
  });

  CDEX.downloadAttchReqTask = () => {
    var zip = new JSZip();
    //Task
    var resourceContent = document.getElementById("req-task-output").innerHTML;
    zip.file("requestedAttachmens.json", resourceContent);

    zip.generateAsync({ type: "blob" }).then(function (content) {
      // Force down of the Zip file
      saveAs(content, "reqAttachment.zip");
    });
  };

  CDEX.enable = (id) => {
    $("#" + id).prop("disabled", false);
  };

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

    let out =
      "<div class='card alert-info'>" +
      "<div class='card-body' id='" +
      divId +
      "'>" +
      "<div class='form-group'><label for='" +
      typeId +
      "'>Type</label>" +
      "<select class='form-control' id='" +
      typeId +
      "'></select></div>" +
      "<div class='secondary form-group'><label for='" +
      secondaryTypeId +
      "'>Request</label>" +
      "<select class='form-control' id='" +
      secondaryTypeId +
      "'></select></div>" +
      "<div class='form-group'><label for='" +
      pouId +
      "'>Purpose of use</label>" +
      "<select class='form-control' id='" +
      pouId +
      "'></select></div>" +
      "<div><input type='checkbox' id='signature' name='signature' value='signed'>" +
      "<label for='signature'> Signature required </label></div></div>";

    $("#selection-query-list").append(out);
    $("#" + typeId).change(() => {
      CDEX.selectType(id);
    });

    for (let key in CDEX.menu) {
      $("#" + typeId).append("<option>" + CDEX.menu[key].name + "</option>");
    }

    CDEX.menu.DocRef.values.forEach((secondaryType) => {
      $("#" + secondaryTypeId).append(
        "<option>" + secondaryType.name + "</option>"
      );
    });

    CDEX.purposeOfUse.Purpose.values.forEach((value) => {
      $("#" + pouId).append("<option>" + value.name + "</option>");
    });
    CDEX.index++;
  };

  CDEX.selectType = (typeId) => {
    const secondaryTypeId = "secondaryTypeId" + typeId;
    const type = $("#typeId" + typeId)
      .find(":selected")
      .text();
    $("#divId" + typeId + " div.secondary").empty();

    if (type === CDEX.menu.DocRef.name) {
      $("#divId" + typeId + " div.secondary").append(
        "<label for='" +
          secondaryTypeId +
          "'>Request</label><select class='form-control' id='" +
          secondaryTypeId +
          "'></select>"
      );

      CDEX.menu.DocRef.values.forEach((secondary) => {
        $("#" + secondaryTypeId).append(
          "<option>" + secondary.name + "</option>"
        );
      });
    } else if (type === CDEX.menu.FHIRQuery.name) {
      $("#divId" + typeId + " div.secondary").append(
        "<label for='" +
          secondaryTypeId +
          "'>Request</label><select class='form-control' id='" +
          secondaryTypeId +
          "'></select>"
      );

      CDEX.menu.FHIRQuery.values.forEach((secondary) => {
        $("#" + secondaryTypeId).append(
          "<option>" + secondary.name + "</option>"
        );
      });
    }
  };

  CDEX.addToPayload = () => {
    let timestamp = CDEX.now();
    let communicationRequest = CDEX.operationPayload;
    let task = CDEX.taskPayload;
    let payload = [];
    let pou = {};

    communicationRequest.id = CDEX.getGUID();
    communicationRequest.contained[0].id = CDEX.getGUID();
    communicationRequest.contained[0].identifier[0].system =
    window.PROVIDER_SERVER_BASE_URL;
    communicationRequest.contained[0].identifier[0].value =
      CDEX.providerEndpoint.name;
    communicationRequest.recipient[0].reference =
      "#" + communicationRequest.contained[0].id;
    communicationRequest.authoredOn = timestamp;
    CDEX.operationPayload = communicationRequest;

    for (let idx = 0; idx < CDEX.index; idx++) {
      const primaryTypeSelected = $("#typeId" + idx)
        .find(":selected")
        .text();
      const secondaryTypeSelected = $("#secondaryTypeId" + idx)
        .find(":selected")
        .text();

      if (primaryTypeSelected === CDEX.menu.DocRef.name) {
        CDEX.menu.DocRef.values.forEach((secondaryType) => {
          if (secondaryType.name === secondaryTypeSelected) {
            payload[idx] = {};
            Object.assign(payload[idx], CDEX.extensionDocRef);
            payload[idx].valueCodeableConcept.coding[0].code =
              secondaryType.generalCode;
            payload[idx].valueCodeableConcept.text = secondaryType.name;
          }
        });
      } else if (primaryTypeSelected === CDEX.menu.FHIRQuery.name) {
        CDEX.menu.FHIRQuery.values.forEach((secondaryType) => {
          if (secondaryType.name === secondaryTypeSelected) {
            let queryString = secondaryType.FHIRQueryString.replace(
              "[this patient's id]",
              window.PATIENT_ID
            );
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
    task.basedOn[0].reference =
      "CommunicationRequest/" + CDEX.operationPayload.id;
    task.authoredOn = timestamp;
    task.lastModified = timestamp;
    task.input = payload;
    task.input.push(pou);
    if ($("#signature").is(":checked")) {
      task.input.push(CDEX.docSignRef);
    }
    CDEX.taskPayload = task;
  };

  CDEX.formatDate = (date) => {
    // TODO: implement a more sensible screen date formatter that uses an ISO date parser and translates to local time
    if(date) {
        const d = date.split('T');
        if (d.length > 1) {
            return d[0] + ' ' + d[1].substring(0, 5);
        }
    }
    return date;
}

  CDEX.processRequests = function (commRequests, firstRun = true) {
    let promises = [];
    for (let commReq of commRequests) {
      const url = commReq.about[0].reference;
      const promise = (async () => {
        let conf = {
          type: "GET",
          url: url,
          contentType: "application/fhir+json",
        };
        let task = await $.ajax(conf);
        return {
          url: url,
          base: commReq.contained[0].identifier[0].system,
          task: task,
        };
      })();
      promises.push(promise);
    }
    let promise = $.Deferred();
    Promise.all(promises).then((results) => {
      if (firstRun) {
        $("#comm-request-list").html("");
      }
      results
        .sort((a, b) =>
          a.task.authoredOn > b.task.authoredOn
            ? 1
            : b.task.authoredOn > a.task.authoredOn
            ? -1
            : 0
        )
        .forEach((result) => {
          const task = result.task;
          const url = result.url;
          const base = result.base;
          const workflow = result.url.includes(window.PAYER_SERVER_BASE_URL)
            ? "subscription"
            : "polling";
          const reqTagID = "REQ-" + task.id;
          if (firstRun) {
            const out =
              "<tr><td><a href='" +
              url +
              "' target='_blank'>" +
              task.id +
              "</a></td><td>" +
              CDEX.formatDate(task.authoredOn) +
              "</td><td>" +
              workflow +
              "</td><td id='" +
              reqTagID +
              "'></td></tr>";
            $("#comm-request-list").append(out);
          }

          if (task.status === "completed") {
            const idButton = "COMM-" + task.id;
            $("#" + reqTagID).html(
              "<div><a href='#' id='" +
                idButton +
                "'>" +
                task.status +
                "</a></div>"
            );
            $("#" + idButton).click(() => {
              let resources = [];
              let promises = [];

              task.output
                .map((e) => e.valueReference.reference)
                .forEach((resourceURI) => {
                  promises.push(
                    (async (resourceURI) => {
                      let result = null;
                      if (resourceURI.startsWith("#")) {
                        result = task.contained.find((e) => {
                          return e.id === resourceURI.substring(1);
                        });
                      } else {
                        // based on https://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
                        function absolute(base, relative) {
                          if (
                            relative.startsWith("http://") ||
                            relative.startsWith("https://")
                          ) {
                            return relative;
                          }
                          var stack = base.split("/"),
                            parts = relative.split("/");
                          for (var i = 0; i < parts.length; i++) {
                            if (parts[i] == ".") continue;
                            if (parts[i] == "..") stack.pop();
                            else stack.push(parts[i]);
                          }
                          return stack.join("/");
                        }

                        let url = absolute(base, resourceURI);
                        let conf = {
                          type: "GET",
                          url: url,
                          contentType: "application/fhir+json",
                        };

                        result = await $.ajax(conf);
                      }

                      if (result.resourceType === "Bundle") {
                        result.entry
                          .map((e) => e.resource)
                          .forEach((r) => {
                            resources.push(r);
                          });
                      } else {
                        resources.push(result);
                      }
                    })(resourceURI)
                  );
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
            $("#" + reqTagID).html("<div>" + message + "</div>");
          }
        });
      $("#communication-request-screen-loader").hide();
      promise.resolve();
    });
    return promise;
  };

  CDEX.fetchPatient = () => {
    let configPayer = {
      type: "GET",
      url: `${window.PAYER_SERVER_BASE_URL}/Patient/${window.PATIENT_ID}`,
      contentType: "application/fhir+json",
    };
    $.ajax(configPayer).then((pt) => {
      CDEX.patient = pt;
      CDEX.displayPatient(pt);
    }).catch(err => {
      console.log(err);
      CDEX.displayErrorScreen(
        "Failed to initialize request menu",
        "Please make sure that everything is OK with request configuration"
      )
    });
  };

  CDEX.loadData = () => {
    $("#query-intro").html(CDEX.directQueryScenarioDescription.description);
    CDEX.fetchPatient();
    /*try {
      CDEX.client.patient
        .read()
        .then((pt) => {
          CDEX.patient = pt;
          CDEX.displayPatient(pt);
        })
        .then(() => {
          CDEX.client.api
            .fetchAll({
              type: "CommunicationRequest",
              query: {
                subject: window.PATIENT_ID,
              },
            })
            .then((commRequests) => {
              let commReqs = commRequests.filter(
                (c) =>
                  c.about &&
                  c.about.length > 0 &&
                  c.contained &&
                  c.contained.length > 0
              );
              CDEX.processRequests(commReqs).then(() => {
                //setInterval(() => CDEX.processRequests(commReqs, false), 3000);
              });
            });
        });
    } catch (err) {
      CDEX.displayErrorScreen(
        "Failed to initialize request menu",
        "Please make sure that everything is OK with request configuration"
      );
    }*/
  };

  CDEX.reconcile = () => {
    $("#discharge-selection").hide();
    CDEX.disable("btn-submit");
    CDEX.disable("btn-edit");
    $("#btn-submit").html(
      "<i class='fa fa-circle-o-notch fa-spin'></i> Submit"
    );

    CDEX.finalize();
  };

  CDEX.initialize = () => {
    CDEX.displayIntroScreen();
    CDEX.loadConfig();
    CDEX.loadData();
  };

  CDEX.loadConfig = () => {
    let configText = window.localStorage.getItem("cdex-app-config");
    if (configText) {
      let conf = JSON.parse(configText);
      if (conf["custom"]) {
        CDEX.providerEndpoint = conf["custom"];
        CDEX.configSetting = "custom";
      } else {
        CDEX.providerEndpoint = CDEX.providerEndpoints[conf["selection"]];
        CDEX.configSetting = conf["selection"];
      }
    }
  };

  CDEX.finalize = () => {
    if(CDEX.dataFulfill) {
      CDEX.operationTaskPayload.output = CDEX.taskOutputContent;
      CDEX.operationTaskPayload.status = "completed";
      CDEX.operationTaskPayload.businessStatus.text = "Results reviewed for release";
      if(CDEX.operationTaskPayload.statusReason) {
        CDEX.operationTaskPayload.statusReason.text = "Results reviewed for release";
      }
      let configPayer = {
        type: "PUT",
        url: `${window.PROVIDER_SERVER_BASE_URL}${CDEX.submitTaskEndpoint}/${CDEX.operationTaskPayload.id}`,
        data: JSON.stringify(CDEX.operationTaskPayload),
        contentType: "application/fhir+json",
      };

      $.ajax(configPayer).then((updatedTask) => {
        $("#request-id").html(
          "<p><strong>Task ID:</strong> " + updatedTask.id + "</p>"
        );
        $("#submit-endpoint").html(
          `PUT ${window.PROVIDER_SERVER_BASE_URL}${CDEX.submitTaskEndpoint}/${CDEX.operationTaskPayload.id}`
        );
        $("#text-output").html(
          JSON.stringify(updatedTask, null, 2)
        );
        CDEX.displayConfirmScreen();
      }).catch(err => {
        console.log(err);
      });
    } else {
      let configPayer = {
        type: "POST",
        url: window.PAYER_SERVER_BASE_URL + CDEX.submitEndpoint,
        data: JSON.stringify(CDEX.operationPayload),
        contentType: "application/fhir+json",
      };

      $.ajax(configPayer).then(
        (commReq) => {
          let url =
            window.PAYER_SERVER_BASE_URL + CDEX.submitEndpoint + "/" + commReq.id;
          CDEX.taskPayload.basedOn[0].reference = url;
          CDEX.taskPayload.id = "s" + commReq.id;

          let subscribe = CDEX.subscribe;
          let accessToken = window.PROVIDER_SERVER_TOKEN;
          let accessTokenType = window.PROVIDER_SERVER_TOKEN_TYPE;
          CDEX.taskPayload.id = subscribe ? CDEX.taskPayload.id : `TBA-${Date.now()}`;
          CDEX.taskPayload.code.coding[0].code = "data-request-code";
          let configProvider = {
            type: "PUT",
            url:
            window.PROVIDER_SERVER_BASE_URL +
              CDEX.submitTaskEndpoint +
              `/${CDEX.taskPayload.id}`,
          data: JSON.stringify(CDEX.taskPayload),
            contentType: "application/fhir+json",
            headers: {
              authorization: `${accessTokenType} ${accessToken}`
            }

          };

          $.ajax(configProvider).then(
            (res) => {
              CDEX.taskPayload.id = res.id;

              if (CDEX.subscribe) {
                commReq.about = [
                  {
                    reference:
                      window.PAYER_SERVER_BASE_URL +
                      CDEX.submitTaskEndpoint +
                      "/" +
                      CDEX.taskPayload.id,
                  },
                ];
              } else {
                commReq.about = [
                  {
                    reference:
                    window.PROVIDER_SERVER_BASE_URL +
                      CDEX.submitTaskEndpoint +
                      "/" +
                      CDEX.taskPayload.id,
                  },
                ];
              }

              let configPayer2 = {
                type: "PUT",
                url:
                window.PAYER_SERVER_BASE_URL + CDEX.submitEndpoint + "/" + commReq.id,
                data: JSON.stringify(commReq),
                contentType: "application/fhir+json",
              };

              $("#request-id").html(
                "<p><strong>Task ID:</strong> " + CDEX.taskPayload.id + "</p>"
              );
              $("#submit-endpoint").html(
                configProvider.type + " " + configProvider.url
              );
              $("#text-output").html(
                JSON.stringify(CDEX.taskPayload, null, 2)
              );

              if (CDEX.subscribe) {
                let configPayer3 = {
                  type: "PUT",
                  url:
                    window.PAYER_SERVER_BASE_URL +
                    CDEX.submitTaskEndpoint +
                    "/" +
                    res.id,
                  data: JSON.stringify(res),
                  contentType: "application/fhir+json",
                };

                CDEX.subscriptionPayload.criteria = "Task?_id=" + res.id;
                let accessToken = window.PROVIDER_SERVER_TOKEN;
                let accessTokenType = window.PROVIDER_SERVER_TOKEN_TYPE;
          
                let configProvider2 = {
                  type: "POST",
                  url:
                  window.PROVIDER_SERVER_BASE_URL +
                    CDEX.submitSubscriptionEndpoint,
                  data: JSON.stringify(CDEX.subscriptionPayload),
                  contentType: "application/fhir+json",
                  headers: {
                    authorization: `${accessTokenType} ${accessToken}`
                  }

                };

                $.when($.ajax(configPayer3), $.ajax(configProvider2)).then(
                  () => {
                    $.ajax(configPayer2).then(
                      () => {
                        $("#submit-endpoint2").show();
                        $("#text-output2").show();
                        $("#submit-endpoint2").html(
                          configProvider2.type + " " + configProvider2.url
                        );
                        $("#text-output2").html(
                          JSON.stringify(CDEX.subscriptionPayload, null, "  ")
                        );

                        CDEX.displayConfirmScreen();
                      },
                      () =>
                        CDEX.displayErrorScreen(
                          "Communication request submission failed (1)",
                          "Please check the endpoint configuration <br> You can close this window now"
                        )
                    );
                  },
                  () =>
                    CDEX.displayErrorScreen(
                      "Communication request submission failed (2)",
                      "Please check the endpoint configuration <br> You can close this window now"
                    )
                );
              } else {
                $.ajax(configPayer2).then(
                  () => {
                    $("#submit-endpoint2").hide();
                    $("#text-output2").hide();
                    CDEX.displayConfirmScreen();
                  },
                  () =>
                    CDEX.displayErrorScreen(
                      "Communication request submission failed (3)",
                      "Please check the endpoint configuration <br> You can close this window now"
                    )
                );
              }
            },
            () =>
              CDEX.displayErrorScreen(
                "Communication request submission failed (4)",
                "Please check the submit endpoint configuration <br> You can close this window now"
              )
          ).catch(error => {
            console.error(error);
          });
        },
        () =>
          CDEX.displayErrorScreen(
            "Communication request submission failed (5)",
            "Please check the submit endpoint configuration <br> You can close this window now"
          )
      );
    }
  };

  CDEX.restart = () => {
    $("#questionnaire").prop("checked", false);
    $("#attachment-codes").prop("checked", true);
    $("#req-searchClaim").show();
    $("#lineItems").show();
    $("#incloincCodes").show();
    $("#check-task-signature").show();
    $("#table-task-info").show();
    $("#questionnaire-form").hide();
    CDEX.displayScreen("task-intro-screen");
  };

  CDEX.submitSelectedAttch = (claimForTask, resource) => {};

  $("#refreshQuestionnaires").click(() => {
    CDEX.getTasks();
  });

  CDEX.subscriptions = [];

  CDEX.getSubscription = (task) => {
    const taskID = task.id;
    return CDEX.subscriptions.find((s) => {
        const ch = s.channel;
        return s.criteria.startsWith('Task') && s.criteria.endsWith(taskID) && ch.type === "rest-hook" && ch.endpoint && ch.payload;
    });
};

  CDEX.notify = (task) => {
    const subscription = CDEX.getSubscription(task);
    if (subscription) {
        let config = {
            type: 'PUT',
            url: subscription.channel.endpoint + "/Task/" + task.id,
            data: JSON.stringify(task),
            contentType: "application/fhir+json"
        };
        $.ajax(config);
    }
};

  CDEX.requestProviderResource = (resourceId) => {
    let accessToken = window.PROVIDER_SERVER_TOKEN;
    let accessTokenType = window.PROVIDER_SERVER_TOKEN_TYPE;
    let configProvider = {
      type: "GET",
      url: `${window.PROVIDER_SERVER_BASE_URL}/Task/${resourceId}`,
      contentType: "application/fhir+json",
      responseType: "blob",
      headers: {
        authorization: `${accessTokenType} ${accessToken}`,
      },
    };
    $.ajax(configProvider).then(res => {
      var blob = new Blob([JSON.stringify(res, null, "  ")], { type: "application/octetstream" });
 
      //Check the Browser type and download the File.
      var isIE = false || !!document.documentMode;
      if (isIE) {
          window.navigator.msSaveBlob(blob, fileName);
      } else {
          var url = window.URL || window.webkitURL;
          link = url.createObjectURL(blob);
          var a = $("<a />");
          a.attr("download", "Task.json");
          a.attr("href", link);
          $("body").append(a);
          a[0].click();
          $("body").remove(a);
      }
    });
  }

  CDEX.getNotAttachmentRelatedTasks = () => {
    let configProvider = {
      type: "GET",
      url: `${window.PROVIDER_SERVER_BASE_URL}/Task?_sort=-_lastUpdated&_patient=${window.PATIENT_ID}`,
      contentType: "application/fhir+json",
    };
    $.ajax(configProvider).then(
      (res) => {
        $("#comm-request-list").html("");
        if (res.total > 0) {
          let index = 0;
          $('#communication-request-selection-list').empty();
            CDEX.tasks = [];
            res.entry.forEach(async (task) => {
            let out = "";
            let buttons = [];
            const idName = "btnCommReq" + index;
            const idButton = "COMM-" + idName;
            if (task.resource.code.coding[0].code === "data-request-code" ||
             task.resource.code.coding[0].code === "data-request-query" ||
             task.resource.code.coding[0].code === "data-request-questionnaire") {
              CDEX.tasks.push(task.resource);
              htmlBody = `<tr>
                            <td>
                            <button class="button-link" onClick="CDEX.requestProviderResource('${task.resource.id}')">
                            ${task.resource.id}
                            </button>
                            </td>
                            <td>${task.resource.meta.lastUpdated}</td>
                            <td>
                                Polling
                            </td>
                            <td>${task.resource.status}</td>
                        </tr>`;
              $("#comm-request-list").append(htmlBody);
               //validate task
              let conf = {
                  type: 'POST',
                  url: window.PROVIDER_SERVER_BASE_URL + "/" + task.resourceType + "/$validate?profile=http://hl7.org/fhir/us/davinci-hrex/StructureDefinition/hrex-task-data-request",
                  data: JSON.stringify(task),
                  contentType: "application/fhir+json",
                  accept: "application/fhir+json"
              };

              if (task.resource.status === "in-progress") {
                buttons.push({
                    idName: idName,
                    idButton: idButton,
                    append: "<div><a href='#' id='" + idButton + "'> fulfill </a></div>",
                    click: () => {
                      CDEX.dataFulfill = true;
                      CDEX.openCommunicationRequest(task.resource.id);
                      return false;
                    }
                });
              } else if (task.resource.status === "requested") {
                buttons.push({
                    idName: idName,
                    idButton: idButton,
                    append: "<div><a href='#' id='" + idButton + "'> acknowledge </a></div>",
                    click: () => {
                      task.resource.status = "in-progress";
                      task.resource.businessStatus = {"text": "Results will be reviewed for release"};

                      let config = {
                          type: 'PUT',
                          url: `${window.PROVIDER_SERVER_BASE_URL}/Task/${task.resource.id}`,
                          data: JSON.stringify(task.resource),
                          contentType: "application/fhir+json"
                      };
                      $.ajax(config);

                      $('#' + idButton).html(" fulfill ");
                      $('#' + idButton + "2").remove();
                      $('#' + idButton + "3").remove();
                      $('#' + idButton).click(() => {
                        CDEX.openCommunicationRequest(task.resource.id);
                        return false;
                      });
                      config.url = `${window.PAYER_SERVER_BASE_URL}/Task/${task.resource.id}`;
                      $.ajax(config).then((reqResponse) => {
                        
                      }).catch(err => {
                        console.log(JSON.stringify(err));
                      });
                      CDEX.skipLoadData = true;
                      return false;
                  }
                });
              }
              out += `<tr>
                        <td class='medtd'>
                        <button class="button-link" onClick="CDEX.requestProviderResource('${task.resource.id}')">
                        ${task.resource.id}
                        </button>
                        </td>
                        <td class='medtd'>${CDEX.formatDate(task.resource.authoredOn)}</td>
                        <td class='medtd' id='${idName}'></td></tr>`;
                $('#communication-request-selection-list').append(out);
                buttons.forEach((b) => {
                  $('#' + b.idName).append(b.append);
                  $('#' + b.idButton).click(b.click);
                });
              index++;
            }
          });
        }
        CDEX.displayCommReqScreen();
      });
  }

  CDEX.openCommunicationRequest = (commRequestId) => {
    CDEX.reviewCommunication = [];
    CDEX.resources = {
        "queries": [],
        "docRef": []
    };

    $('#selection-query-list').html('');
    CDEX.displayDataRequestScreen();
    CDEX.tasks.forEach(function(task) {
        if(task.id === commRequestId) {
            CDEX.operationTaskPayload = task;
        }
    });
    CDEX.fetchPatient();
    if(CDEX.operationTaskPayload.input){
      CDEX.operationTaskPayload.input.forEach(function (content, index) {
        let description = "";
        let code = null;
        let query = null;
        if (content.valueString) {
          description = "Query: " + content.valueString;
          if (content.text) description += " (" + content.text + ")";
          query = content.valueString;
        } else if (content.valueCodeableConcept?.coding[0].code) {
          description = "Documents of type LOINC " + content.valueCodeableConcept.coding[0].code;
          if (content.valueCodeableConcept.text) description += " (" + content.valueCodeableConcept.text + ")";
          code = content.valueCodeableConcept.coding[0].code;
        }                        
        $('#selection-query-list').append(
            "<tr> <td class='medtd' width='100%'><b>" + description + "</b></td></tr>" +
            "<tr><td><table class='table table-striped'><thead id='head" + index  +
            "'></thead><tbody id='payload" + index + "'>" +
            "</tbody></table></td></tr>");

        if (query) {
          let promise;
          let config = {
            type: 'GET',
            url: window.PROVIDER_SERVER_BASE_URL + "/" + query
          };
          CDEX.resources.queries.push({
            "question": description,
            "valueString": query,
            "index": index
          });
          promise = $.ajax(config);
          promise.then((results) => {
            if (results) {
              $('#payload' + index).html("");
              if(results.total == 0){
                $('#payload' + index).append("<tr><td>No matching data</td></tr>");
              }else {
                if(results.entry) {
                  CDEX.resources.queries.forEach(function (r, idx) {
                    if(r.index === index){
                      CDEX.resources.queries[idx].answers = results.entry;
                    }
                  });
                  results.entry.forEach(function (result) {
                    if(result.resource.text){
                      $('#payload' + index).append("<tr><td>" + result.resource.type.coding[0].display + 
                      "</td><td><input type='checkbox' id=" + "query/" +
                      result.resource.id + "></td></tr>");
                    }else {
                      $('#payload' + index).append("<tr><td><div class='div-resource'>" +
                      result.resource.resourceType + ": " + result.resource.code.coding[0].display +
                      "</div></td><td><input type='checkbox' id=" + "query/" +
                      result.resource.id  + "></td></tr>");
                    }
                  });
                }else{
                  if(results.text){
                    CDEX.resources.queries.forEach(function (r, idx) {
                    if(r.index === index){
                      CDEX.resources.queries[idx].answers = results;
                    }
                  });
                  $('#payload' + index).append("<tr><td>" + results.text.div +
                    "</td><td><input type='checkbox' id=" + "query/" +
                    results.id + "></td></tr>");
                  }else{
                    $('#payload' + index).append("<tr><td><pre>" +
                    JSON.stringify(results, null, '\t') + 
                    "</pre></td><td><input type='checkbox' id=" + "query/" +
                    results.id + "></td></tr>");
                  }
                }
              }
            }
          });
        }else if(code){
          const configProvider = {
            type: "GET",
            url: `${window.PROVIDER_SERVER_BASE_URL}/DocumentReference?_patient=${window.PATIENT_ID}&type=${code}`,
            contentType: "application/fhir+json",
          };
          $.ajax(configProvider).then(function(documentReferences) {
            $('#payload' + index).html("");
            if(documentReferences.entry){
              CDEX.reviewCommunication.push(documentReferences);
              let dataEntry = documentReferences.entry;

              $('#head' + index).append("<th>Id</th><th>Category</th>" +
                  "<th>Created Date</th><th>Preview</th><th>Select</th>");
              dataEntry.forEach(function (docRef, docRefIndex) {
                CDEX.resources.docRef.push({
                    "id": docRef.resource.id,
                    "code": code,
                    "docRefResource": docRef.resource,
                    "category": "", // CONTENT STRING HERE
                    "index": docRefIndex,
                    "maxIndex": dataEntry.length - 1,
                    "results": []
                });
                let idPreview = "previewId" + docRefIndex;
                $('#payload' + index).append("<tr><td>" + docRef.resource.id +
                    "</td><td>" +
                    docRef.resource.category[0].text + "</td><td>" +
                    CDEX.formatDate(docRef.resource.date) +
                    "</td><td id='" + idPreview + "'></td><td><input type='checkbox' id=" +
                    "docRef/" + docRef.resource.id + "></td></tr>");

                const idButton = "REQ-" + idPreview;
                $('#' + idPreview).append("<div><a href='#' id='" + idButton + "'> preview </a></div>");
                $('#' + idButton).click(() => {
                    CDEX.openPreviewProvider(docRef.resource);
                    return false;
                });
              });
            }else{
                $('#payload' + index).append("<tr><td>No data available</td></tr>");
            }
          });
        }
      });
    };
  };

  CDEX.getTasks = () => {
    let accessToken = window.PROVIDER_SERVER_TOKEN
    let accessTokenType = window.PROVIDER_SERVER_TOKEN_TYPE
    
    let configProvider = {
      type: "GET",
      url: `${window.PROVIDER_SERVER_BASE_URL}/Task?_sort=-_lastUpdated&_patient=${window.PATIENT_ID}`,
      contentType: "application/fhir+json",
      headers: {
        authorization: `${accessTokenType} ${accessToken}`
      }
    };
    $.ajax(configProvider).then(
      (res) => {
        $("#tasks-list").html("");
        $("#questionnaire-list").html("");
        if (res.entry.length > 0 || res.total > 0) {
          res.entry.forEach((task) => {
            if (task.resource.code.coding[0].code === "attachment-request-questionnaire") {
                let htmlBody = "";
                switch (task.resource.status) {
                  case "requested":
                    htmlBody = `<tr>
                                  <td><a href="#" id="btn-${task.resource.id}">${task.resource.id}</a></td>
                                  <td>${task.resource.meta.lastUpdated}</td>
                                  <td>
                                      <a href="${window.PROVIDER_SERVER_BASE_URL}/Task/${task.resource.id}">
                                          Download
                                      </a>
                                  </td>
                                  <td>${task.resource.status}</td>
                              </tr>`
                    break;
                  case "in-progress":
                    htmlBody = `<tr>
                                  <td>${task.resource.id}</td>
                                  <td>${task.resource.meta.lastUpdated}</td>
                                  <td>
                                      <a href="${window.PROVIDER_SERVER_BASE_URL}/Task/${task.resource.id}">
                                          Download
                                      </a>
                                  </td>
                                  <td><button type="button" class="btn btn-success" id="complete-${task.resource.id}">Complete</button></td>
                              </tr>`
                    break;
                  default:
                    htmlBody = `<tr>
                                  <td>${task.resource.id}</td>
                                  <td>${task.resource.meta.lastUpdated}</td>
                                  <td>
                                      <a href="${window.PROVIDER_SERVER_BASE_URL}/Task/${task.resource.id}">
                                          Download
                                      </a>
                                  </td>
                                  <td>${task.resource.status}</td>
                              </tr>`
                    break;
                }
                
                $("#questionnaire-list").append(htmlBody);

                $(`#complete-${task.resource.id}`).on("click", () => {
                  //Get task to modify status
                  let accessToken = window.PROVIDER_SERVER_TOKEN;
                  let accessTokenType = window.PROVIDER_SERVER_TOKEN_TYPE;

                  let questionnaireResponsePath = '';
                  let taskSettings = {
                    type: "GET",
                    url: `${window.PROVIDER_SERVER_BASE_URL}/Task/${task.resource.id}`,
                    contentType: "application/fhir+json",
                    headers: {
                      authorization: `${accessTokenType} ${accessToken}`
                    },
                    success: function(response) {
                      console.log(`Task updated successfuly: ${response.id}`);
                    },
                    error: function(error) {
                      console.log(`ERROR getting Task to modify status: ${error}`);
                    }
                  };
                  $.ajax(taskSettings).then(task => {
                    if(task.resourceType && task.resourceType === 'Task') {
                      if(task.output && task.output[0].valueReference && task.output[0].valueReference.reference) {
                        //Get questionnaire response to submit attachment
                        questionnaireResponsePath = task.output[0].valueReference.reference;
                        taskSettings.type = "PUT";
                        task.status = "completed";
                        taskSettings["data"] = JSON.stringify(task);
                        $.ajax(taskSettings);
                        let attchSettings = {
                          type: "GET",
                          url: `${window.PROVIDER_SERVER_BASE_URL}/${questionnaireResponsePath}`,
                          contentType: "application/fhir+json",
                          headers: {
                            authorization: `${accessTokenType} ${accessToken}`
                          },
                          error: function(error) {
                            console.log(`ERROR questionnaire response to submit attachment: ${error}`);
                          }
                        };
                        $.ajax(attchSettings).then(questResp => {
                          const resourcesId = Date.now();
                          const currentDate = new Date().toISOString().slice(0, 10);
                          const member = CDEX.patient.identifier.find(id => id.system === "http://example.org/cdex/payer/member-ids");
                          
                          CDEX.attachmentPayload.id = `CDex-parameter-${resourcesId}`;
                          CDEX.attachmentPayload.parameter[0].valueCode = "claim";
                          CDEX.attachmentPayload.parameter[1].valueIdentifier.value = `${task.reasonReference.identifier.value}`;
                          CDEX.attachmentPayload.parameter[4].valueIdentifier.value = `${member.value}`;
                          CDEX.attachmentPayload.parameter[5].valueDate = `${currentDate}`;
                          //Setting the parameters payload
                          CDEX.attachmentPayload.parameter[6].part[2].resource = questResp

                          //Update attachments
                          const operationOutcome = {
                            resourceType: "OperationOutcome",
                            id: "outcome_ok",
                            issue: [
                              {
                                severity: "informational",
                                code: "informational",
                                details: {
                                  text: "Claim found and attachment saved.",
                                },
                              },
                            ],
                          };

                          let accessToken = window.PAYER_SERVER_TOKEN;
                          let accessTokenType = window.PAYER_SERVER_TOKEN_TYPE;

                          let submitAttConfig = {
                            type: "POST",
                            url: window.URL_SUBMIT_ATTACHMENT,
                            data: JSON.stringify(CDEX.attachmentPayload),
                            contentType: "application/fhir+json",
                            headers: {
                              authorization: `${accessTokenType} ${accessToken}`
                              }
                          };

                          $.ajax(submitAttConfig).then((response) => {
                            CLAIM.claimLookupById(task.reasonReference.identifier.value).then(
                              (results) => {
                                if (!results.supportingInfo) {
                                  results.supportingInfo = [];
                                }
                                results.supportingInfo.push({
                                  valueReference: {
                                    reference: `${questionnaireResponsePath}`,
                                  },
                                });
                                configProvider.type = "PUT";
                                configProvider.url = `${window.PAYER_SERVER_BASE_URL}/Claim/${results.id}`;
                                configProvider.data = JSON.stringify(results);
                                configProvider.headers = {authorization: `${accessTokenType} ${accessToken}`}
                                
                                $.ajax(configProvider).then((claimRes) => {
                                  $("#req-parameter-output").html(
                                    JSON.stringify(CDEX.attachmentPayload, null, 2)
                                  );
                                  $("#req-operation-output").html(
                                    JSON.stringify(response, null, 2)
                                  );
                                  $("#req-claim-output").html(JSON.stringify(claimRes, null, 2));
                                  CDEX.displayScreen("attch-req-confirm-screen");
                                });
                              }
                            );
                          });
                        });
                      } else {
                        alert("No questionnaire response associated to this task");
                      }
                    }
                  });
                  
                });

                $(`#btn-${task.resource.id}`).on("click", () => {
                  $("#questionnaire-patient-name").html(
                    `${CDEX.patient.name[0].given[0]} ${CDEX.patient.name[0].family}`
                  );

                  //DTR context creation
                  const dtrContext = {
                    context: {
                      patientId: window.PATIENT_ID,
                      userId: "Practitioner/cdex-example-practitioner",
                      taskId: task.resource.id  
                    },
                    prefetch: {
                      patientToGreet: {
                        resourceType: "Patient",
                        gender: CDEX.patient.gender,
                        birthDate: CDEX.patient.birthDate,
                        id: window.PATIENT_ID,
                        active: true
                      }
                    }
                  }

                  //GET DTR endpoint
                  let dtrConfig = {
                    type: "POST",
                    url:  window.DTR_SERVER_URL,
                    data: JSON.stringify(dtrContext),
                    headers: {
                      "Content-Type": "application/json"
                    },
                    success: function(result) {
                      if(result.responseText)
                        window.open(result.responseText.replaceAll(/\s/g,'%20'));
                    },
                    error: function(error) {
                      if(error.responseText)
                        window.open(error.responseText.replaceAll(/\s/g,'%20'));
                    }
                  };
                  $.ajax(dtrConfig);
                });
            } else if(task.resource.code.coding[0].code === "attachment-request" || task.resource.code.coding[0].code === "attachment-request-code") {
                $("#tasks-list").append(`<tr>
                              <td><a href="#" id="btn-${task.resource.id}">${task.resource.id}</a></td>
                              <td>${task.resource.meta.lastUpdated}</td>
                              <td>
                                  <a href="${window.PROVIDER_SERVER_BASE_URL}/Task/${task.resource.id}">
                                      Download
                                  </a>
                              </td>
                              <td>${task.resource.status}</td>
                          </tr>`);

                $(`#btn-${task.resource.id}`).on("click", () => {
                  $("#total_attch").val(0);
                  $("#attch-request-list").html("");
                  $("#req-patient-name").html(
                    `${CDEX.patient.name[0].given[0]} ${CDEX.patient.name[0].family}`
                  );
                  $("#attch-request-data").html("");
                  $("#attch-request-data").append(
                    `<p><b>Traking ID: </b><label id="currentTaskId">${task.resource.id}</label></p>
                    <p><b>Use: </b>${task.resource.reasonCode.coding[0].display ?
                      task.resource.reasonCode.coding[0].display : 
                        task.resource.reasonCode ?
                        task.resource.reasonCode : 
                          "Non specified"}</p>
                    <p><b>Payer URL: </b>${task.resource.identifier[0].system}</p>`
                  );
                  let claimForTask =
                    task.resource.reasonReference.identifier ?
                    task.resource.reasonReference.identifier.value :
                    task.resource.reasonReference.reference;
                  $("#attch-request-list").append(
                    `<p><b>Claim: </b><span id="currentClaimId">${claimForTask}</span></p><p><b>Requested attachments: </b></p>`
                  );
                  let accessToken = window.PROVIDER_SERVER_TOKEN;
                  let accessTokenType = window.PROVIDER_SERVER_TOKEN_TYPE;


                  let provider = {
                    type: "GET",
                    url: `${window.PROVIDER_SERVER_BASE_URL}/Task/${task.resource.id}`,
                    contentType: "application/fhir+json",
                    headers: {
                      authorization: `${accessTokenType} ${accessToken}`
                      }
                                    
                  };
                  let requestedSignComponent = "";
                  let requestedSign = false;
                  $.ajax(provider).then((res) => {
                    res.input.forEach((input) => {
                      if (input.type.coding[0].code === "signature-flag") {
                        requestedSignComponent = input.valueBoolean
                          ? '<div class="bg-warning w-25"><b>Signature requested</b></div>'
                          : '<div class="bg-success w-25"><b>Signature not requested</b></div>';
                        requestedSign = input.valueBoolean;
                      }
                    });
                    $("#attch-request-list").append(requestedSignComponent);
                  });

                  task.resource.input.forEach((attch) => {
                    if (attch.valueCodeableConcept) {
                      let lineItems = "";
                      if (attch.extension) {
                        lineItems = `- Extensions: ${attch.extension[0].valuePositiveInt}`;
                        for (
                          let index = 1;
                          index < attch.extension.length;
                          index++
                        ) {
                          lineItems.append(
                            `, ${attch.extension[index].valuePositiveInt}`
                          );
                        }
                      }
                      if(attch.valueCodeableConcept.coding[0].system === "http://loinc.org") {
                        $("#attch-request-list").append(`
                            <p>${attch.valueCodeableConcept.coding[0].code} / ${attch.valueCodeableConcept.coding[0].display} ${lineItems}</p>
                        `);
                      }
                    }
                  });
                  CLAIM.claimLookupById(claimForTask).then((claim) => {
                    if (claim.item) {
                      let serviceDate = res.created;
                      $("#attch-request-list").append(`<br><h5>Line items</h5>
                                                      <table class='table'>
                                                          <thead>
                                                              <tr>
                                                                  <th scope="col">Sequence</th>
                                                                  <th scope="col">Code</th>
                                                                  <th scope="col">Description</th>
                                                                  <th scope="col">Service date</th>
                                                              </tr>
                                                          </thead>
                                                          <tbody id='lineItemsList'>
                                                          </tbody>
                                                      </table>`);
                      claim.item.forEach((item) => {
                        $("#lineItemsList").append(`<tr>
                                                                  <td>${item.sequence}</td>
                                                                  <td>${item.productOrService.coding[0].code}</td>
                                                                  <td>${item.productOrService.coding[0].display}</td>
                                                                  <td id='lineDate_${item.sequence}'>${item.servicedDate}</td>
                                                              </tr>`);
                      });
                    }
                    let optionValues = '<option value="li_1"></option>';
                    if (claim.item) {
                      claim.item.forEach((value) => {
                        optionValues = optionValues.concat(
                          `<option value='li_${value.sequence}'>LineItem ${value.sequence} (${value.productOrService.coding[0].code})</option>`
                        );
                      });
                      $("#lineItem_solicitedAttch").html(optionValues);
                    }
                    let accessToken = window.PAYER_SERVER_TOKEN;
                    let accessTokenType = window.PAYER_SERVER_TOKEN_TYPE;
                    let configProvider = {
                      type: "GET",
                      url: `${window.PAYER_SERVER_BASE_URL}/DocumentReference?_patient=${window.PATIENT_ID}`,
                      contentType: "application/fhir+json",
                      headers: {
                        authorization: `${accessTokenType} ${accessToken}`
                        }
                    
                    };
                    $.ajax(configProvider).then((res) => {
                      $("#total_attch").val(1);
                      $("#selection-list").html("");
                      let current_attch = parseInt($("#total_attch").val());
                      
                      if (res.total > 0) {
                        res.entry.forEach((resource) => {
                          $("#selection-list").append(`
                                                  <tr>
                                                      <td><input type="checkbox" id="chk_${current_attch}" name="chk_${current_attch}" value="DocumentReference/${resource.resource.id}"></td>
                                                      <td>${resource.resource.content[0].attachment.title}</td>
                                                      <td>${resource.resource.meta.lastUpdated}</td>
                                                      <td>-</td>
                                                      <td><select data-placeholder="Lineitems..." multiple class="chosen-select" name="lineItemDd" id="lineItem_${current_attch}">
                                                          ${optionValues}
                                                      </select>
                                                  </td>
                                                  </tr>
                                              `);
                          $(".chosen-select").chosen({
                            no_results_text: "Oops, nothing found!",
                          });
                          current_attch++;
                        });
                      }
                      if (claim.provider) {
                        configProvider = {
                          type: "GET",
                          url: `${window.PAYER_SERVER_BASE_URL}/${claim.provider.reference}`,
                          contentType: "application/fhir+json",
                          headers: {
                            authorization: `${accessTokenType} ${accessToken}`
                            }
                        
                        };
                        $.ajax(configProvider).then((org) => {
                          $("#attch-request-data").append(
                            `<p><b>Organization ID: </b>${claim.provider.reference} (${org.name})</p>
                            <p><b>Provider ID: </b> ${claim.careTeam[0].provider.reference}</p>`
                          );
                        });
                      }
                      //});

                      $("#total_attach").val(current_attch - 1);
                      $("#btn-submit-req-attch").click(function () {
                        //Variables
                        let lineItemsAttch = [];
                        const resourcesId = Date.now();
                        const currentDate = new Date().toISOString().slice(0, 10);
                        const member = CDEX.patient.identifier.find(id => id.system === "http://example.org/cdex/payer/member-ids");
                        let parameter = [
                          {
                            name: "AttachTo",
                            valueCode: "claim",
                          },
                          {
                            name: "TrackingId",
                            valueIdentifier: {
                              system: "http://example.org/provider",
                              value: `${task.resource.id}`,
                            },
                          },
                          {
                            name: "OrganizationId",
                            valueIdentifier: {
                              system: "http://hl7.org/fhir/sid/us-npi",
                              value: "CDex-Test-Organization",
                            },
                          },
                          {
                            name: "ProviderId",
                            valueIdentifier: {
                              system: "http://hl7.org/fhir/sid/us-npi",
                              value: "CDex-Test-Provider",
                            },
                          },
                          {
                            name: "MemberId",
                            valueIdentifier: {
                              system: "http://example.org/cdex/member-ids",
                              value: `${member.value}`
                            },
                          },
                          {
                            name: "ServiceDate",
                            valueDate: `${currentDate}`,
                          },
                        ];
                        CDEX.claimPayloadAttachment.patient.reference = `Patient/${window.PATIENT_ID}`;

                        CDEX.attachmentRequestedPayload.id = `CDex-parameter-${resourcesId}`;
                        let operationOutcome = {
                          resourceType: "OperationOutcome",
                          id: "outcome_ok",
                          issue: [
                            {
                              severity: "informational",
                              code: "informational",
                              details: {
                                text: "Claim found and attachment saved.",
                              },
                            },
                          ],
                        };
                        let accessToken = window.PAYER_SERVER_TOKEN;
                        let accessTokenType = window.PAYER_SERVER_TOKEN_TYPE;

                        let configProvider = {
                          type: "GET",
                          url: `${window.PAYER_SERVER_BASE_URL}/Claim/${$(
                            "#currentClaimId"
                          ).text()}`,
                          contentType: "application/fhir+json",
                          headers: {
                            authorization: `${accessTokenType} ${accessToken}`
                            }
                        
                        };
                        //Get Claim
                        $.ajax(configProvider).then((res) => {
                          if (!res.supportingInfo) {
                            res.supportingInfo = [];
                          }
                          let seq = res.supportingInfo.length + 1;
                          for (let index = 1; index < current_attch; index++) {
                            if ($(`#chk_${index}`).is(":checked")) {
                              const selectedValues = $(
                                `#lineItem_${index}`
                              ).val();
                              let supportingInfo = {
                                sequence: seq,
                                category: {
                                  text: "sample text",
                                },
                                valueReference: {
                                  reference: `${$(`#chk_${index}`).val()}`,
                                },
                              };
                              let existsSupInfo = false;
                              res.supportingInfo.forEach((supInfo) => {
                                if (
                                  supInfo.valueReference.reference ===
                                  supportingInfo.valueReference.reference
                                ) {
                                  existsSupInfo = true;
                                  supportingInfo.sequence = supInfo.sequence;
                                  seq--;
                                  return;
                                }
                              });
                              if (!existsSupInfo) {
                                res.supportingInfo.push(supportingInfo);
                              }
                              selectedValues.forEach((value) => {
                                const lineItem = value.split("_")[1];
                                if (res.item[lineItem - 1].informationSequence) {
                                  if (
                                    !res.item[
                                      lineItem - 1
                                    ].informationSequence.includes(
                                      supportingInfo.sequence
                                    )
                                  ) {
                                    res.item[
                                      lineItem - 1
                                    ].informationSequence.push(
                                      supportingInfo.sequence
                                    );
                                  }
                                } else {
                                  res.item[lineItem - 1].informationSequence = [
                                    supportingInfo.sequence,
                                  ];
                                }
                              });
                              seq++;
                            }
                          }

                          if (
                            $("#select-solicited-attch").get(0).files.length !== 0
                          ) {
                            const reader = new FileReader();
                            const resourcesId = Date.now();
                            const fileName = $("#select-solicited-attch")
                              .get(0)
                              .files.item(0);
                            if (
                              fileName.type === "application/pdf" ||
                              fileName.type === "text/xml"
                            ) {
                              reader.readAsDataURL(fileName);
                              reader.onloadend = (evt) => {
                                if (evt.target.readyState === FileReader.DONE) {
                                  CDEX.documentReferencePayload.content[0].attachment.data = `${
                                    reader.result.split(";base64,")[1]
                                  }`;
                                  CDEX.documentReferencePayload.content[0].attachment.title = `${
                                    $("#select-solicited-attch")
                                      .get(0)
                                      .files.item(0).name
                                  }`;
                                  CDEX.documentReferencePayload.content[0].attachment.contentType = `${fileName.type}`;
                                  CDEX.documentReferencePayload.id = `CDex-Document-Reference-${resourcesId}`;

                                  CDEX.attachmentPayload.parameter[6].part[2].resource =
                                    CDEX.documentReferencePayload;
                                  let attachment = {};
                                  let configProvider = {
                                    type: "PUT",
                                    url: `${window.PAYER_SERVER_BASE_URL}/DocumentReference/CDex-Document-Reference-${resourcesId}`,
                                    data: JSON.stringify(
                                      CDEX.documentReferencePayload
                                    ),
                                    contentType: "application/json",
                                  };
                                  $.ajax(configProvider).then((response) => {
                                    const claimId = $("#currentClaimId").text();
                                    $("#binary-output").html(
                                      JSON.stringify(response, null, "  ")
                                    );
                                    let supportingInfo = {
                                      sequence: seq,
                                      category: {
                                        text: "sample text",
                                      },
                                      valueReference: {
                                        reference: `DocumentReference/CDex-Document-Reference-${resourcesId}`,
                                      },
                                    };

                                    if(res.item === undefined) {
                                      res.item = [
                                        {
                                          informationSequence: supportingInfo.sequence
                                        }
                                      ];
                                    } else {
                                      if(res.item[res.item.length - 1].informationSequence === undefined) {
                                        res.item[res.item.length - 1].informationSequence = [];
                                      }
                                      res.item[
                                        res.item.length - 1
                                      ].informationSequence.push(
                                        supportingInfo.sequence
                                      );
                                    }

                                    if(res.supportingInfo === undefined) {
                                      res.supportingInfo = [];
                                    }
                                    res.supportingInfo.push(supportingInfo);
                                    CLAIM.claimUpsert(
                                      res,
                                      window.PAYER_SERVER_BASE_URL
                                    ).then((updatedClaim) => {
                                      $("#req-claim-output").html(
                                        JSON.stringify(updatedClaim, null, "  ")
                                      );
                                    });
                                    const attchLineItem = $(
                                      `#lineItem_solicitedAttch`
                                    ).val();
                                    attachment = {
                                      name: "Attachment",
                                      part: lineItemsAttch.concat([
                                        {
                                          name: "LineItem",
                                          valueString: "1",
                                        },
                                        {
                                          name: "Code",
                                          valueCodeableConcept: {
                                            coding: [
                                              {
                                                system: "http://loinc.org",
                                                code: `${$(
                                                  `#${attchLineItem[0]}`
                                                ).text()}`,
                                                display: `${$(
                                                  `#${attchLineItem[0]}`
                                                ).text()}`,
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          name: "Content",
                                          resource: response,
                                        },
                                      ]),
                                    };
                                    const selectedValues = $(
                                      `#lineItem_solicitedAttch`
                                    ).val();
                                    selectedValues.forEach((value) => {
                                      const lineItem = value.split("_")[1];
                                      lineItemsAttch.push({
                                        name: "LineItem",
                                        valueString: `${lineItem}`,
                                      });
                                    });

                                    parameter.push(attachment);
                                    CDEX.attachmentRequestedPayload.parameter =
                                      parameter;
                                    configProvider = {
                                      type: "POST",
                                      url: window.URL_SUBMIT_ATTACHMENT,
                                      data: JSON.stringify(
                                        CDEX.attachmentRequestedPayload
                                      ),
                                      contentType: "application/json",
                                    };
                                    if ($("#customPayerEndpoint").val() !== "") {
                                      configProvider.url = `${$(
                                        "#customPayerEndpoint"
                                      ).val()}/$submit-attachment`;
                                      configProvider.type = "POST";
                                    }
                                    $.ajax(configProvider)
                                      .then((response) => {
                                        $("#req-parameter-output").html(
                                          JSON.stringify(
                                            CDEX.attachmentRequestedPayload,
                                            null,
                                            "  "
                                          )
                                        );
                                        $("#req-operation-output").html(
                                          JSON.stringify(
                                            operationOutcome, //response,
                                            null,
                                            "  "
                                          )
                                        );
                                        if (response.resourceType) {
                                          CDEX.completeTask(
                                            $("#currentTaskId").text()
                                          );
                                        }
                                      })
                                      .catch((error) => {
                                        console.log(JSON.stringify(error));
                                      });
                                    CDEX.displayScreen(
                                      "attch-req-confirm-screen"
                                    );
                                  });
                                }
                              };
                            }
                          } else {
                            CLAIM.claimUpsert(res, window.PAYER_SERVER_BASE_URL).then(
                              (updatedClaim) => {
                                $("#req-claim-output").html(
                                  JSON.stringify(updatedClaim, null, "  ")
                                );
                              }
                            );
                          }

                          //Update attachments
                          for (let index = 1; index <= current_attch; index++) {
                            if ($(`#chk_${index}`).is(":checked")) {
                              configProvider = {
                                type: "GET",
                                url: `${window.PAYER_SERVER_BASE_URL}/${$(
                                  `#chk_${index}`
                                ).val()}`,
                                contentType: "application/fhir+json",
                              };
                              const selectedValues = $(
                                `#lineItem_${index}`
                              ).val();
                              let lineItemsAttch = [];
                              selectedValues.forEach((value) => {
                                const lineItem = value.split("_")[1];
                                lineItemsAttch.push({
                                  name: "LineItem",
                                  valueString: `${lineItem}`,
                                });
                              });

                              $.ajax(configProvider).then((resourceRes) => {
                                let attachment = "";
                                $("#req-parameter-output").html("");
                                $("#req-operation-output").html("");
                                let code = "1200";
                                let display = "undefined";
                                if (
                                  resourceRes.resourceType !== "DocumentReference"
                                ) {
                                  code = resourceRes.code.coding[0].code;
                                  display = resourceRes.code.coding[0].display;
                                }
                                if (requestedSign) {
                                  const dateNow = Date.now();
                                  const dateFormat = new Date().toISOString(); //.slice(0, 10);
                                  attachment = {
                                    name: "Attachment",
                                    part: lineItemsAttch.concat([
                                      {
                                        name: "Code",
                                        valueCodeableConcept: {
                                          coding: [
                                            {
                                              system: "http://loinc.org",
                                              code: `${code}`,
                                              display: `${display}`,
                                            },
                                          ],
                                        },
                                      },
                                      {
                                        name: "Content",
                                        resource: {
                                          resourceType: "Bundle",
                                          id: `Bundle-${dateNow}`,
                                          identifier: {
                                            system: "urn:ietf:rfc:3986",
                                            value:
                                              "urn:uuid:c173535e-135e-48e3-ab64-38bacc68dba8",
                                          },
                                          type: "document",
                                          timestamp: `${dateFormat}`,
                                          entry: [
                                            {
                                              fullUrl: `Composition/Composition-for-Bundle-${dateNow}`,
                                              resource: {
                                                resourceType: "Composition",
                                                id: `Composition-for-Bundle-${dateNow}`,
                                                status: "final",
                                                type: {
                                                  coding: [
                                                    {
                                                      system: "http://loinc.org",
                                                      code: "11503-0",
                                                    },
                                                  ],
                                                  text: "Medical records",
                                                },
                                                subject: {
                                                  reference: `Patient/${window.PATIENT_ID}`,
                                                  display: `${CDEX.patient.name[0].family}, ${CDEX.patient.name[0].given[0]}`,
                                                },
                                                date: "2021-10-25T20:16:29-07:00",
                                                author: [
                                                  {
                                                    reference:
                                                      "Practitioner/cdex-example-practitioner",
                                                    display: "Bone, Ronald",
                                                  },
                                                ],
                                                title: "Requested attachments",
                                                attester: [
                                                  {
                                                    mode: "legal",
                                                    time: `${dateFormat}`,
                                                    party: {
                                                      reference:
                                                        "Practitioner/cdex-example-practitioner",
                                                      display: "Bone, Ronald",
                                                    },
                                                  },
                                                ],
                                                section: [
                                                  {
                                                    title: `${
                                                      resourceRes.content
                                                        ? resourceRes.content[0]
                                                            .attachment.title
                                                        : display
                                                    }`,
                                                    entry: [
                                                      {
                                                        reference: `${resourceRes.resourceType}/${resourceRes.id}`,
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            },
                                            {
                                              fullUrl: `Patient/${window.PATIENT_ID}`,
                                              resource: {
                                                resourceType: "Patient",
                                                id: `${window.PATIENT_ID}`,
                                                active: true,
                                                name: [
                                                  {
                                                    text: `${window.PATIENT_ID}`,
                                                    family: `${CDEX.patient.name[0].family}`,
                                                    given: [
                                                      `${CDEX.patient.name[0].given}`,
                                                    ],
                                                  },
                                                ],
                                              },
                                            },
                                            {
                                              fullUrl:
                                                "Practitioner/cdex-example-practitioner",
                                              resource: {
                                                resourceType: "Practitioner",
                                                id: "cdex-example-practitioner",
                                                meta: {
                                                  lastUpdated:
                                                    "2013-05-05T16:13:03+00:00",
                                                },
                                                name: [
                                                  {
                                                    family: "Bone",
                                                    given: ["Ronald"],
                                                  },
                                                ],
                                              },
                                            },
                                            {
                                              fullUrl: `${resourceRes.resourceType}/${resourceRes.id}`,
                                              resource: resourceRes,
                                            },
                                          ],
                                          signature: {},
                                        },
                                      },
                                    ]),
                                  };

                                  let provider = {
                                    type: "POST",
                                    url: `https://cdex-commreq.davinci.hl7.org/api/sign`,
                                    data: JSON.stringify(
                                      attachment.part[2].resource
                                    ),
                                    contentType: "application/json",
                                  };
                                  $.ajax(provider)
                                    .then((response) => {
                                      attachment.part[2].resource.signature =
                                        response;
                                      parameter.push(attachment);
                                      CDEX.attachmentRequestedPayload.parameter =
                                        parameter;
                                      configProvider = {
                                        type: "POST",
                                        url: window.URL_SUBMIT_ATTACHMENT,
                                        data: JSON.stringify(
                                          CDEX.attachmentRequestedPayload
                                        ),
                                        contentType: "application/fhir+json",
                                      };
                                      if (
                                        $("#customPayerEndpoint").val() !== ""
                                      ) {
                                        configProvider.url = `${$(
                                          "#customPayerEndpoint"
                                        ).val()}/$submit-attachment`;
                                        configProvider.type = "POST";
                                      }
                                      $.ajax(configProvider).then((response) => {
                                        $("#req-parameter-output").html(
                                          JSON.stringify(response, null, "  ")
                                        );
                                        $("#req-operation-output").html(
                                          JSON.stringify(
                                            operationOutcome,
                                            null,
                                            "  "
                                          )
                                        );
                                        requestedSign = false;
                                        CDEX.displayScreen(
                                          "attch-req-confirm-screen"
                                        );
                                      });
                                    })
                                    .catch((error) => {
                                      $("#req-parameter-output").html(
                                        JSON.stringify(error, null, "  ")
                                      );
                                      $("#req-operation-output").html(
                                        JSON.stringify(error, null, "  ")
                                      );
                                      CDEX.displayScreen(
                                        "attch-req-confirm-screen"
                                      );
                                    });
                                } else {
                                  attachment = {
                                    name: "Attachment",
                                    part: lineItemsAttch.concat([
                                      {
                                        name: "LineItem",
                                        valueString: "1",
                                      },
                                      {
                                        name: "Code",
                                        valueCodeableConcept: {
                                          coding: [
                                            {
                                              system: "http://loinc.org",
                                              code: `${code}`,
                                              display: `${display}`,
                                            },
                                          ],
                                        },
                                      },
                                      {
                                        name: "Content",
                                        resource: resourceRes,
                                      },
                                    ]),
                                  };

                                  parameter.push(attachment);
                                  CDEX.attachmentRequestedPayload.parameter =
                                    parameter;
                                  configProvider = {
                                    type: "POST",
                                    url: window.URL_SUBMIT_ATTACHMENT,
                                    data: JSON.stringify(
                                      CDEX.attachmentRequestedPayload
                                    ),
                                    contentType: "application/json",
                                  };
                                  if ($("#customPayerEndpoint").val() !== "") {
                                    configProvider.url = `${$(
                                      "#customPayerEndpoint"
                                    ).val()}/$submit-attachment`;
                                    configProvider.type = "POST";
                                  }
                                  $.ajax(configProvider)
                                    .then((response) => {
                                      $("#req-parameter-output").html(
                                        JSON.stringify(
                                          CDEX.attachmentRequestedPayload,
                                          null,
                                          "  "
                                        )
                                      );
                                      $("#req-operation-output").html(
                                        JSON.stringify(
                                          operationOutcome, //response,
                                          null,
                                          "  "
                                        )
                                      );
                                      if (response.resourceType) {
                                        CDEX.completeTask(
                                          $("#currentTaskId").text()
                                        );
                                      }
                                    })
                                    .catch((error) => {
                                      console.log(JSON.stringify(error));
                                    });
                                  CDEX.displayScreen("attch-req-confirm-screen");
                                }
                              });
                            }
                          }
                        });
                      });
                    });
                  });

                  CDEX.displayScreen("attch-request-screen");
                });
            }
          });

          CDEX.displayScreen("submit-payer-attachments");
        } else {
          alert(`No tasks available for selected provider.`);
        }
      },
      () =>
        CDEX.displayErrorScreen(
          "Communication request submission failed (6)",
          "Please check the submit endpoint configuration <br> You can close this window now"
        )
    );
  };

  $("#req-attch-btn-restart").click(function () {
    CDEX.restart();
  });

  $("#quest-btn-submit").click(function () {
    const resourcesId = Date.now();
    const currentDate = new Date().toISOString().slice(0, 10);
    let task = JSON.stringify($("#upd-task-output").text());

    CDEX.claimPayloadAttachment.patient.reference = `Patient/${window.PATIENT_ID}`;
    attchRes = JSON.parse($("#quest-resp-output").html());
    taskReq = JSON.parse($("#requested-task-payload").html());
    const member = CDEX.patient.identifier.find(id => id.system === "http://example.org/cdex/payer/member-ids");
    let parameter = [
      {
        name: "AttachTo",
        valueCode: "claim",
      },
      {
        name: "TrackingId",
        valueIdentifier: {
          system: "http://example.org/provider",
          value: `${task.id}`,
        },
      },
      {
        name: "ProviderId",
        valueIdentifier: {
          system: "http://hl7.org/fhir/sid/us-npi",
          value: "CDex-Test-Provider",
        },
      },
      {
        name: "MemberId",
        valueIdentifier: {
          system: "http://example.org/cdex/member-ids",
          value: `${member.value}`,
        },
      },
      {
        name: "ServiceDate",
        valueDate: `${currentDate}`,
      },
      {
        name: "Attachment",
        part: [
          {
            name: "LineItem",
            valueString: "1",
          },
          {
            name: "Content",
            resource: attchRes,
          },
        ],
      },
    ];
    CDEX.attachmentRequestedPayload.id = `CDex-parameter-${resourcesId}`;
    CDEX.attachmentRequestedPayload.parameter = parameter;

    //Update attachments
    const operationOutcome = {
      resourceType: "OperationOutcome",
      id: "outcome_ok",
      issue: [
        {
          severity: "informational",
          code: "informational",
          details: {
            text: "Claim found and attachment saved.",
          },
        },
      ],
    };

    let accessToken = window.PAYER_SERVER_TOKEN;
    let accessTokenType = window.PAYER_SERVER_TOKEN_TYPE;

    let configProvider = {
      type: "POST",
      url: window.URL_SUBMIT_ATTACHMENT,
      data: JSON.stringify(CDEX.attachmentRequestedPayload),
      contentType: "application/fhir+json",
      headers: {
        authorization: `${accessTokenType} ${accessToken}`
        }
    
    };

    if ($("#questSubAttchPayerEndpoint").val() !== "") {
      configProvider.url = `${$(
        "#questSubAttchPayerEndpoint"
      ).val()}/$submit-attachment`;
    }

    $.ajax(configProvider).then((response) => {
      $("#req-parameter-output").html(
        JSON.stringify(CDEX.attachmentRequestedPayload, null, "  ")
      );
      $("#req-operation-output").html(
        JSON.stringify(operationOutcome, null, "  ")
      );
      // Claim
      CLAIM.claimLookupById(taskReq.reasonReference.identifier.value).then(
        (results) => {
          if (!results.supportingInfo) {
            results.supportingInfo = [];
          }
          results.supportingInfo.push({
            valueReference: {
              reference: `QuestionnaireResponse/${attchRes.id}`,
            },
          });
          configProvider.type = "PUT";
          configProvider.url = `${window.PAYER_SERVER_BASE_URL}/Claim/${taskReq.reasonReference.identifier.value}`;
          configProvider.data = JSON.stringify(results);
          $.ajax(configProvider).then((claimRes) => {
            $("#req-claim-output").html(JSON.stringify(claimRes, null, "  "));
            CDEX.displayScreen("attch-req-confirm-screen");
          });
        }
      );
    });
  });

  $("#btn-back-comm-list").click(function () {
    CDEX.displayScreen("submit-payer-attachments");
  });

  $("#btn-back-communication").click(function () {
    CDEX.displayScreen("data-request-screen");
  });

  $("#btn-back-task-list").click(function () {
    CDEX.displayScreen("submit-payer-attachments");
  });

  $("#req-download-resources").click(() => {
    CDEX.downloadReqResources();
  });

  $("#quest-download-resources").click(() => {
    CDEX.downloadQuestResources();
  });

  CDEX.downloadReqResources = () => {
    var zip = new JSZip();
    //Parameters
    var resourceContent = document.getElementById(
      "req-parameter-output"
    ).innerHTML;
    zip.file("parameter.json", resourceContent);

    //Claim
    resourceContent = document.getElementById("req-claim-output").innerHTML;
    zip.file("claim.json", resourceContent);

    zip.generateAsync({ type: "blob" }).then(function (content) {
      // Force down of the Zip file
      saveAs(content, "submitReqAttachment.zip");
    });
  };

  CDEX.downloadQuestResources = () => {
    var zip = new JSZip();
    //Questionnaire Response
    var resourceContent =
      document.getElementById("quest-resp-output").innerHTML;
    zip.file("questionnaireResponse.json", resourceContent);

    //Updated Task
    resourceContent = document.getElementById("upd-task-output").innerHTML;
    zip.file("task.json", resourceContent);

    zip.generateAsync({ type: "blob" }).then(function (content) {
      // Force down of the Zip file
      saveAs(content, "submitQuestionnaire.zip");
    });
  };

  CDEX.signReqRes = async () => {
    const fs = require("fs");
    const cert = fs.readFileSync("../../config/cert.pem", "utf8");

    const der = cert
      .toString()
      .replace("-----BEGIN CERTIFICATE-----", "")
      .replace("-----END CERTIFICATE-----", "")
      .replace(/(\r\n|\n|\r)/gm, "");

    const header = {
      alg: "RS256",
      kty: "RS",
      x5c: [der],
    };

    const privateKeyPath = path.join(__dirname, "../config/private-key.pem");
    const privateKey = fs.readFileSync(privateKeyPath);

    const key = await jose.JWK.asKey(privateKey, "pem");

    const { id, meta, ...rest } = req.body;

    const payload = canonicalize(rest);

    const signature = await jose.JWS.createSign(
      { format: "compact" },
      { key, header }
    )
      .update(payload)
      .final();
    const base64JWS = btoa(signature);

    const sigElement = {
      type: [
        {
          system: "urn:iso-astm:E1762-95:2013",
          code: "1.2.840.10065.1.12.1.5",
          display: "Verification Signature",
        },
      ],
      when: "2021-10-05T22:42:19-07:00",
      who: {
        reference: "Practitioner/123",
      },
      onBehalfOf: {
        reference: "Organization/123",
      },
      data: base64JWS,
    };
  };

  $("#select-attch").change(function () {
    let fname = $("#select-attch").get(0).files[0].name;
    var fsize = $("#select-attch").get(0).files[0].size;

    $("#selected-attch").html(fname + " (<b>" + fsize + "</b> bytes)<br />");
  });

  $("#select-solicited-attch").change(function () {
    let fname = $("#select-solicited-attch").get(0).files[0].name;
    var fsize = $("#select-solicited-attch").get(0).files[0].size;

    $("#selected-solicited-attch").html(
      "<b>" + fname + " (" + fsize + " bytes)</b><br />"
    );
  });

  $("#btn-task-request").click(function () {
    CDEX.dataFulfill = false;
    CDEX.displayDataRequestScreen();
    CDEX.addTypeSelection();
  });

  $("#btn-submit-priorauth").click(function () {
    configProvider = {
      type: "POST",
      url: window.URL_SUBMIT,
      data: JSON.stringify(CDEX.priorAuthPayload),
      contentType: "application/json",
    };
    $.ajax(configProvider).then((response) => {
      parsed = JSON.parse(response);
      $("#preauth-text-output").html(JSON.stringify(parsed, null, 2));
      CDEX.displayScreen("preauth-response-screen");
    }).catch(function (error) {
        $("#preauth-text-output").html(JSON.stringify(error, null, 2));
        CDEX.displayScreen("preauth-response-screen");
      });
  });

  $("#preauth-btn-restart").click(function () {
    CDEX.displayScreen("intro-screen");
  });

  $("#preauthtask-btn-back").click(function () {
    CDEX.displayScreen("preauth-response-screen");
  });

  $("#btn-preauthtask-request").click(function () {
    parsed = JSON.parse($("#preauthtask-text-output").html());
     let configProvider = {
            type: "PUT",
            url: `${window.PROVIDER_SERVER_BASE_URL}/Task/${parsed.id}`,
            data: JSON.stringify(parsed),
            contentType: "application/json",
          };
          $.ajax(configProvider).then((task) => {
            if(task.resourceType === "Task") {
              alert(`Task ${task.id} successfuly created`);
              CDEX.displayScreen("intro-screen");
            } else {
              alert("Invalid Task resource");
            }
          }).catch(error => {
            console.log(error);
          });
    
  });

  $("#btn-process-request").click(function () {
    try {
      //const paToMap = JSON.stringify($("#preauth-text-output").html());
      CDEX.taskPayload.authoredOn = CDEX.now();
      CDEX.taskPayload.lastModified = CDEX.taskPayload.authoredOn;
      CDEX.taskPayload.input = [];
      CDEX.taskPayload.code.coding[0].code = "attachment-request-code";
      parsed.entry.forEach(entry => {
        switch (entry.resource.resourceType) {
          case "ClaimResponse":
            CDEX.taskPayload.id = `PAS-${entry.resource.id}`;
            CDEX.taskPayload.reasonReference.identifier.value = `${CDEX.taskPayload.identifier[0].value}`; //`${entry.resource.id}`;
            CDEX.taskPayload.reasonCode.coding[0].code = "preauthorization";
            CDEX.taskPayload.reasonCode.coding[0].display = "Pre-Authorization";
            CDEX.taskPayload.reasonCode.text = "preauthorization";
            CDEX.taskPayload.requester.reference = `Organization/${window.ORGANIZATION_ID}`;//`${entry.resource.insurer.reference}`;
            entry.resource.item[0].extension.forEach(extension => {
              if(extension.url.includes("itemRequestedServiceDate")) {
                CDEX.taskPayload.input.push({
                  "service-date": extension.valueDateTime
                });
              }
            });
            break;
          case "Patient":
            CDEX.taskPayload.for.reference = `Patient/${window.PATIENT_ID}`;//entry.resource.id;
            break;
          case "PractitionerRole":
            CDEX.taskPayload.owner.reference = "Practitioner/cdex-example-practitioner";//entry.resource.practitioner.reference;
            break;
          case "CommunicationRequest":
            CDEX.taskPayload.input.push(entry.resource.payload[0].extension);
            CDEX.taskPayload.basedOn[0] = `CommunicationRequest/${entry.resource.id}`;
            //TODO: Create resource
            break;
          default:
            break;
        }
      });
      $("#preauthtask-text-output").html(JSON.stringify(CDEX.taskPayload, null, 2));
    } catch (error) {
      $("#preauthtask-text-output").html(error);
    }
    
    CDEX.displayScreen("preauth-task-screen");
  });

  $("#btn-query-request").click(function () {
    //CDEX.displayScreen('query-request-screen');

    if ($("#search-criteria")[0].selectedIndex === 2) {
      if ($("#customquery").val() === "") {
        alert("Please specify a custom query");
      } else {
        CDEX.directQueryRequest();
      }
    } else {
      CDEX.directQueryRequest();
    }
  });

  $("#btn-attch-submit").click(() => {
    let claimID = "";
    if ($("#type-claim").is(":checked")) {
      claimID = $("#claimid").val();
    } else {
      claimID = $("#submit-searchClaim").find(":selected").val();
    }
    if ($("#select-attch").get(0).files.length == 0) {
      alert("No file(s) selected. Please select at least one file to submit");
    } else if (
      claimID === "-- Select tracking control number --" ||
      claimID === ""
    ) {
      alert("Please select or specify a tracking id ");
    } else if ($("#codeInput").val() === "") {
      alert("Please select or specify a code");
    } else if ($("#serviceDate").val() === "") {
      alert("Please select or specify a service date");
    } else {
      CDEX.submitAttachments(claimID);
      $("#attachment-submit-screen").hide();
    }
  });

  $("#btn-execute-query").click(function () {
    CDEX.directQueryRequest();
  });

  CDEX.reviewTaskOperation = () => {
    CDEX.dataFulfill ? CDEX.displayReviewScreenProvider() : CDEX.displayReviewScreen();
  };

  $("#btn-review").click(CDEX.reviewTaskOperation);
  $("#btn-task").click(CDEX.getNotAttachmentRelatedTasks);
  $("#btn-query").click(CDEX.displayDirectQueryScreen);
  $("#btn-attach").click(CDEX.displayAttachmentScreen);
  $("#btn-request-attach").click(CDEX.displayRequestAttachmentScreen);
  $("#btn-task-restart").click(CDEX.restart);
  $("#btn-query-restart").click(CDEX.restart);
  $("#btn-task-restart-commreq").click(CDEX.restart);
  $("#dq-btn-restart").click(CDEX.restart);
  $("#btn-restart-task").click(CDEX.restart);
  $("#btn-restart-attachment").click(CDEX.restart);
  $("#attch-btn-restart").click(CDEX.restart);
  $("#reqattch-btn-restart").click(CDEX.restart);
  $("#attch-req-restart").click(CDEX.restart);
  $("#btn-restart-comm-list").click(CDEX.restart);
  $("#btn-back").click(CDEX.displayCommReqScreen);
  $("#btn-edit").click(CDEX.displayDataRequestScreen);
  $("#btn-submit").click(CDEX.reconcile);
  $("#btn-configuration").click(CDEX.displayConfigScreen);
  $("#btn-config").click(function () {
    let selection = $("#config-select").val();
    if (selection !== "custom") {
      window.localStorage.setItem(
        "cdex-app-config",
        JSON.stringify({ selection: parseInt(selection) })
      );
    } else {
      let configtext = $("#config-text").val();
      let myconf;
      try {
        myconf = JSON.parse(configtext);
        window.localStorage.setItem(
          "cdex-app-config",
          JSON.stringify({ custom: myconf })
        );
      } catch (err) {
        alert("Unable to parse configuration. Please try again.");
      }
    }
    CDEX.loadConfig();
    CDEX.displayReviewScreen();
  });
  $("#btn-submit-attach").click(CDEX.getTasks);

  CDEX.providerEndpoints.forEach((e, id) => {
    $("#config-select").append(
      "<option value='" + id + "'>" + e.name + "</option>"
    );
  });
  $("#config-select").append("<option value='custom'>Custom</option>");
  $("#config-text").val(JSON.stringify(CDEX.providerEndpoints[0], null, "   "));

  $("#config-select").on("change", function () {
    if (this.value !== "custom") {
      $("#config-text").val(
        JSON.stringify(CDEX.providerEndpoints[parseInt(this.value)], null, 2)
      );
    }
  });

  $("#config-text").bind("input propertychange", () => {
    $("#config-select").val("custom");
  });

  // FHIR.oauth2.ready(CDEX.initialize);
  CDEX.initialize();

  CDEX.submitAttachments = (claimId) => {
    let operationOutcome = "";
    const reader = new FileReader();
    const resourcesId = Date.now();
    const fileName = $("#select-attch").get(0).files.item(0);

    CDEX.claimPayloadAttachment.patient.reference = `Patient/${window.PATIENT_ID}`;

    CDEX.attachmentPayload.id = `CDex-parameter-${resourcesId}`;
    CDEX.attachmentPayload.parameter[0].valueCode = "claim"; //To check: $('#radio-claim').is(':checked')?'claim':'prior-auth';
    CDEX.attachmentPayload.parameter[1].valueIdentifier.value = `${claimId}`;
    CDEX.attachmentPayload.parameter[4].valueIdentifier.value = `${window.PATIENT_ID}`;
    CDEX.attachmentPayload.parameter[5].valueDate = $("#serviceDate").val();
    //Setting the parameters payload
    CDEX.attachmentPayload.parameter[6].part[1].valueCodeableConcept.coding[0].code = `${$(
      "#codeInput"
    ).val()}`;
    let displayValue = $(
      `#${CDEX.attachmentPayload.parameter[6].part[1].valueCodeableConcept.coding[0].code}`
    ).text();
    CDEX.attachmentPayload.parameter[6].part[1].valueCodeableConcept.coding[0].display = `${displayValue}`;

    if (fileName.type === "application/pdf" || 
      fileName.type === "text/xml" ||
      fileName.type === "text/csv" ||
      fileName.type === "application/msword" ||
      fileName.type === "image/gif" ||
      fileName.type === "text/html" ||
      fileName.type === "image/jpeg" ||
      fileName.type === "application/rtf" ||
      fileName.type === "image/tiff" ||
      fileName.type === "application/xhtml+xml" ||
      fileName.type === "application/vnd.ms-excel" ||
      fileName.type === "image/png" ||
      fileName.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      fileName.type === "application/vnd.ms-excel") {
      reader.readAsDataURL(fileName);
      reader.onloadend = (evt) => {
        if (evt.target.readyState === FileReader.DONE) {
          //Setting the document reference
          CDEX.documentReferencePayload.event[0].concept.coding[0].code = `${$(
            "#codeInput"
          ).val()}`;
          CDEX.documentReferencePayload.event[0].concept.coding[0].display = `${displayValue}`;
          CDEX.documentReferencePayload.content[0].attachment.data = `${
            reader.result.split(";base64,")[1]
          }`;
          CDEX.documentReferencePayload.content[0].attachment.title = `${
            $("#select-attch").get(0).files.item(0).name
          }`;
          CDEX.documentReferencePayload.content[0].attachment.contentType = `${fileName.type}`;
          CDEX.documentReferencePayload.id = `CDex-Document-Reference-${resourcesId}`;

          CDEX.attachmentPayload.parameter[6].part[2].resource =
            CDEX.documentReferencePayload;

          let accessToken = window.PAYER_SERVER_TOKEN;
          let accessTokenType = window.PAYER_SERVER_TOKEN_TYPE;
            
          let configProvider = {
            type: "PUT",
            url: `${window.PAYER_SERVER_BASE_URL}/DocumentReference/CDex-Document-Reference-${resourcesId}`,
            data: JSON.stringify(CDEX.documentReferencePayload),
            contentType: "application/json",
            headers: {
              authorization: `${accessTokenType} ${accessToken}`
              }
          
          };
          $.ajax(configProvider).then((response) => {
            $("#Resource").html("Document reference successfully created.");
            $("#binary-output").html(JSON.stringify(response, null, "  "));
            // CLaim lookup
            CLAIM.claimLookupById(claimId).then((results) => {
              if (Object.keys(results).length === 0) {
                //New Claim creation
                claimExists = false;
                operationOutcome = {
                  resourceType: "OperationOutcome",
                  id: "outcome_noclaim",
                  issue: [
                    {
                      severity: "warning",
                      code: "informational",
                      details: {
                        text: "Claim not found - will create base claim.",
                      },
                    },
                  ],
                };
                $("#claimCreateUpdate").html("Claim successfully created.");
                CDEX.claimPayloadAttachment.id = claimId;
                CDEX.claimPayloadAttachment.supportingInfo.valueReference.reference = `DocumentReference/CDex-Document-Reference-${resourcesId}`;
                CDEX.claimPayloadAttachment.created = $("#serviceDate").val();
                CDEX.claimPayloadAttachment.use = $("#radio-claim").is(
                  ":checked"
                )
                  ? "claim"
                  : "preauthorization";
                CLAIM.claimUpsert(
                  CDEX.claimPayloadAttachment,
                  window.PAYER_SERVER_BASE_URL
                ).then((results) => {
                  $("#claim-output").html(JSON.stringify(results, null, "  "));
                });
              } else {
                //Existing claim update
                $("#claimCreateUpdate").html("Claim successfully updated.");
                operationOutcome = {
                  resourceType: "OperationOutcome",
                  id: "outcome_ok",
                  issue: [
                    {
                      severity: "informational",
                      code: "informational",
                      details: {
                        text: "Claim found and attachment saved.",
                      },
                    },
                  ],
                };
                results.supportingInfo = {
                  sequence: 1,
                  category: {
                    text: "sample text",
                  },
                  valueReference: {
                    reference: `DocumentReference/CDex-Document-Reference-${resourcesId}`,
                  },
                };
                CLAIM.claimUpsert(results, window.PAYER_SERVER_BASE_URL).then(
                  (results) => {
                    $("#claim-output").html(
                      JSON.stringify(results, null, "  ")
                    );
                  }
                );
              }
              //Parameter creation
              configProvider = {
                type: "POST",
                url: window.URL_SUBMIT_ATTACHMENT,
                data: JSON.stringify(CDEX.attachmentPayload),
                contentType: "application/json",
              };
              if ($("#subUnsAttchPayerEndpoint").val() !== "") {
                configProvider.url = `${$(
                  "#subUnsAttchPayerEndpoint"
                ).val()}/$submit-attachment`;
                configProvider.type = "POST";
              }
              $.ajax(configProvider)
                .then((response) => {
                  $("#parameter-output").html(
                    JSON.stringify(CDEX.attachmentPayload, null, "  ")
                  );
                  $("#operation-output").html(
                    JSON.stringify(operationOutcome, null, "  ")
                  );
                  CDEX.displayScreen("attachment-confirm-screen");
                })
                .catch(function (error) {
                  $("#parameter-output").html(
                    JSON.stringify(error, null, "  ")
                  );
                });
            });
          });
        }
      };
    } else if (fileName.type === "application/json") {
      reader.readAsText(fileName);
      reader.onloadend = (evt) => {
        //Setting the parameters payload
        let jsonContent = JSON.parse(reader.result);
        CDEX.attachmentPayload.parameter[6].part[2].resource = jsonContent;
        let resourceIdentifier = `CDex-${jsonContent.resourceType}-${resourcesId}`;
        if (jsonContent.id) {
          resourceIdentifier = jsonContent.id;
        }
        if (jsonContent.resourceType !== "Bundle")
          jsonContent.subject.reference = `Patient/${window.PATIENT_ID}`;
        else {
          jsonContent.entry.forEach((resource) => {
            if (resource.resource.resourceType === "Patient")
              resource.resource.id = `Patient/${window.PATIENT_ID}`;
          });
        }
        configProvider = {
          type: "PUT",
          url: `${window.PAYER_SERVER_BASE_URL}/${jsonContent.resourceType}/${resourceIdentifier}`,
          data: JSON.stringify(jsonContent),
          contentType: "application/json",
        };
        $.ajax(configProvider)
          .then((response) => {
            $("#Resource").html(
              `${jsonContent.resourceType} resource successfully created.`
            );
            $("#binary-output").html(JSON.stringify(response, null, "  "));
            CLAIM.claimLookupById(claimId).then((results) => {
              if (Object.keys(results).length === 0) {
                //New Claim creation
                claimExists = false;
                operationOutcome = {
                  resourceType: "OperationOutcome",
                  id: "outcome_noclaim",
                  issue: [
                    {
                      severity: "warning",
                      code: "informational",
                      details: {
                        text: "Claim not found - will create base claim.",
                      },
                    },
                  ],
                };
                $("#claimCreateUpdate").html("Claim successfully created.");
                CDEX.claimPayloadAttachment.id = claimId;
                CDEX.claimPayloadAttachment.supportingInfo.valueReference.reference = `${jsonContent.resourceType}/${jsonContent.id}`;
                CDEX.claimPayloadAttachment.created = $("#serviceDate").val();
                CDEX.claimPayloadAttachment.use = $("#radio-claim").is(
                  ":checked"
                )
                  ? "claim"
                  : "preauthorization";
                CLAIM.claimUpsert(
                  CDEX.claimPayloadAttachment,
                  window.PAYER_SERVER_BASE_URL
                ).then((results) => {
                  $("#claim-output").html(JSON.stringify(results, null, "  "));
                });
              } else {
                //Existing claim update
                $("#claimCreateUpdate").html("Claim successfully updated.");
                operationOutcome = {
                  resourceType: "OperationOutcome",
                  id: "outcome_ok",
                  issue: [
                    {
                      severity: "informational",
                      code: "informational",
                      details: {
                        text: "Claim found and attachment saved.",
                      },
                    },
                  ],
                };
                let itemAssoc = 0;
                let supInfoExist = false;
                results.supportingInfo.forEach((supInf) => {
                  if (
                    supInf.valueReference.reference ===
                    `${jsonContent.resourceType}/${jsonContent.id}`
                  ) {
                    supInfoExist = true;
                    itemAssoc = supInf.sequence;
                  }
                });
                if (!supInfoExist) {
                  if (!results.supportingInfo) {
                    results.supportingInfo = [
                      {
                        sequence: 1,
                        category: {
                          text: "sample text",
                        },
                        valueReference: {
                          reference: `${jsonContent.resourceType}/${jsonContent.id}`,
                        },
                      },
                    ];
                  } else {
                    results.supportingInfo.push({
                      sequence: results.supportingInfo.length + 1,
                      category: {
                        text: "sample text",
                      },
                      valueReference: {
                        reference: `${jsonContent.resourceType}/${jsonContent.id}`,
                      },
                    });
                  }
                }
                //TODO: Line items association for unsolicited attachments.
                CLAIM.claimUpsert(results, window.PAYER_SERVER_BASE_URL).then(
                  (results) => {
                    $("#claim-output").html(
                      JSON.stringify(results, null, "  ")
                    );
                  }
                );
              }
              //Parameter creation
              configProvider = {
                type: "POST",
                url: window.URL_SUBMIT_ATTACHMENT,
                data: JSON.stringify(CDEX.attachmentPayload),
                contentType: "application/json",
              };
              $.ajax(configProvider).then((response) => {
                $("#parameter-output").html(
                  JSON.stringify(response, null, "  ")
                );
                $("#operation-output").html(
                  JSON.stringify(operationOutcome, null, "  ")
                );
                CDEX.displayScreen("attachment-confirm-screen");
              });
            });

            $("#parameter-output").html(JSON.stringify(response));
            $("#operation-output").html(JSON.stringify(operationOutcome));
            CDEX.displayScreen("attachment-confirm-screen");
          })
          .catch((error) => {
            $("#Resource").html(
              `${jsonContent.resourceType} resource not created.`
            );
            $("#binary-output").html(JSON.stringify(error, null, "  "));
          });
      };
    }
  };

  $("#download-resources").click(() => {
    CDEX.downloadResources();
  });

  CDEX.downloadResources = () => {
    var zip = new JSZip();
    //Parameters
    var resourceContent = document.getElementById("parameter-output").innerHTML;
    zip.file("parameter.json", resourceContent);

    //Claim
    resourceContent = document.getElementById("claim-output").innerHTML;
    zip.file("claim.json", resourceContent);

    //Attachment
    resourceContent = document.getElementById("binary-output").innerHTML;
    zip.file("attachment.json", resourceContent);

    zip.generateAsync({ type: "blob" }).then(function (content) {
      // Force down of the Zip file
      saveAs(content, "submitAttachment.zip");
    });
  };

  CDEX.signAttachment = async (bundle) => {
    
    let configProvider = {
      type: "POST",
      url: window.URL_SIGN,
      data: JSON.stringify(bundle),
      contentType: "application/json",
    };
    const signedBundle = $.ajax(configProvider).then((response) => {
      return response;
    });
    return signedBundle;
  };

  CDEX.directQueryRequest = () => {
    let queryType = "";
    if ($("#search-criteria").val() === "Observation - HbA1c") {
      queryType = `Observation?patient=${window.PATIENT_ID}&code=4548-4`;
    } else if ($("#search-criteria").val() !== "custom") {
      queryType = `${$("#search-criteria").val()}?patient=${window.PATIENT_ID}`;
    } else {
      queryType = $("#customquery").val();
    }
    let accessToken = window.PROVIDER_SERVER_TOKEN;
    let accessTokenType = window.PROVIDER_SERVER_TOKEN_TYPE;
    let configPayer = {
      type: "GET",
      url: `${window.PROVIDER_SERVER_BASE_URL}/${queryType}`,
      contentType: "application/fhir+json",
      headers: {
        authorization: `${accessTokenType} ${accessToken}`
        }
    };

    $.ajax(configPayer).then(
      (res) => {
        $("#dq-text-output").html(JSON.stringify(res, null, "  "));
        $("#dq-submit-endpoint").html("<b>" + res.link[0].url + "</b>");
        //$('#dq-submit-endpoint').append("<b>" + res.link[0].url + "</b>");
        $("#subsearch").html("");
        CDEX.displayScreen("dq-confirm-screen");
      },
      () =>
        CDEX.displayErrorScreen(
          "Communication request submission failed (7)",
          "Please check the submit endpoint configuration <br> You can close this window now"
        )
    );
  };
})();
