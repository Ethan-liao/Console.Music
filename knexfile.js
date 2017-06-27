

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/music_library_dev'
  },
  production: {
    client: 'pg',
    connection: 'postgres://beebiiawyiwiup:6183c5367551e93c65b4167d6413f471cbd84263e5677e01527ca946cd4254f3@ec2-54-221-220-82.compute-1.amazonaws.com:5432/dc8sbkbuj5f8pe'
  }
};
