'use strict'

const express = require('express');
const articleController = require('../controller/articleController');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './upload/articles'});

// routes definition
router.get('/article?:last?:title?:content?', articleController.getAllArticles);
router.get('/article/:id', articleController.getArticleById);
router.post('/article', articleController.createArticle);
router.put('/article/:id', articleController.updateArticle);
router.delete('/article/:id', articleController.deleteArticle);
router.post('/article/:id/upload-image', md_upload, articleController.upload);
router.get('/article/:id/get-image', articleController.getImage)

module.exports = router;