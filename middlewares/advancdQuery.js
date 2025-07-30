exports.queryMidleware = function (model, populateStr) {
  return async function (req, res, next) {
    let query;
    const queryObj = { ...req.query };
    const removeField = ["sort", "select", "page", "limit"];
    removeField.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    query = model.find(JSON.parse(queryStr));
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
      // console.log(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    if (req.query.select) {
      const selectBy = req.query.select.split(",").join("  ");
      query = query.select(selectBy);
    }

    const page = Math.abs(req.query.page) || 1;
    const limit = Math.abs(req.query.limit) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if (populateStr) {
      query = query.populate(populateStr);
    }

    const result = await query;

    const pagination = {};

    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }

    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.advancedQuery = {
      status: "Success",
      count: model.length,
      data: result,
      pagination,
    };

    next();
  };
};
