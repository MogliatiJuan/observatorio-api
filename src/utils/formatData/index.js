const capitalizeFirstLetter = (value, amount = 0) => {
  if (amount === 1) {
    if (typeof value !== "string" || value.length === 0) {
      return value;
    }
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  } else {
    value = value?.toString();
    value = value?.toLowerCase();
    const words = value?.split(" ");
    for (let i = 0; i < words?.length; i++) {
      words[i] = words[i]?.charAt(0).toUpperCase() + words[i]?.slice(1);
    }
    value = words?.join(" ");
    return value;
  }
};

export default capitalizeFirstLetter;
