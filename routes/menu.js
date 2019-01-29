var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var content = {
        author: "",
        title: "",
        content: ""
    }
    var data = {
        title: "検索画面",
        content: "検索ワードを入力",
        keyword: content
    };
  res.render('menu', data);
});

module.exports = router;