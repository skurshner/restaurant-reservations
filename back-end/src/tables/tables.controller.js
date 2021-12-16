const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * Middleware to check that body has data
 */
const hasData = (req, res, next) => {
  if (req.body.data) {
    return next();
  }
  next({ status: 400, message: "body must have data property" });
};

/**
 * Middleware for post body validation
 */
const hasTableName = (req, res, next) => {
  const { data: { table_name } = {} } = req.body;
  if (table_name && table_name !== "" && table_name.length >= 2) {
    res.locals.table_name = table_name;
    return next();
  }
  next({
    status: 400,
    message: "A 'table_name' of at least 2 characters is required",
  });
};

const hasCapacity = (req, res, next) => {
  const { data: { capacity } = {} } = req.body;
  if (capacity && typeof capacity === "number" && capacity > 0) {
    return next();
  }
  next({
    status: 400,
    message: "A 'capacity' of at least 1 is required",
  });
};

/**
 * Validation Middleware for seat table requests
 */

const hasReservationId = (req, res, next) => {
  const { data: { reservation_id } = {} } = req.body;
  if (reservation_id) {
    res.locals.reservation_id = reservation_id;
    return next();
  }
  next({
    status: 400,
    message: "A 'reservation_id' is required",
  });
};

const reservationExists = async (req, res, next) => {
  const reservation_id = res.locals.reservation_id;
  const foundReservation = await service.readReservation(reservation_id);
  if (foundReservation) {
    res.locals.reservation = foundReservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} does not exist`,
  });
};

const tableHasValidStatus = async (req, res, next) => {
  const { table_id } = req.params;
  const foundTable = await service.readTable(table_id);
  if (foundTable.reservation_id === null) {
    res.locals.table = foundTable;
    return next();
  }
  next({
    status: 400,
    message: "Selected table is occupied, please choose a different table",
  });
};

const tableHasValidCapacity = (req, res, next) => {
  const { people } = res.locals.reservation;
  const { capacity } = res.locals.table;
  if (capacity >= people) {
    return next();
  }
  next({
    status: 400,
    message:
      "Selected table does not have enough capacity for this reservation",
  });
};

/**
 * List handler for tables resources
 */
const list = async (req, res) => {
  res.json({
    data: await service.list(),
  });
};

/**
 *  Create handler for new table
 */
const create = async (req, res) => {
  const newTable = await service.create(req.body.data);
  res.status(201).json({ data: newTable });
};

const update = async (req, res, next) => {
  const { table_id } = res.locals.table;
  const updatedTable = {
    ...req.body.data,
    table_id,
  };
  const data = await service.update(updatedTable);
  res.status(200).json({ data });
};

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasData, hasTableName, hasCapacity, asyncErrorBoundary(create)],
  update: [
    hasData,
    hasReservationId,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(tableHasValidStatus),
    tableHasValidCapacity,
    asyncErrorBoundary(update),
  ],
};
