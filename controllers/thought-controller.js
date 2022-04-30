const Thought = require('../models/Thought');
const User = require('../models/User');

const thoughtController = {

 // ---------------------------------------------------------------------------- GET ALL THOUGHTS ( GET /api/thoughts) ------------------------------------------------------------------------------------
  getAllThoughts(req, res) {
    Thought.find({})
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // ---------------------------------------------------------------------------- GET A THOUGHT BY ID ( GET /api/thoughts/:id ) ------------------------------------------------------------------------------------
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

    // ---------------------------------------------------------------------------- CREATE A THOUGHT ( POST /api/thoughts ) ------------------------------------------------------------------------------------
    // expected body:
    // {
    //     "thoughtText": "This is a thought",
    //     "username": "Chris", 
    //     "userId": "id" 
    // }

  createThought({ body }, res) {
    Thought.create(body)
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => res.status(400).json(err));
},

  // update Thought by id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No Thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },

  // ---------------------------------------------------------------------------- DELETE A THOUGHT BY ID ( DELETE /api/thoughts/:id ) ------------------------------------------------------------------------------------
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No Thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },

  // ---------------------------------------------------------------------------- CREATE A REACTION ( GET /api/thoughts/:id/reactions ) ------------------------------------------------------------------------------------
  addReaction({params, body}, res) {
    Thought.findOneAndUpdate(
      {_id: params.thoughtId},
      {$addToSet: { reactions: body}},
      {new: true, runValidators: true}
    )
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No Thought found with this id!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.status(400).json(err));
  },


  // ---------------------------------------------------------------------------- DELETE A REACTION ( DELETE /api/thoughts/:id/reactions/:id ) ------------------------------------------------------------------------------------
  deleteReaction({params, body}, res) {
    console.log(params);
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: body.reactionId } } },
            { new: true, runValidators: true }
    )
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No Thought found with this id!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.status(400).json(err));
  },

};


module.exports = thoughtController;
