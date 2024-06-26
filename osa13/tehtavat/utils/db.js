const Sequelize = require("sequelize");
const { Umzug, SequelizeStorage } = require("umzug");

const { DATABASE_URL } = require("./config");

const sequelize = new Sequelize(DATABASE_URL);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log("Connected to Database.");
  } catch (error) {
    console.log("Failed to connect to Database ._.");
    process.exit(1);
  }

  return null;
};

// Migration stuff
const migrationConf = {
  migrations: {
    glob: "migrations/*.js",
  },
  storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

module.exports = { connectDB, sequelize, rollbackMigration };
