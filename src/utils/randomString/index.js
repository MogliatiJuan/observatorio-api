const createRandomPassword = (
  longitud = 8,
  caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
) => {
  let resultado = "";
  const caracteresLongitud = caracteres.length;
  for (let i = 0; i < longitud; i++) {
    resultado += caracteres.charAt(
      Math.floor(Math.random() * caracteresLongitud)
    );
  }
  return resultado;
};

export default createRandomPassword;
