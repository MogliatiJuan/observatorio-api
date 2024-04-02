import {
  Ciudades,
  Divisas,
  Empresas,
  Etiquetas,
  Fallos,
  Fallos_Archivos,
  Juzgados,
  Provincias,
  Reclamos,
  Rubros,
  Tipo_Juicio,
} from "../../models/index.js";

export const getFallosById = async (id) => {
  return Fallos.findByPk(id, {
    include: [
      {
        model: Juzgados,
        include: [{ model: Ciudades, include: [Provincias] }],
      },
      Tipo_Juicio,
      Reclamos,
      Rubros,
      Empresas,
      Etiquetas,
      Fallos_Archivos,
      Divisas,
    ],
  });
};

export const noChangesDetected = (changes, files) => {
  return (
    Object.keys(changes).length === 0 &&
    Object.getOwnPropertySymbols(changes).length === 0 &&
    files === null
  );
};

export const processChanges = (changes, oldValues) => {
  const veredictData = {};

  for (const key in changes) {
    switch (key) {
      case "fecha":
        veredictData.fecha = dayjs(changes.fecha, "DD/MM/YYYY").format(
          "YYYY/MM/DD"
        );
        break;
      case "actor":
        veredictData.agent = changes.actor;
        break;
      case "juzgado" || "ciudad" || "provincia":
        if (
          changes.ciudad === "null" ||
          changes.provincia === "null" ||
          changes.juzgado == "null"
        ) {
          veredictData.tribunalid = null;
        } else {
          veredictData.tribunalid = changes.juzgado;
        }
        break;
      case "resumen":
        veredictData.summary = changes.resumen;
        break;
      case "punitivo":
        if (changes.punitivo == "") {
          veredictData.divisa = 0;
        } else {
          veredictData.punitive = changes.punitivo;
        }
        break;
      case "moral":
        if (changes.moral == "") {
          veredictData.moral = 0;
        } else {
          veredictData.moral = changes.moral;
        }
        break;
      case "patrimonial":
        if (changes.patrimonial == "") {
          veredictData.patrimonial = 0;
        } else {
          veredictData.patrimonial = changes.patrimonial;
        }
        break;
      case "divisa":
        if (changes.divisa == "null") {
          veredictData.idDivisa = 7;
        } else {
          veredictData.idDivisa = changes.divisa;
        }
        break;
      case "tipoJuicio":
        veredictData.tipojuicio =
          changes.tipoJuicio !== "null"
            ? changes.tipoJuicio
            : oldValues.tipoJuicio;
        break;
    }
  }

  return veredictData;
};

export const updateRecord = async (record, data) => {
  record.update(data);
  await record.save();
};

export const compareObjects = (obj1, obj2) => {
  const changedProperties = {};

  // Recorre todas las propiedades del primer objeto
  for (const key in obj1) {
    // Verifica si la propiedad existe en el segundo objeto
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      // Si las propiedades son objetos, llama recursivamente a la función
      if (typeof obj1[key] === "object" && obj1[key] !== null) {
        // Verifica si el valor en obj2 también es un array
        if (Array.isArray(obj2[key])) {
          // Compara los elementos de ambos arrays
          const differences1 = obj2[key].filter(
            (item) => !obj1[key].includes(item)
          );
          const differences2 = obj1[key].filter(
            (item) => !obj2[key].includes(item)
          );
          // Si hay diferencias en alguno de los arrays, agrega la propiedad al objeto de propiedades cambiadas
          if (differences1.length > 0 || differences2.length > 0) {
            changedProperties[key] = obj1[key];
          }
        } else {
          // Si no, llama recursivamente a la función
          const nestedChanges = compareObjects(obj1[key], obj2[key]);
          // Si hay cambios en las propiedades anidadas, agregarlas al objeto de propiedades cambiadas
          if (Object.keys(nestedChanges).length > 0) {
            changedProperties[key] = nestedChanges;
          }
        }
      } else {
        // Compara el valor de la propiedad en ambos objetos
        if (obj1[key] !== obj2[key]) {
          // Si los valores son diferentes, agrega la propiedad al objeto de propiedades cambiadas
          changedProperties[key] = obj1[key];
        }
      }
    }
  }

  return changedProperties;
};
