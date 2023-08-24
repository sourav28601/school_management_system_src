var db = require('../db/connectiondb');
const { Op } = require('sequelize');


class FeatureController {

  static paginate = async (model, page, size, searchQuery = null, include = null) => {
    try {
      const pageAsNumber = Number.parseInt(page);
      const sizeAsNumber = Number.parseInt(size);
      let currentPage = 1;
      if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
        currentPage = pageAsNumber;
      }

      let pageSize = 5;
      if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 2) {
        pageSize = sizeAsNumber;
      }

      const { count, rows } = await model.findAndCountAll({
        include: include ? include : [],
        where: searchQuery,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      });

      return { count, data: rows, currentPage, pageSize };
    } catch (err) {
      throw err;
    }
  };


}

module.exports = FeatureController;
