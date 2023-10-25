import express from "express";
import morgan from "morgan";
import cors from "cors";
import { syncDb } from "./db/index.js";
import config from "./config/index.js";
import router from "./routes/index.js";
import fileUpload from "express-fileupload";

syncDb();

const app = express();

app.use("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({ safeFileNames: true, preserveExtension: 4 }));

if (config.MORGAN_LOGGING) {
  app.use(morgan(config.MORGAN_FORMAT));
}
app.use("/api", router);
app.get("/", (req, res) => {
  return res.send({
    message: "Welcome to the Observatory API",
    description:
      "This API allows you to view, modify, and upload information and files related to the certains verdicts.",
    version: "1.0.0",
  });
});
app.all("*", (req, res) => {
  res.status(404).send({
    status: 404,
    error: "Not Found",
    message: "The requested resource could not be found.",
  });
});

app.listen(config.PORT, () => {
  console.log(`Servidor activo en puerto ${config.PORT}`);
});
