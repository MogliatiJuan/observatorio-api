import { Router } from "express";
import {
  createProfession,
  createRol,
  createUser,
  deleteProfession,
  deleteRol,
  disableOrEnableUser,
  getProfessions,
  getUser,
  login,
  modifyProfession,
  setRol,
} from "../../controllers/index.js";

const auth = new Router();

auth
  .get("/users", getUser)
  .post("/users", createUser)
  .patch("/user", disableOrEnableUser)
  .post("/rol", createRol)
  .delete("/rol", deleteRol)
  .put("/rol", setRol)
  .post("/login", login)
  .get("/professions", getProfessions)
  .post("/professions", createProfession)
  .put("/professions", modifyProfession)
  .delete("/professions", deleteProfession);

export default auth;
