'use strict'

const Article = require('../model/article');
const fs = require('fs');
const path = require('path');

const controller = {
    getAllArticles: (req, res) => {
        const lastParam = req.query.last;
        const titleFilter = req.query.title;
        const contentFilter = req.query.content;
        
        var query = Article.find({});
        if (lastParam || lastParam !== undefined) {
            query.limit(1).sort({ _id: -1});
        }

        if (titleFilter || titleFilter !== undefined) {
            query.find({"title" : {"$regex" : titleFilter, "$options": "i"}})
        }

        if (contentFilter || contentFilter !== undefined) {
            query.find({"content" : {"$regex" : contentFilter, "$options": "i"}})
        }

        query.exec((err, articles) => {
            if (err) {
                return res.status(500).send({
                    error: 500, 
                    message: 'Internal Server Error - Error trying to retrieve the articles'
                });
            }

            return res.status(200).send(articles);
        });
    },
    getArticleById: (req, res) => {
        const id = req.params.id;

        if (id || id !== undefined) {
            Article.findById(id).exec((err, article) => {
                if (err) {
                    return res.status(404).send({
                        error: 404, 
                        message: 'Not found - Article not found in the system'
                    });
                }

                return res.status(200).send(article);
            });
        }
        else {
            return res.status(400).send({
                error: 400, 
                message: 'Bad request - Please check the introduced id'
            });
        }
    },
    createArticle : (req, res) => {
        const params = req.body;

        if (params.title && params.content) {
            var article = new Article();
            
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            article.save((err, articleStore) => {
                if (err || !articleStore) {
                    return res.status(500).send({
                        error: 500, 
                        message: 'Internal Server Error - The article was not created correctly'
                    });
                }
            });

            return res.status(201).send(article);
        } 
        else {
            return res.status(400).send({
                error: 400, 
                message: 'Bad request - Please specify the article information correctly'
            });
        }
    },
    updateArticle: (req, res) => {
        const id = req.params.id;

        var body = req.body;

        if (body.title && body.content && (id || id !== undefined)) {
            Article.findOneAndUpdate({_id: id}, body, {new:true}, (err, updatedArticle) => {
                if (err) {
                    return res.status(500).send({
                        error: 500, 
                        message: 'Internal Server Error - Error trying to update the article'
                    });
                }

                return res.status(204).send(updatedArticle);
            });
        } else {
            return res.status(400).send({
                error: 400, 
                message: 'Bad request - Please specify the article information correctly'
            });
        }
    }, 
    deleteArticle : (req, res) => {
        const id = req.params.id;

        if (id || id !== undefined) {
            Article.findByIdAndDelete({_id: id}, (err, deletedArticle) => {
                if (err) {
                    return res.status(500).send({
                        error: 500, 
                        message: 'Internal Server Error - Error trying to delete the article'
                    });
                }

                return res.status(204).send(deletedArticle);
            })
        }
        else {
            return res.status(400).send({
                error: 400, 
                message: 'Bad request - Please check the introduced id'
            });
        }

    }, 
    upload: (req, res) => {
        if (!req.files) {
            return res.status(400).send({
                error: 400, 
                message: 'Bad request - Image not charged'
            });
        }

        const file_path = req.files.file0.path;
        const file_name = file_path.split('\\')[2];
        const file_ext = file_name.split('\.')[1];

        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gig') {
            // Remove image
            fs.unlink(file_path, () => {
                return res.status(400).send({
                    error: 400, 
                    message: 'Bad request - The image extension is not correct'
                });
            });
        }
        else {
            const id = req.params.id;
            Article.findOneAndUpdate({_id: id}, {image: file_name}, {new:true}, (err, updatedArticle) => {
                if (err) {
                    return res.status(500).send({
                        error: 500, 
                        message: 'Internal Server Error - Error trying to save the image in the article'
                    });
                }
                
                return res.status(204).send(updatedArticle);
            });
        }
    },
    getImage : (req, res) => {
        var id = req.params.id;
        if (id || id !== undefined) { 
            Article.findById(id).exec((err, article) => {
                if (err) {
                    return res.status(404).send({
                        error: 404, 
                        message: 'Not found - Article not found in the system'
                    });
                }

                const path_file = './upload/articles/' + article.image;
                if (fs.existsSync(path_file)) {
                    return res.sendFile(path.resolve(path_file));
                }
                else {
                    return res.status(404).send({
                        error: 404, 
                        message: 'Not found - Article does not have an asigned image'
                    });
                }
            }); 
        }
    }
};

module.exports = controller;