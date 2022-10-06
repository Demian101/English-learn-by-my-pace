export const removeUnicode = (str: string) => {
  // const search_ = 'u2028';   // 'u2028', '\x2028'
  const result: string = str.replace(/\xa0/g, ' ')    // <0xa0>
  const res: string = result.replace(/\u2028/g, " ").replace(/\u2029/g, " ");  // <0x2028>
  return res
};