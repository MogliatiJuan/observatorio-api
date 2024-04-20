export {
  veredictById,
  createVeredict,
  veredictsAllOrFiltered,
  modifyVeredict,
  deleteVeredict,
  restoreVeredict,
} from "./fallos/index.js";

export {
  getAllSinceProvince,
  getCities,
  getProvinces,
  getDepartments,
  getFactories,
  createFactory,
  modifiyFactory,
  createTags,
  getTags,
  modifiyTags,
  getTribunals,
  createTribunals,
  modifiyTribunals,
  getClaims,
  createClaims,
  modifiyClaims,
  createSector,
  getSector,
  modifiySector,
  createTypeTrial,
  getTypeTrial,
  modifiyTypeTrial,
  getCurrencies,
} from "./datos/index.js";

export {
  createRol,
  getUser,
  createUser,
  disableOrEnableUser,
  setRol,
  login,
} from "./auth/index.js";
