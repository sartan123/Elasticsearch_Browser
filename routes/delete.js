var express = require('express');
var router = express.Router();

const elasticsearch = require('elasticsearch');

const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

/* GET home page. */
router.get('/', function(req, res, next) {
    var data = {
        title: 'データの削除',
        content: '削除する文書IDを指定',
    }
    res.render('delete', data);
});

router.post('/', function(req, res, next){
    var id = req.body.id;
    var deleteInfo = {
        index: 'sample',
        type: 'doc',
        id: id
    };

    esClient.delete(deleteInfo, function(result){
        var data = {
            title: 'データの削除',
            content: '削除しました',
        }
        res.render('delete', data);
    })

});

module.exports = router;