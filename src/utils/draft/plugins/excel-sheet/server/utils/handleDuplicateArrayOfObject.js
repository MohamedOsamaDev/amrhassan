const handleDuplicateArrayOfObject = (array, key) => {
  try {
    let uniqueObjects = Array.from(new Set(array.map((a) => a[key]))).map(
      (val) => {
        return array.find((a) => a[key] === val);
      }
    );
    return uniqueObjects;
  } catch (error) {
    return array;
  }
};
module.exports = handleDuplicateArrayOfObject;
