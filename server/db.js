const { Client } = require("pg");
const sqlQuery = require("./mock-data");

const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

const createTableAndInsertMockData = async () => {
  try {
    await client.connect();
    await client.query(sqlQuery);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { client, createTableAndInsertMockData };
