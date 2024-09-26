const express = require("express")
const CarsRouter = require('./cars/cars-router');
const { logger } = require('./cars/cars-middleware');

const server = express();

server.use(express.json());
server.use(logger);
server.use('/api/cars', CarsRouter);

module.exports = server;