import { Router } from "express";
import {
  createRol,
  createUser,
  disableOrEnableUser,
  getUser,
  setRol,
} from "../../controllers/index.js";

const auth = new Router();

auth
  .get("/", getUser)
  .post("/", createUser)
  .patch("/user", disableOrEnableUser)
  .post("/rol", createRol)
  .put("/rol", setRol);

export default auth;
