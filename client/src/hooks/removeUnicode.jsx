const removeUnicode = (str) => {
  const search_1 = '\xa0';
  // const search_2 = 'u2028';   // 'u2028', '\x2028'
  const replaceWith = ' ';
  const result = str.replaceAll(search_1, replaceWith)
  const res = result.replace(/\u2028/g, " ").replace(/\u2029/g, " ");
  return res
};

export default removeUnicode;