const capitalize = ([firstLetter, ...restStr]) => {
  return firstLetter.toUpperCase() + restStr.join('').toLowerCase();
};

export default { capitalize };
