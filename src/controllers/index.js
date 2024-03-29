export {
  veredictById,
  createVeredict,
  veredictsAllOrFiltered,
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
} from "./datos/index.js";

export {
  createRol,
  getUser,
  createUser,
  disableOrEnableUser,
  setRol,
} from "./auth/index.js";
