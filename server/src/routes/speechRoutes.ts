import { Router } from "express";
import { soundStream } from "../controllers/sentenceController";
var gtts = require('node-gtts')('en');

const router = Router();

router.get('/', function(req, res) {
  try{
    res.set({'Content-Type': 'audio/mpeg'});
    console.log('req.query.text', req.query.text)
    gtts.stream(req.query.text).pipe(res);
  }
  catch(err){
    console.log("error: ------- ", err);
    // res.status(500).json( {message: "Something went wrong"} )
  }
})

router.get('/:id/audio', soundStream);

export default router;