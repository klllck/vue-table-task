const db = require("../db");

class MainController {
  async getData(req, res) {
    const data = await db.client.query("SELECT * FROM task_table");
    const page = Number(req.query["page"]) || 1;
    const limit = Number(req.query["limit"]) || 10;
    const offset = page * limit - limit;

    const paginatedData = data.rows.splice(offset, limit);

    const resultData = {
      rowsCount: data.rowCount,
      rows: paginatedData,
    };

    res.json(resultData);
  }
}

module.exports = new MainController();
