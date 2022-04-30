const { User } = require('../models');

const userController = {

  // ---------------------------------------------------------------------------- GET ALL USERS ( GET /api/users) ------------------------------------------------------------------------------------

  getAllUsers(req, res) {
    User.find({})
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // ---------------------------------------------------------------------------- GET A USER ( GET /api/users/:id ) ------------------------------------------------------------------------------------

  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // ---------------------------------------------------------------------------- CREATE A USER ( POST /api/users ) ------------------------------------------------------------------------------------
    // expected body:
    // {
    //     "username": "name",
    //     "email": "email@email.com" 
    // }

  createUser({ body }, res) {
    User.create(body)
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(400).json(err));
},

  // ---------------------------------------------------------------------------- UPDATE A USER ( POST /api/user/:id ) ------------------------------------------------------------------------------------
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

    // ----------------------------------------------------------------------- DELETE A USER ( POST /api/users ) ------------------------------------------------------------------------------------
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

// --------------------------------------------------------------------------------- ADD A FRIEND ---------------------------------------------------------------------------------

// POST /api/users/:userId/friends/:friendId
addFriend({ params }, res) {
  // add friendId to userId's friend list
  User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true }
  )
  .then(dbUserData => {
      if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this userId' });
          return;
      }
      res.json(dbUserData);
  })
  .catch(err => res.json(err));
},

// ---------------------------------------------------------------------------------DELETE A FRIEND ---------------------------------------------------------------------------------
// DELETE /api/users/:userId/friends/:friendId
deleteFriend({ params }, res) {
  // remove friendId from userId's friend list
  User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true}
  )
  .then(dbUserData => {
      if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this userId' });
          return;
      }
      res.json(dbUserData);
  })
  .catch(err => res.json(err));
}
}


module.exports = userController;
