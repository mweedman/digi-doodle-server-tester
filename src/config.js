module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://ecdziztinahztb:d902bf7cf563a9bb9cda5ffd0af47cd6eda249326dad0a5320206d82672a067f@ec2-184-72-236-57.compute-1.amazonaws.com:5432/d3ase8dau5ru7c',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/digi-doodle-test'
};