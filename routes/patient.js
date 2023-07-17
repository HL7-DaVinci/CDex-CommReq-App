var PATIENT;
if (!PATIENT) {
  PATIENT = {};
}

var CDEX;
if (!CDEX) {
  CDEX = {};
}

(function () {
  patientLookup = async (patient) => {
    let url = CDEX.payerEndpoint.url + "/Patient/" + patient;
    $.ajax(url)
      .then((res) => {
        if (res.data.total > 0) {
          return true;
        }
        return false;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  };
})();
