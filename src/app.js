import express from "express";
import morgan from "morgan";
import cors from "cors";
import { syncDb } from "./db/index.js";
import config from "./config/index.js";
import router from "./routes/index.js";

syncDb();

const app = express();

app.use("*", cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
if (config.MORGAN_LOGGING) {
  app.use(morgan(config.MORGAN_FORMAT));
}
app.use("/api", router);

app.listen(config.PORT, () => {
  console.log(`Servidor activo en puerto ${config.PORT}`);
});
