module.exports = {
  db: dbString(),
};

function dbString() {
  if (process.env.ENV == 'production') {
    return `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}:27017/meandatabase?replicaSet=rs0`;
  }

  return `mongodb://${process.env.DB_NAME}:27017/meandatabase`;
}
