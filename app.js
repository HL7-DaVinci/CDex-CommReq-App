const bodyParser = require("body-parser");
const express = require("express");
const helmet = require("helmet");
const http = require("http");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");

const PORT = process.env.PORT || 9090;
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; //Remove for prod
const app = express();

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false, limit: "32mb" }));
app.use(
  bodyParser.json({
    limit: "32mb",
    type: ["application/json", "application/fhir+json"],
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/\\$submit-attachment", require("./routes/attachments"));
app.use("/\\$submit", require("./routes/pas"));
app.use("/\\$sign", require("./routes/sign"));

const server = http.createServer(app);

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
