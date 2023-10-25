const array_of_allowed_files = ["png", "jpeg", "jpg", "pdf"];
const array_of_allowed_file_types = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
];

const allowed_file_size = 10;

const verifySizeAndTypeFiles = (file) => {
  const file_extension = file.name.slice(
    ((file.name.lastIndexOf(".") - 1) >>> 0) + 2
  );

  if (
    !array_of_allowed_files.includes(file_extension) ||
    !array_of_allowed_file_types.includes(file.mimetype)
  ) {
    return {
      status: 415,
      fileTypes: array_of_allowed_files,
    };
  }

  if (file.size / (1024 * 1024) > allowed_file_size) {
    return {
      status: 413,
      size: allowed_file_size,
    };
  }
  return;
};

export default verifySizeAndTypeFiles;
