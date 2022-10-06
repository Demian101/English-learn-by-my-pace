import { Router } from "express";
import { 
  addSentence,
  getCognitionTopN,
  getAllSents,
  getOneSent,
  editSentence,
  similarityCalculate,
} from "../controllers/sentenceController";

// api/sentence/...

const router = Router();

// 同一个路由 url，请求方法不同 , 对应的处理函数也不同 ;
router
  .route("/")
  .post(addSentence)
  .get(getAllSents);

// 获取认知度排名最低的 N 个 句子
router.route("/topN")
  .get(getCognitionTopN);
// router.route("/info/:id")
//   .get(getExtraInfo);
router.route("/data/:id")
  .get(getOneSent)
  // .put(addWordExtension); 

router.route("/:id/edit").put(editSentence);

// compare
router.route("/:id/compare").post(similarityCalculate);

// router.route("/sig").get(getOneWordId);
// /* router.route("/refresh").post(refreshAuth); */
// router.route("/:id").get(getUserById);
// router.route("/:id/follow").get(authGuard, followUser);
// router.route("/:id/unfollow").get(authGuard, unfollowUser);
// router.route("/:id/edit").put(authGuard, upload.single("avatar"), editUser);
// router.route("/:id/followers").get(authGuard, getUserFollowers);
// router.route('/search/:query').get(searchUsers);

export default router;