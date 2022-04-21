const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

const { Users, Thoughts } = require('./models');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:3001/social-network-api',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

//Use this to log mongo queries being executed!
mongoose.set('debug', true);


app.get('/users', (req, res) => {
    Note.find({})
      .then(dbUsers => {
        res.json(dbUsers);
      })
      .catch(err => {
        res.json(err);
      });
  });





app.listen(PORT, () => {
    console.log(`🌍 App running on port ${PORT}!`);
  });
  