const capitalizeFirstLetter = (value) => {
  value = value?.toString();
  value = value?.toLowerCase();
  const words = value?.split(" ");
  for (let i = 0; i < words?.length; i++) {
    words[i] = words[i]?.charAt(0).toUpperCase() + words[i]?.slice(1);
  }
  value = words?.join(" ");
  return value;
};

export default capitalizeFirstLetter;
