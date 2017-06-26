  // WHAT IS MY ENVIRONMENT?
  const environment = process.env.NODE_ENV || 'development';
  // CONNECT TO THE KNEXFILE
  const knexConfig = require('./knexfile')[environment];

  const knex = require('knex')(knexConfig);
  // EXPORT OUT THE RESULT FROM ABOVE
  module.exports = knex;
