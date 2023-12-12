const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");

console.log("NODENEV", process.env.NODE_ENV);

app.listen(config.PORT, () => {
  logger.info(`Server on port ${config.PORT}`);
});
