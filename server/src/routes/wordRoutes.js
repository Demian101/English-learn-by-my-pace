"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var wordController_1 = require("../controllers/wordController");
var router = (0, express_1.Router)();
// 同一个路由 url，请求方法不同 , 对应的处理函数也不同 ;
router
    .route("/")
    .post(wordController_1.addWord)
    .get(wordController_1.getAllWords);
router.route("/:id/update")
    .get(wordController_1.updateWord);
// 获取认知度排名最低的 N 个 Master 单词
router.route("/topN")
    .get(wordController_1.getCognitionTopN);
router.route("/info/:id")
    .get(wordController_1.getExtraInfo);
router.route("/:id/addition")
    .get(wordController_1.getOneWord)
    .put(wordController_1.addWordExtension);
router.route("/recogn")
    .put(wordController_1.putRecogn);
router.route("/check")
    .post(wordController_1.checkWordsExistence);
exports.default = router;
