"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUnicode = void 0;
var removeUnicode = function (str) {
    // const search_ = 'u2028';   // 'u2028', '\x2028'
    var result = str.replace(/\xa0/g, ' '); // <0xa0>
    var res = result.replace(/\u2028/g, " ").replace(/\u2029/g, " "); // <0x2028>
    return res;
};
exports.removeUnicode = removeUnicode;
