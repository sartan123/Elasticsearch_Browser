var express = require('express');
var router = express.Router();

const elasticsearch = require('elasticsearch');

const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

const search = function search(body) {
    return esClient.search(body);
  };

/* GET home page. */
router.get('/', function(req, res, next) {
    var data = {
        title: '検索結果',
        content: 'メニュー画面から検索してください。',
        keyword: ''
    }
    res.render('/search_show', data);
});

router.post('/', function(req, res, next){
    var author = req.body.author;
    var title = "*" + req.body.title + "*";
    var content = "*" + req.body.content + "*";
    var q1 = req.body.q1;
    if(q1 == 'OR')
    {
        var searchParams = {
            index: 'sample',
            type: 'doc',
            body: {
                size: 50,
                query: {
                    bool:{
                        should: [
                            {match: { author: author}},
                            {wildcard: { title: title}},
                            {wildcard: { content: content }}     
                        ]
                    }
                }
            }
        };
    }
    else{
        var searchParams = {
            index: 'sample',
            type: 'doc',
            body: {
                size: 50,
                query: {
                    bool:{
                        must:[
                            {match: { author: author}},
                            {wildcard: { title: title}},
                            {wildcard: { content: content }}  
                        ]
                    }

                }
            }
        };       
    }

    search(searchParams).then(function(result){
        var query = {
            id: "",
            author: "",
            title: "",
            content: ""
        }
        var data = {
            title: '検索結果',
            content: '検索結果',
            keyword: result.hits.hits,
            query: query
        }
        res.render('search_show', data);
    })

});

module.exports = router;