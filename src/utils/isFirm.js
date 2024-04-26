export const isFirm = (input) => {
  if (Array.isArray(input)) {
    // Convertir cada elemento a número y verificar si todos son números
    return input.every(
      (element) => !isNaN(element) && !isNaN(parseFloat(element))
    );
  } else if (typeof input === "number") {
    return !isNaN(input) && !isNaN(parseFloat(input));
  } else if (typeof input === "string") {
    // Intentar convertir la cadena a número y verificar si es un número válido
    return !isNaN(input) && !isNaN(parseFloat(input));
  } else {
    return false;
  }
};
