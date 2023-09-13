import express from "express";
import path from "path";
import morgan from "morgan";
import mysql2 from "mysql2";
import myConnection from "express-myconnection";
import multer from "multer";
import cors from "cors";
import { uuid } from "uuidv4";
import fallo_router from "./modules/fallos/router_fallos.js";
import varios_router from "./modules/varios/router_varios.js";
import { __dirname } from "./utils/index.js";

const app = express();
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../public/uploads"),
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname.split(".").slice(0, -1).join(".") +
        "__" +
        uuid() +
        path.extname(file.originalname)
    );
  },
});

//Setting
app.set("port", process.env.PORT || 3000);
//Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(
  myConnection(
    mysql2,
    {
      host: "localhost",
      user: "root",
      password: "5826",
      port: 3306,
      database: "fallos",
    },
    "single"
  )
);
app.use(express.urlencoded({ extends: false })); //permite entender los datos que vienen de formulario
app.use(express.json()); //escucho jsons

// static files
app.use(express.static(__dirname + "/public"));
app.use(
  multer({
    storage,
    dest: path.join(__dirname, "public/uploads"), //probablemente halla que sacarlo por recplicacion
  }).single("archivoupload")
); //escucho jsons

//Routes
app.use("/api/fallo", fallo_router);
app.use("/api/varios", varios_router);

//Iniciando el servidor
app.listen(app.get("port"), () => {
  console.log("Servidor activo en puerto 3000");
});
