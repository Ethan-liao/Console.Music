

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/music_library_dev'
  },
  production: {
    client: 'pg',
    connection: 'postgres://yhalrpzsjcnpmm:d3b2669a0e877084365c82d42d5f56259bc48d12a1dee82e5d3d2197b06b9092@ec2-23-21-158-253.compute-1.amazonaws.com:5432/dc35156vnan3iv'
  }
};
