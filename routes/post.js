require('date-utils');
var express = require('express');
var router = express.Router();

const fs = require('fs');

const elasticsearch = require('elasticsearch');

const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

const post = function post(body) {
    return esClient.index(body)
  };

/* GET home page. */
router.get('/', function(req, res, next) {
    var content = {
        author: "",
        title: "",
        content: ""
    }
    var data = {
        title: 'データの追加',
        content: 'クエリを指定',
        keyword: content
    }
    res.render('post', data);
});

router.post('/', function(req, res, next){
    var dt = new Date();
    var author  = req.body.author;
    var title   = req.body.title;
    var content = req.body.content;
    var create_date = dt.toFormat("YYYY/MM/DD");
    var last_update = dt.toFormat("YYYY/MM/DD");

    id = 0;
    fs.readFile("./routes/id.txt", "utf8", function(err, data){
        id = Number(data);
        id += 1;

        var postInfo = {
            index: 'sample',
            type: 'doc',
            id: id,
            body: {
                author: author,
                title: title,
                content: content,
                create_date: create_date,
                last_update: last_update
            }
        };
        esClient.index(postInfo, function(result){
            var content = {
                author: author,
                title: title,
                content: content,
            }
            fs.writeFile("./routes/id.txt", id, function(err){
                var data = {
                    title: 'データ追加',
                    content: '成功しました',
                    keyword: content
                }
                res.render('post', data);                
            })

        })
    });

});

module.exports = router;