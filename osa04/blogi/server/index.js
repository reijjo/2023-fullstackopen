const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");

app.get("/", (req, res) => {
  res.send("HIHUU");
});
app.listen(config.PORT, () => {
  logger.info(`Server on port ${config.PORT}`);
});
