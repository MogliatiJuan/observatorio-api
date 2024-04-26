import { Router } from "express";
import {
  createRol,
  createUser,
  disableOrEnableUser,
  getUser,
  login,
  setRol,
} from "../../controllers/index.js";

const auth = new Router();

auth
  .get("/users", getUser)
  .post("/users", createUser)
  .patch("/user", disableOrEnableUser)
  .post("/rol", createRol)
  .put("/rol", setRol)
  .post("/login", login);

export default auth;
