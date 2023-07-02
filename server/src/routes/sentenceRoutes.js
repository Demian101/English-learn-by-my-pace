"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var sentenceController_1 = require("../controllers/sentenceController");
// api/sentence/...
var router = (0, express_1.Router)();
// 同一个路由 url，请求方法不同 , 对应的处理函数也不同 ;
router
    .route("/")
    .post(sentenceController_1.addSentence)
    .get(sentenceController_1.getAllSents);
// 获取认知度排名最低的 N 个 句子
router.route("/topN")
    .get(sentenceController_1.getCognitionTopN);
// router.route("/info/:id")
//   .get(getExtraInfo);
router.route("/data/:id")
    .get(sentenceController_1.getOneSent);
// .put(addWordExtension); 
router.route("/:id/edit").put(sentenceController_1.editSentence);
// compare
router.route("/:id/compare").post(sentenceController_1.similarityCalculate);
// concat audio
router.route("/concat").get(sentenceController_1.concatAudios);
// router.route("/sig").get(getOneWordId);
// /* router.route("/refresh").post(refreshAuth); */
// router.route("/:id").get(getUserById);
// router.route("/:id/follow").get(authGuard, followUser);
// router.route("/:id/unfollow").get(authGuard, unfollowUser);
// router.route("/:id/edit").put(authGuard, upload.single("avatar"), editUser);
// router.route("/:id/followers").get(authGuard, getUserFollowers);
// router.route('/search/:query').get(searchUsers);
exports.default = router;
