const db = require("../db");

class MainController {
  async getData(req, res) {
    const data = await db.client.query("SELECT * FROM task_table");
    const page = Number(req.query["_page"]) || 1;
    const limit = Number(req.query["_limit"]) || 10;
    const offset = page * limit - limit;

    const paginatedRows = data.rows.splice(offset, limit);

    const resultData = {
      rows: paginatedRows,
      rowsCount: data.rowCount,
      currentPage: page,
      itemsOnPage: limit,
    };

    res.json(resultData);
  }
}

module.exports = new MainController();
