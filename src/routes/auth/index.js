import { Router } from "express";
import {
  createRol,
  createUser,
  disableOrEnableUser,
  getUser,
  login,
  setRol,
} from "../../controllers/index.js";
import { adminMiddleware } from "../../middlewares/index.js";

const auth = new Router();

auth
  .get("/users", getUser)
  .post("/users", adminMiddleware, createUser)
  .patch("/user", adminMiddleware, disableOrEnableUser)
  .post("/rol", adminMiddleware, createRol)
  .put("/rol", adminMiddleware, setRol)
  .post("/login", login);

export default auth;
