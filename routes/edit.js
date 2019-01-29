require('date-utils');
var express = require('express');
var router = express.Router();

const elasticsearch = require('elasticsearch');

const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

/* GET home page. */
router.get('/', function(req, res, next) {
    var id = req.query.id;
    var getParams = {
        index: 'sample',
        type: 'doc',
        id: id
    }
    esClient.get(getParams).then(function(result){
        if(result.found)
        {
            var data = {
                title: 'データの編集',
                content: 'クエリを入力',
                keyword: result,
                edit: true
            }
            res.render('edit', data);
        }
        else
        {
            var data = {
                title: 'データの編集',
                content: 'データが存在しません',
                keyword: result,
                edit: false
            }
            res.render('edit', data);
        }
    });

});

router.post('/', function(req, res, next){
    var id = req.query.id;
    var dt = new Date();
    var last_update = dt.toFormat("YYYY/MM/DD");

    var updateInfo = {
        index: 'sample',
        type: 'doc',
        id: id,
        body: {
            doc: {
                title: req.body.title,
                content: req.body.content,
                last_update: last_update
            }
        }
    };
    esClient.update(updateInfo, function(err, result){
        var getParams = {
            index: 'sample',
            type: 'doc',
            id: id
        }
        esClient.get(getParams).then(function(result2){
            var data = {
                    title: 'データ編集',
                    content: '編集しました',
                    keyword: result2,
                    edit: false
                }
            res.render('edit', data);
        })
    });           

});

module.exports = router;