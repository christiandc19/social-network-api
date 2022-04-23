const mongoose = require('mongoose');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./routes'));


// set up Mongoose to connect when we start the app. 18.1.5
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:/social-network-api', { // mongoose.connect() tells Mongoose which database we want to connect to.
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Use this to log mongo queries being executed!
mongoose.set('debug', true);

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
