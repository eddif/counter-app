const express = require("express");
const cors = require("cors");
const app = express();
const port = 3002;

app.use(cors());

app.get("*", (req, res) => {
  res.status(500).send();
});

app.post("*", (req, res) => {
  res.status(500).send();
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
