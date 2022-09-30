require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const router = require("./routes/router");
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

const startServer = () => {
  try {
    db.createTableAndInsertMockData();
    app.listen(PORT, () =>
      console.log(`Server has launched on port ${PORT} \n`)
    );
  } catch (error) {
    console.log(error);
  }
};
startServer();
