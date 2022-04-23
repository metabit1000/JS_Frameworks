'use strict'
const mongoose = require('mongoose'); //import mongoose library
const app = require('./app');
const port = 3900;

mongoose.Promise = global.Promise;
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/api_rest_blog', {useNewUrlParser: true});
        console.log('Correctly connected to mongodb');

        // Web server creation
        app.listen(port, () => {
            console.log('Web server running in localhost:' + port);
        });
    } catch(err) {
        console.log("Error trying to connect to mongodb", err);
    }
};

connectDB();