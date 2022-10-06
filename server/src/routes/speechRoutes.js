"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var sentenceController_1 = require("../controllers/sentenceController");
var gtts = require('node-gtts')('en');
var router = (0, express_1.Router)();
router.get('/', function (req, res) {
    try {
        res.set({ 'Content-Type': 'audio/mpeg' });
        console.log('req.query.text', req.query.text);
        gtts.stream(req.query.text).pipe(res);
    }
    catch (err) {
        console.log("error: ------- ", err);
        // res.status(500).json( {message: "Something went wrong"} )
    }
});
router.get('/:id/audio', sentenceController_1.soundStream);
exports.default = router;
