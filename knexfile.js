

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/music_library_dev'
  },
  production: {
    client: 'pg',
    connection: 'Heroku_postrgres_db'
  }
};
