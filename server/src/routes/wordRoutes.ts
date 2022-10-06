import { Router } from "express";
import { getAllWords, getOneWord, addWord, updateWord, addWordExtension, getExtraInfo, getCognitionTopN, putRecogn, checkWordsExistence} from "../controllers/wordController";
const router = Router();


// 同一个路由 url，请求方法不同 , 对应的处理函数也不同 ;
router
  .route("/")
  .post(addWord)
  .get(getAllWords);
router.route("/:id/update")
  .get(updateWord);

// 获取认知度排名最低的 N 个 Master 单词
router.route("/topN")
  .get(getCognitionTopN);
router.route("/info/:id")
  .get(getExtraInfo);
router.route("/:id/addition")
  .get(getOneWord)
  .put(addWordExtension); 
router.route("/recogn")
  .put(putRecogn);
router.route("/check")
  .post(checkWordsExistence);

export default router;